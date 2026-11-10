// Records computed styles for every probed element, at desktop and mobile
// widths, into a JSON file. Feed two of them to diff.mjs.
import { chromium } from "@playwright/test"
import fs from "node:fs"

// PLAYWRIGHT_CHROMIUM lets a sandbox point at a preinstalled binary.
const LAUNCH = process.env.PLAYWRIGHT_CHROMIUM
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM }
    : {}

const URL = "http://127.0.0.1:4173/harness/index.html"
const outFile = process.argv[2]
if (!outFile) {
    console.error("usage: node harness/snapshot.mjs <out.json>")
    process.exit(2)
}

const PROPS = [
    "display", "position", "width", "height", "margin", "padding", "border", "borderRadius",
    "color", "backgroundColor", "backgroundImage", "fontSize", "fontWeight", "lineHeight",
    "textAlign", "whiteSpace", "verticalAlign", "flexDirection", "flexWrap", "alignItems",
    "justifyContent", "gap", "gridTemplateColumns", "listStyleType", "boxShadow", "opacity",
    "overflow", "maxWidth", "minWidth", "zIndex", "textDecorationLine", "transition",
]

const VIEWPORTS = [
    ["desktop", { width: 1280, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
]

const browser = await chromium.launch(LAUNCH)
const snap = {}

for (const [name, viewport] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport })
    const page = await ctx.newPage()
    await page.goto(URL, { waitUntil: "load" })
    await page.waitForTimeout(600)

    snap[name] = await page.evaluate((props) => {
        // Everything inside a `real-*` wrapper is probed, so a real
        // component's own overrides are part of the snapshot and not just the
        // styleguide's synthetic markup. Probe names carry the tag and class
        // list so a diff says which element moved.
        for (const host of document.querySelectorAll("[class^='real-']")) {
            let i = 0
            for (const el of host.querySelectorAll("*")) {
                const classes = (el.className || "").toString().trim().replace(/\s+/g, ".")
                el.dataset.probe = `${host.className}/${i++}:${el.tagName.toLowerCase()}.${classes}`
            }
        }

        const out = {}
        for (const el of document.querySelectorAll("[data-probe]")) {
            const cs = getComputedStyle(el)
            const rec = {}
            for (const k of props) rec[k] = cs[k]
            const r = el.getBoundingClientRect()
            rec._box = [Math.round(r.width), Math.round(r.height)]
            for (const pseudo of ["::before", "::after"]) {
                const pc = getComputedStyle(el, pseudo)
                if (pc.content && pc.content !== "none") {
                    rec[pseudo] = [pc.content, pc.color, pc.display, pc.padding, pc.float].join("|")
                }
            }
            out[el.dataset.probe] = rec
        }
        return out
    }, PROPS)

    await ctx.close()
}

await browser.close()
fs.writeFileSync(outFile, JSON.stringify(snap, null, 1))
console.log("wrote", outFile, Object.keys(snap.desktop).length, "probes")
