// Diffs two snapshot.mjs outputs. Non-zero exit if anything moved.
import fs from "node:fs"

const [before, after] = process.argv.slice(2)
if (!before || !after) {
    console.error("usage: node harness/diff.mjs <before.json> <after.json>")
    process.exit(2)
}

const a = JSON.parse(fs.readFileSync(before, "utf8"))
const b = JSON.parse(fs.readFileSync(after, "utf8"))
let n = 0

for (const viewport of Object.keys(a)) {
    const ka = new Set(Object.keys(a[viewport]))
    const kb = new Set(Object.keys(b[viewport]))
    for (const k of ka) if (!kb.has(k)) { console.log(`${viewport}: probe GONE ${k}`); n++ }
    for (const k of kb) if (!ka.has(k)) { console.log(`${viewport}: probe NEW  ${k}`); n++ }
    for (const probe of ka) {
        if (!kb.has(probe)) continue
        for (const key of Object.keys(a[viewport][probe])) {
            const av = JSON.stringify(a[viewport][probe][key])
            const bv = JSON.stringify(b[viewport][probe][key])
            if (av !== bv) { console.log(`${viewport}/${probe}.${key}:  ${av}  ->  ${bv}`); n++ }
        }
    }
}

console.log(n === 0 ? "\nno computed-style changes" : `\n${n} differences`)
process.exit(n === 0 ? 0 : 1)
