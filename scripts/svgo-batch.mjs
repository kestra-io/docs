#!/usr/bin/env node
/**
 * Optimise SVGs on disk.
 *
 * Files under public/ never reach Astro's experimental.svgOptimizer, which only
 * sees assets imported through astro:assets, so nothing optimises them at build
 * time. This does.
 *
 * Precision is per file rather than global. Three decimals is right almost
 * everywhere, but the generated dot-grid <pattern> tiles carry a pitch of
 * 15.018797 by 15.025961, and rounding that drifts the field by up to 123/255
 * across 160 columns. Those keep six.
 */
import { optimize } from "svgo"
import { readFileSync, writeFileSync, statSync } from "node:fs"
import { readdir } from "node:fs/promises"
import { join, extname } from "node:path"

const ROOTS = ["public", "src"]
const SKIP = new Set(["node_modules", ".git", ".astro", "dist"])
const MIN_BYTES = Number(process.env.MIN_BYTES ?? 5 * 1024)
const check = process.argv.includes("--check")

const config = (precise) => ({
    multipass: true,
    plugins: [
        {
            name: "preset-default",
            params: {
                overrides: {
                    // several of these are inlined into one document with ?raw,
                    // where renamed ids collide across icons
                    cleanupIds: false,
                    // Figma wraps rasters in patterns scaled by factors like
                    // 0.000381825; five significant digits drops two of them and
                    // visibly moves the image. The plugin saves 0.01 MB here.
                    convertTransform: false,
                    // collapsing a group changes the bounding box that a
                    // gradientUnits="objectBoundingBox" gradient resolves
                    // against, flattening gradients on the isometric artwork
                    collapseGroups: false,
                    // rect -> path loses rounded-corner geometry inside a
                    // transformed group (preview-access Logo_kestra.svg)
                    convertShapeToPath: false,
                },
                ...(precise ? { floatPrecision: 6 } : {}),
            },
        },
    ],
})

async function* walk(dir) {
    for (const e of await readdir(dir, { withFileTypes: true })) {
        if (SKIP.has(e.name)) continue
        const p = join(dir, e.name)
        if (e.isDirectory()) yield* walk(p)
        else if (extname(e.name) === ".svg") yield p
    }
}

let count = 0, before = 0, after = 0
const stale = []
for (const root of ROOTS) {
    for await (const file of walk(root)) {
        const size = statSync(file).size
        if (size < MIN_BYTES) continue
        const src = readFileSync(file, "utf8")
        const { data } = optimize(src, config(src.includes("patternUnits")))
        count++
        before += size
        after += Buffer.byteLength(data)
        if (data === src) continue
        if (check) stale.push(file)
        else writeFileSync(file, data)
    }
}

const pct = before ? Math.round(100 - (100 * after) / before) : 0
console.log(`${count} files, ${(before / 1048576).toFixed(2)} MB -> ${(after / 1048576).toFixed(2)} MB (${pct}%)`)
if (check && stale.length) {
    console.error(`\n${stale.length} file(s) are not optimised. Run: npm run svgo`)
    for (const f of stale) console.error(`  ${f}`)
    process.exit(1)
}
