// Every bootstrap-shaped class the markup uses, checked against the CSS this
// repo actually generates. The utilities map lists what exists, so a class the
// map does not cover simply does not apply — no build error, no type error,
// nothing at runtime. That is how `order-md-*` went missing and flipped every
// alternating feature row, and how `bg-primary` left the edition badges
// invisible.
//
//   npx sass --load-path=node_modules --load-path=src/assets/styles \
//     src/assets/styles/vendor.scss /tmp/vendor.css --no-source-map
//   npx sass --load-path=node_modules --load-path=src/assets/styles \
//     src/assets/styles/app.scss /tmp/app.css --no-source-map
//   node harness/coverage.mjs /tmp/vendor.css /tmp/app.css
import fs from "node:fs"
import path from "node:path"

const sheets = process.argv.slice(2)
if (!sheets.length) {
    console.error("usage: node harness/coverage.mjs <compiled.css>...")
    process.exit(2)
}

const defined = new Set()
const collect = (text) => {
    for (const m of text.matchAll(/\.(-?[A-Za-z_][A-Za-z0-9_-]*)/g)) defined.add(m[1])
}
for (const s of sheets) collect(fs.readFileSync(s, "utf8"))

const walk = (dir, out = []) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(p, out)
        else if (/\.(vue|astro)$/.test(entry.name)) out.push(p)
    }
    return out
}
const files = walk("src")
// A component styling its own class counts as defining it.
for (const f of files) collect(fs.readFileSync(f, "utf8"))

// Only names shaped like bootstrap utilities or components, so the project's
// own vocabulary does not drown the signal.
const SHAPE =
    /^(d|flex|justify|align|order|m|mt|mb|ms|me|mx|my|p|pt|pb|ps|pe|px|py|gap|row|col|g|gx|gy|text|bg|border|rounded|shadow|position|top|bottom|start|end|w|h|mw|mh|fs|fw|fst|lh|font|offset|btn|card|nav|navbar|badge|modal|dropdown|breadcrumb|pagination|page|form|input|list|table|close|collapse|fade|show|visually|ratio|float|container|sticky|fixed|overflow|opacity|invisible|visible|vstack|hstack|link|img|lead|display|z)(-|$)/

const missing = new Map()
for (const f of files) {
    const src = fs.readFileSync(f, "utf8")
    for (const m of src.matchAll(
        /(?:\bclass(?::list)?(?:Name)?\s*=\s*)(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})|classList\.(?:add|remove|toggle|replace)\(([^)]*)\)/g,
    )) {
        for (const raw of (m[1] ?? m[2] ?? m[3] ?? m[4] ?? "").split(/[\s"'`,[\]{}]+/)) {
            const name = raw.trim()
            if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) continue
            if (!SHAPE.test(name) || defined.has(name)) continue
            if (!missing.has(name)) missing.set(name, new Set())
            missing.get(name).add(f)
        }
    }
}

// Classes bootstrap 5 itself never shipped (v4 leftovers, typos, out-of-range
// grid columns). They were inert before this repo owned its CSS and are inert
// now, so they are reported separately rather than as regressions.
const NEVER_IN_BOOTSTRAP5 = new Set([
    "align", "badge-major", "badge-minor", "col-md-13", "d-100",
    "form-group", "form-row", "page-icon", "table-content", "text-left",
])

const real = [...missing].filter(([n]) => !NEVER_IN_BOOTSTRAP5.has(n)).sort()
const inert = [...missing].filter(([n]) => NEVER_IN_BOOTSTRAP5.has(n)).sort()

for (const [name, where] of real) {
    console.log(`MISSING  ${name}  ::  ${[...where].slice(0, 3).join(", ")}`)
}
if (inert.length) {
    console.log(`\n(${inert.length} inert on bootstrap too, ignored: ${inert.map(([n]) => n).join(", ")})`)
}
console.log(real.length ? `\n${real.length} undefined` : "\nno undefined utility in markup")
process.exit(real.length ? 1 : 0)
