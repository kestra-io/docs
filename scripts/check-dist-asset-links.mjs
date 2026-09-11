// @ts-check
/**
 * Fails when any built HTML page references a `/_astro/` asset that is not in
 * `dist`, which is what a stale incremental-build restore looks like.
 *
 * Usage: node scripts/check-dist-asset-links.mjs [distDir]
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Astro emits `[name].[hash].[ext]` with only these characters, which also stops a
// match from running into HTML-escaped JSON such as `.jpg&quot;],&quot;title...`.
const ASSET_REF = /\/_astro\/[\w.-]+/g

/** @param {string} dir @returns {string[]} */
function htmlFiles(dir) {
    const out = []
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) out.push(...htmlFiles(full))
        else if (entry.name.endsWith(".html")) out.push(full)
    }
    return out
}

/**
 * Map of missing asset path to the pages that reference it.
 * @param {string} distDir @returns {Map<string, string[]>}
 */
export function findDanglingAssetLinks(distDir) {
    const missing = new Map()
    const seen = new Map()
    for (const file of htmlFiles(distDir)) {
        const html = fs.readFileSync(file, "utf-8")
        for (const ref of new Set(html.match(ASSET_REF) ?? [])) {
            let exists = seen.get(ref)
            if (exists === undefined) {
                exists = fs.existsSync(path.join(distDir, ref))
                seen.set(ref, exists)
            }
            if (exists) continue
            const pages = missing.get(ref) ?? []
            pages.push(path.relative(distDir, file))
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
    const missing = findDanglingAssetLinks(distDir)
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
        "Stale HTML restored by the incremental build? Clear the astro-build-* Actions cache and rebuild.",
    )
    process.exit(1)
}