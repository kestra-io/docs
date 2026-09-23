import { fileURLToPath } from "node:url"
import { test, expect } from "@playwright/test"
import { PAGES, VISUAL_ONLY_PAGES } from "./fixtures/page-sample.mjs"

/**
 * Visual regression screenshot tests for the Kestra docs site.
 *
 * Covers the Lighthouse page sample plus VISUAL_ONLY_PAGES, which exists so
 * every surface touched by the SVG asset rework has a baseline. Run
 * `npx playwright test --update-snapshots` to regenerate after intended changes.
 */

// The sample is plain JS, so the optional fields are declared here.
type SamplePage = { path: string; label: string; styles?: string }

const styleSheet = (name: string) =>
    fileURLToPath(new URL(`./fixtures/snapshot-styles/${name}`, import.meta.url))

const pages: SamplePage[] = [...PAGES, ...VISUAL_ONLY_PAGES]

// Keep in step with PLACEHOLDER_ICON in scripts/api-fixture-server.mjs.
const PLACEHOLDER_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#9ca3af"/></svg>'

for (const page of pages) {
    test(`${page.label} matches screenshot`, async ({ page: p }) => {
        // Each plugin icon is a live API round trip through the worker; stub
        // them with the same placeholder the plugin fixtures carry.
        await p.route(
            (url) => url.pathname.startsWith("/icons/"),
            (route) =>
                route.fulfill({
                    contentType: "image/svg+xml",
                    body: PLACEHOLDER_ICON,
                }),
        )

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
            // Neutralises the content a page only renders incidentally, so the
            // baseline it owns is the one that moves.
            ...(page.styles ? { stylePath: styleSheet(page.styles) } : {}),
        })
    })
}
