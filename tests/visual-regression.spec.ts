import { test, expect } from "@playwright/test"
import { PAGES, VISUAL_ONLY_PAGES } from "./fixtures/page-sample.mjs"

/**
 * Visual regression screenshot tests for the Kestra docs site.
 *
 * Covers the Lighthouse page sample plus VISUAL_ONLY_PAGES, which exists so
 * every surface touched by the SVG asset rework has a baseline. Run
 * `npx playwright test --update-snapshots` to regenerate after intended changes.
 */

for (const page of [...PAGES, ...VISUAL_ONLY_PAGES]) {
    test(`${page.label} matches screenshot`, async ({ page: p }) => {
        // networkidle never settles on pages that keep polling, which is how a
        // run wedges with no output. Wait for fonts instead, they drive layout.
        await p.goto(page.path, { waitUntil: "load" })
        await p.evaluate(async () => {
            await document.fonts.ready
        })
        await p.waitForTimeout(500)

        await expect(p).toHaveScreenshot(`${page.label}.png`, {
            fullPage: true,
            animations: "disabled",
            timeout: 15_000,
        })
    })
}
