import { test, expect } from "@playwright/test"
import { PAGES } from "./fixtures/page-sample.mjs"

/**
 * Visual regression screenshot tests for the Kestra docs site.
 *
 * These capture baseline screenshots of key pages across desktop, tablet, and
 * mobile viewports. Run `npx playwright test --update-snapshots` to regenerate
 * baselines after intentional visual changes.
 */

for (const page of PAGES) {
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
