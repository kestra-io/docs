import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

// Unit tests live next to source under src/. The Playwright visual-regression
// suite under tests/ is excluded so the two runners don't pick up each other.
export default defineConfig({
    resolve: {
        // Mirror the tsconfig "~/..." -> "src/..." path alias so units under
        // test that import via "~" resolve.
        alias: {
            "~": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    test: {
        include: ["src/**/*.test.ts"],
    },
})
