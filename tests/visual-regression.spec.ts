import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { test } from "@playwright/test"
import { PAGES, VISUAL_ONLY_PAGES } from "./fixtures/page-sample.mjs"

/**
 * Visual regression screenshot tests for the Kestra docs site.
 *
 * Covers the Lighthouse page sample plus VISUAL_ONLY_PAGES, which exists so
 * every surface touched by the SVG asset rework has a screenshot. Nothing is
 * committed: `npm run test:visual:capture` on main, move the snapshot dir to
 * `visual-baseline/`, capture again on your branch, then `npm run test:visual:report`.
 */

// The sample is plain JS, so the optional fields are declared here.
type SamplePage = { path: string; label: string; styles?: string; reducedMotion?: boolean }

const styleSheet = (name: string) =>
    readFileSync(fileURLToPath(new URL(`./fixtures/snapshot-styles/${name}`, import.meta.url)), "utf8")

const pages: SamplePage[] = [...PAGES, ...VISUAL_ONLY_PAGES]

for (const page of pages) {
    test(`${page.label} screenshot`, async ({ page: p }, testInfo) => {
        if (page.reducedMotion) await p.emulateMedia({ reducedMotion: "reduce" })
        // networkidle never settles on pages that keep polling, which is how a
        // run wedges with no output. Wait for fonts instead, they drive layout.
        const res = await p.goto(page.path, { waitUntil: "load" })
        // A route only one side has shows as added or removed, not as a diff of its 404 page.
        test.skip(res?.status() === 404, `${page.path} is a 404 on this build`)
        // fullPage captures beyond the viewport without scrolling, so lazy
        // images far below the fold would never be fetched.
        await p.evaluate(async () => {
            const imgs = [...document.images]
            for (const img of imgs) if (img.loading === "lazy") img.loading = "eager"
            await Promise.all(imgs.map((img) => img.decode().catch(() => {})))
            await document.fonts.ready
        })
        await p.waitForTimeout(500)

        // A plain capture: an assertion would demand two identical frames in a row,
        // which pages with JS-driven motion never give. The report's tolerance absorbs it.
        await p.screenshot({
            path: testInfo.snapshotPath(`${page.label}.png`, { kind: "screenshot" }),
            fullPage: true,
            animations: "disabled",
            timeout: 15_000,
            // Neutralises the content a page only renders incidentally, so the
            // capture it owns is the one that moves.
            style: [styleSheet("intersection.css"), page.styles ? styleSheet(page.styles) : ""].join("\n"),
        })
    })
}
