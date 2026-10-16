import { readdirSync, readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

// The engine runs in Vue islands, on the server and in tests, so it must not
// reach for browser or framework APIs. Callers pass locale, dates and
// storage values in.
const here = dirname(fileURLToPath(import.meta.url))
const sources = readdirSync(here).filter(
    (f) => f.endsWith(".ts") && !f.endsWith(".test.ts"),
)

const FORBIDDEN = [
    /\bwindow\b/,
    /\bdocument\b/,
    /\blocalStorage\b/,
    /\bsessionStorage\b/,
    /\bnavigator\b/,
    /\blocation\b/,
    /\bbtoa\b/,
    /\batob\b/,
    /\bTextEncoder\b/,
    /\bTextDecoder\b/,
    /\bBuffer\b/,
    /\bnew Date\(\s*\)/,
    /\bDate\.now\b/,
    /\bMath\.random\b/,
    /from\s+["'](vue|astro|@vueuse\/[^"']+|astro:[^"']+)["']/,
    /from\s+["']~\/(components|composables)\//,
]

const stripComments = (code: string) =>
    code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")

describe("engine purity", () => {
    it("has engine sources to check", () => {
        expect(sources.length).toBeGreaterThanOrEqual(10)
    })

    it.each(sources)(
        "%s uses no browser, framework or non-deterministic APIs",
        (file) => {
            const code = stripComments(readFileSync(join(here, file), "utf8"))
            for (const pattern of FORBIDDEN)
                expect(code, `${file} matches ${pattern}`).not.toMatch(pattern)
        },
    )
})
