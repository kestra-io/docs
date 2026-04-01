import { test, expect } from "@playwright/test"
import { PAGES } from "../fixtures/page-sample"

/**
 * Visual regression screenshot tests for the Kestra docs site.
 *
 * These capture baseline screenshots of key pages across desktop, tablet, and
 * mobile viewports. Run `npx playwright test --update-snapshots` to regenerate
 * baselines after intentional visual changes.
 */

for (const page of PAGES) {
    test(`${page.label} matches screenshot`, async ({ page: p }) => {
        await p.goto(page.path, { waitUntil: "networkidle" })

        // Allow animations/transitions to settle
        await p.waitForTimeout(500)

        await expect(p).toHaveScreenshot(`${page.label}.png`, {
            fullPage: true,
            animations: "disabled",
        })
    })
}
