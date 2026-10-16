// @ts-check
/**
 * Fails when any built HTML page, or the server bundle's CSS/JS links for
 * on-demand pages, references a `/_astro/` asset that is not in `dist`, which
 * is what a stale incremental-build restore looks like.
 *
 * Usage: node scripts/check-dist-asset-links.mjs [distDir]
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Astro emits `[name].[hash].[ext]` with only these characters, which also stops a
// match from running into HTML-escaped JSON such as `.jpg&quot;],&quot;title...`.
const ASSET_REF = /\/_astro\/[\w.-]+/g
// The server bundle also names images that only prerendered pages emit, so only
// its stylesheet and script links are expected to exist in the client output.
const SERVER_ASSET_REF = /\/_astro\/[\w.-]+\.(?:css|js)\b/g

/** @param {string} dir @param {RegExp} name @returns {string[]} */
function filesMatching(dir, name) {
    const out = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) out.push(...filesMatching(full, name))
        else if (name.test(entry.name)) out.push(full)
    }
    return out
}

/**
 * Map of missing asset path to the pages (or server chunks) that reference it.
 * @param {string} distDir @param {string} [serverDir] @returns {Map<string, string[]>}
 */
export function findDanglingAssetLinks(distDir, serverDir) {
    const sources = filesMatching(distDir, /\.html$/).map((file) => ({
        file,
        label: path.relative(distDir, file),
        refs: ASSET_REF,
    }))
    if (serverDir) {
        for (const file of filesMatching(serverDir, /\.mjs$/)) {
            sources.push({ file, label: path.relative(path.dirname(serverDir), file), refs: SERVER_ASSET_REF })
        }
    }
    const missing = new Map()
    const seen = new Map()
    for (const { file, label, refs } of sources) {
        const content = fs.readFileSync(file, "utf-8")
        for (const ref of new Set(content.match(refs) ?? [])) {
            let exists = seen.get(ref)
            if (exists === undefined) {
                exists = fs.existsSync(path.join(distDir, ref))
                seen.set(ref, exists)
            }
            if (exists) continue
            const pages = missing.get(ref) ?? []
            pages.push(label)
            missing.set(ref, pages)
        }
    }
    return missing
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    // Server-output builds (the Cloudflare adapter) put static files in dist/client.
    const candidates = [process.argv[2] ?? "dist"].flatMap((d) => [d, path.join(d, "client")])
    const distDir = candidates
        .map((d) => path.resolve(d))
        .find((d) => fs.existsSync(path.join(d, "_astro")))
    if (!distDir) {
        console.error(`No _astro directory under ${candidates.join(" or ")}, nothing to check`)
        process.exit(1)
    }
    // On-demand pages render in the Worker, so their links live in dist/server.
    const serverDir = path.basename(distDir) === "client" ? path.join(path.dirname(distDir), "server") : undefined
    const missing = findDanglingAssetLinks(distDir, serverDir && fs.existsSync(serverDir) ? serverDir : undefined)
    if (missing.size === 0) {
        console.log("All /_astro/ references resolve to files in dist")
        process.exit(0)
    }
    console.error(`${missing.size} /_astro/ reference(s) point at files missing from dist:`)
    for (const [ref, pages] of missing) {
        const sample = pages.slice(0, 3).join(", ")
        const more = pages.length > 3 ? ` and ${pages.length - 3} more` : ""
        console.error(`  ${ref}  <- ${pages.length} page(s): ${sample}${more}`)
    }
    console.error(
        "Stale pages restored by the incremental build? The deploy job rebuilds without the cache on its own; locally, delete node_modules/.astro/incremental-build.json and rebuild.",
    )
    process.exit(1)
}