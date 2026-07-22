import sharp from "sharp"
import { readdir, readFile, writeFile, unlink } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"

/**
 * Astro integration: convert CSS-referenced raster images to WebP.
 *
 * ## Why this exists
 *
 * Astro's image optimizer (`<Image>` / `<Picture>` / `getImage()`) only touches
 * images that pass through those APIs. Images referenced from a CSS
 * `background: url(...)` — including `<style>` blocks in `.astro` and `.vue`
 * files — are a documented blind spot (withastro/roadmap#1333): Vite
 * fingerprints and copies them byte-for-byte, so a 1 MB source PNG ships as a
 * 1 MB asset.
 *
 * This lets authors keep the PNG/JPEG as the source of truth in `src/` (edit it
 * freely, no optimization knowledge required) while the build serves a WebP.
 *
 * ## How
 *
 * It runs in `astro:build:done`, operating on the fully assembled output. Two
 * earlier designs failed and are recorded so nobody re-treads them:
 *
 *   - Mutating Rollup's `bundle` in `generateBundle` — Rolldown (which this
 *     Astro uses) silently *ignores* `bundle[...]` assignment, so the CSS was
 *     rewritten to a WebP that was never emitted (dangling reference).
 *   - Walking only `dist/client` — the list pages are server-rendered, so their
 *     `url()` lives in `dist/server` CSS (and SSR `.mjs` chunks) while the
 *     served file sits in `dist/client/_astro`. The reference and the asset are
 *     in different directories, so the whole `outDir` must be processed as one.
 *
 * Algorithm over the whole `outDir`:
 *
 *   1. find every raster referenced inside a CSS `url(...)` (in any css/js/mjs/
 *      html file — this is what distinguishes a background from an `<img>`/OG
 *      image, which never uses `url()`),
 *   2. re-encode each to WebP with sharp (keep the original if WebP isn't
 *      smaller),
 *   3. write the WebP next to every copy of the original across the output,
 *   4. rewrite every reference `name.png` -> `name.webp` in all text files,
 *   5. delete every copy of the original.
 *
 * Because emitted asset names are content-hashed (globally unique), replacing
 * the bare hashed filename across text files is exact and collision-free.
 *
 * ## What it deliberately does NOT touch
 *
 *   - SVGs (vector) and GIFs (animation not preserved here).
 *   - Images handled by `astro:assets` — already optimized with their own names.
 *   - Any raster NOT referenced from a CSS `url(...)`. OG/social images live in
 *     `<meta property="og:image" content="...">`, never in `url()`, so they're
 *     out of scope by construction — Slack/LinkedIn/X don't reliably render
 *     WebP, so those must stay PNG/JPEG. The `exclude` pattern is a 2nd guard.
 *
 * @param {object} [options]
 * @param {number} [options.quality=80] WebP quality (1-100).
 * @param {number} [options.minBytes=4096] Skip sources smaller than this.
 * @param {RegExp} [options.include] Which asset filenames to consider.
 * @param {RegExp} [options.exclude] Filenames to skip even if referenced.
 * @returns {import("astro").AstroIntegration}
 */
export default function cssImageWebp(options = {}) {
    const {
        quality = 80,
        minBytes = 4096,
        include = /\.(png|jpe?g)$/i,
        exclude = /(favicon|apple-touch|og[-_.]|social[-_.])/i,
    } = options

    const TEXT = /\.(css|m?js|html?|json|txt|xml)$/i
    const URL_RE = /url\(\s*['"]?([^)'"]+)['"]?\s*\)/g

    let outDir = null

    return {
        name: "css-image-webp",
        hooks: {
            "astro:config:done": ({ config }) => {
                outDir = fileURLToPath(config.outDir)
            },
            "astro:build:done": async ({ dir, logger }) => {
                const root = outDir ?? fileURLToPath(dir)
                const files = await walk(root)

                // All candidate raster copies, grouped by basename (same hash =
                // identical bytes, so multiple dirs can hold the same asset).
                const rasterCopies = new Map() // base -> string[] paths
                for (const f of files) {
                    const base = path.basename(f)
                    if (!include.test(base) || exclude.test(base)) continue
                    if (!rasterCopies.has(base)) rasterCopies.set(base, [])
                    rasterCopies.get(base).push(f)
                }
                if (rasterCopies.size === 0) return

                const textFiles = files.filter((f) => TEXT.test(f))

                // Pass 1 — which rasters appear inside a CSS url()? Those are the
                // backgrounds we optimize; everything else is left untouched.
                const backgrounds = new Set()
                for (const f of textFiles) {
                    const text = await readFile(f, "utf8").catch(() => "")
                    if (!text) continue
                    for (const m of text.matchAll(URL_RE)) {
                        const ref = path.basename(m[1].split("?")[0])
                        if (rasterCopies.has(ref)) backgrounds.add(ref)
                    }
                }
                if (backgrounds.size === 0) return

                // Convert each background once; write WebP next to every copy.
                const rewrites = new Map() // pngBase -> webpBase
                let converted = 0
                let savedBytes = 0

                for (const base of backgrounds) {
                    const copies = rasterCopies.get(base)
                    const original = await readFile(copies[0])
                    if (original.length < minBytes) continue

                    let webp
                    try {
                        webp = await sharp(original).webp({ quality }).toBuffer()
                    } catch (err) {
                        logger.warn(`could not convert ${base}: ${err.message}`)
                        continue
                    }
                    if (webp.length >= original.length) continue // no win

                    const webpBase = base.replace(include, ".webp")
                    for (const copy of copies) {
                        await writeFile(
                            path.join(path.dirname(copy), webpBase),
                            webp,
                        )
                    }
                    rewrites.set(base, webpBase)
                    converted++
                    savedBytes += original.length - webp.length
                }
                if (rewrites.size === 0) return

                // Pass 2 — rewrite every reference (url(), preload hrefs, SSR
                // chunk strings) from the PNG name to the WebP name.
                for (const f of textFiles) {
                    const text = await readFile(f, "utf8").catch(() => "")
                    if (!text) continue
                    let next = text
                    for (const [base, webpBase] of rewrites) {
                        if (next.includes(base))
                            next = next.split(base).join(webpBase)
                    }
                    if (next !== text) await writeFile(f, next)
                }

                // Delete every copy of every converted original.
                for (const [base] of rewrites) {
                    for (const copy of rasterCopies.get(base)) {
                        await unlink(copy).catch(() => {})
                    }
                }

                logger.info(
                    `converted ${converted} CSS background image(s) to WebP, saved ~${Math.round(
                        savedBytes / 1024,
                    )} KiB`,
                )
            },
        },
    }
}

/** Recursively list all file paths under `dir`. */
async function walk(dir) {
    const out = []
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => [])
    for (const entry of entries) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) out.push(...(await walk(full)))
        else out.push(full)
    }
    return out
}
