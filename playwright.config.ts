import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,

    // Snapshot rewrites have nothing to be flaky about, and a retried hang just
    // multiplies the wall clock. globalTimeout is the backstop for a wedged browser.
    retries: 0,
    workers: process.env.CI ? 2 : undefined,
    timeout: 90_000,
    globalTimeout: 20 * 60_000,

    reporter: process.env.CI
        ? [["github"], ["html", { open: "never" }]]
        : "html",

    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.002,
        },
    },

    use: {
        baseURL: "http://localhost:8787",
        navigationTimeout: 45_000,
        actionTimeout: 30_000,
        trace: "retain-on-failure",
    },

    projects: [
        {
            name: "desktop",
            use: {
                ...devices["Desktop Chrome"],
                viewport: { width: 1280, height: 720 },
            },
        },
        {
            name: "tablet",
            use: { ...devices["iPad (gen 7)"] },
        },
        {
            name: "mobile",
            use: { ...devices["iPhone 13"] },
        },
    ],

    webServer: {
        command: "npx wrangler dev --port 8787",
        url: "http://localhost:8787",
        reuseExistingServer: !process.env.CI,
        timeout: 150_000,
    },
})
