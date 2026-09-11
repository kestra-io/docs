import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { findDanglingAssetLinks } from "../../scripts/check-dist-asset-links.mjs"

const dirs: string[] = []

function makeDist(files: Record<string, string>): string {
    const dist = fs.mkdtempSync(path.join(os.tmpdir(), "dist-"))
    dirs.push(dist)
    for (const [rel, content] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(path.join(dist, rel)), { recursive: true })
        fs.writeFileSync(path.join(dist, rel), content)
    }
    return dist
}

afterEach(() => {
    for (const dir of dirs.splice(0)) fs.rmSync(dir, { recursive: true, force: true })
})

describe("findDanglingAssetLinks", () => {
    it("passes when every reference exists", () => {
        const dist = makeDist({
            "_astro/layout.D9L1Yhct.css": "",
            "_astro/hero.abc123.webp": "",
            "docs/index.html": `<link rel="stylesheet" href="/_astro/layout.D9L1Yhct.css">
                <img srcset="/_astro/hero.abc123.webp?w=100 100w, /_astro/hero.abc123.webp 200w">
                <style>body{background:url(/_astro/hero.abc123.webp)}</style>`,
        })
        expect(findDanglingAssetLinks(dist).size).toBe(0)
    })

    it("reports each missing asset with the pages that link it", () => {
        const dist = makeDist({
            "_astro/layout.D9L1Yhct.css": "",
            "docs/scripts/index.html": `<link href="/_astro/layout.BZr939H_.css">`,
            "blogs/one/index.html": `<link href="/_astro/layout.BZr939H_.css">`,
            "index.html": `<link href="/_astro/layout.D9L1Yhct.css">`,
        })
        const missing = findDanglingAssetLinks(dist)
        expect([...missing.keys()]).toEqual(["/_astro/layout.BZr939H_.css"])
        expect(missing.get("/_astro/layout.BZr939H_.css")?.sort()).toEqual([
            "blogs/one/index.html",
            "docs/scripts/index.html",
        ])
    })

    it("stops at the filename inside HTML-escaped island props", () => {
        const dist = makeDist({
            "_astro/image.JePILTmM_zVVpq.jpg": "",
            "_astro/x.js": `import "/_astro/gone.js"`,
            "index.html": `<astro-island props="{&quot;img&quot;:[0,&quot;/_astro/image.JePILTmM_zVVpq.jpg&quot;],&quot;title&quot;:[0,&quot;x&quot;]}"></astro-island>`,
        })
        expect(findDanglingAssetLinks(dist).size).toBe(0)
    })
})
