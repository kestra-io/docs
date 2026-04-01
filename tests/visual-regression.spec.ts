import { test, expect } from "@playwright/test";

/**
 * Visual regression screenshot tests for the Kestra docs site.
 *
 * These capture baseline screenshots of key pages across desktop, tablet, and
 * mobile viewports. Run `npx playwright test --update-snapshots` to regenerate
 * baselines after intentional visual changes.
 */

const pages = [
    { name: "homepage", path: "/" },
    { name: "docs", path: "/docs" },
    { name: "plugins", path: "/plugins" },
    { name: "blueprints", path: "/blueprints" },
    { name: "pricing", path: "/pricing" },
    { name: "vs-airflow", path: "/vs/airflow" },
    { name: "use-case-data-engineers", path: "/use-cases/data-engineers" },
    { name: "features", path: "/features" },
    { name: "blogs", path: "/blogs" },
    { name: "community", path: "/community" },
    { name: "enterprise-free-trial", path: "/enterprise/free-trial" },
    { name: "error-404", path: "/this-page-does-not-exist-404" },
];

for (const page of pages) {
    test(`${page.name} matches screenshot`, async ({ page: p }) => {
        await p.goto(page.path, { waitUntil: "networkidle" });

        // Allow animations/transitions to settle
        await p.waitForTimeout(500);

        await expect(p).toHaveScreenshot(`${page.name}.png`, {
            fullPage: true,
            animations: "disabled",
        });
    });
}
