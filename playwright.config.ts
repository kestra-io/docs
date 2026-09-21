import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,

    // One retry absorbs a crashed or OOM-killed browser process without a manual
    // re-dispatch; globalTimeout is the backstop for a wedged one.
    retries: process.env.CI ? 1 : 0,
    workers: process.env.CI ? 2 : undefined,
    timeout: 90_000,
    // 60 routes x 3 projects at 2 workers. Workers stay at 2: CPU contention
    // during capture bakes load artifacts into the baselines it writes.
    globalTimeout: 45 * 60_000,

    reporter: process.env.CI
        ? [["github"], ["html", { open: "never" }]]
        : "html",

    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.01, // Allow up to 1% pixel difference for minor rendering variations
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
