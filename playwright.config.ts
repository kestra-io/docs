import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",

    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.002,
        },
    },

    use: {
        baseURL: "http://localhost:8787",
        trace: "on-first-retry",
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
        command:
            "NO_IMAGE_OPTIM=true DISABLE_USAL=true DISABLE_GITHUB=true npm run preview",
        url: "http://localhost:8787",
        reuseExistingServer: !process.env.CI,
        timeout: 200_000,
    },
})
