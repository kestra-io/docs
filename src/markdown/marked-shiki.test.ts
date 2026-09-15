import { describe, expect, it } from "vitest"
import { getMarked, getPlainMarked } from "./marked-shiki"
import {
    ALL_LANGUAGES,
    getHighlighterCore,
    resolveLanguage,
} from "~/components/plugins/schema/shikiToolset"

const YAML_FENCE = "```yaml\nid: hello\n```"

const textOnly = (html: string) => html.replace(/<[^>]+>/g, "")

describe("getPlainMarked", () => {
    it("renders fences as a plain, escaped block with the fallback class", () => {
        const html = getPlainMarked().parse("```yaml\na: <b> & 'c'\n```", {
            async: false,
        })
        expect(html).toContain('<pre class="shiki-fallback"><code>')
        expect(html).toContain("a: &lt;b&gt; &amp; 'c'")
        expect(html).not.toContain("<span")
    })

    it("parses synchronously, so markdown can render before Shiki lands", () => {
        const html = getPlainMarked().parse("# Title\n\n" + YAML_FENCE, {
            async: false,
        })
        expect(typeof html).toBe("string")
        expect(html).toContain("<h1")
    })
})

describe("getMarked", () => {
    it("highlights a fence Shiki has a grammar for", async () => {
        const html = await getMarked().parse(YAML_FENCE)
        // Per-token light color plus a dark-mode CSS variable, as app.scss expects.
        expect(html).toMatch(
            /<span style="color:#[0-9A-Za-z]+;--shiki-dark:#[0-9A-Za-z]+">/,
        )
        expect(textOnly(html)).toContain("id: hello")
    })

    it("falls back to plain text for a language the toolset doesn't carry", async () => {
        const html = await getMarked().parse("```typescript\nconst a = 1\n```")
        expect(textOnly(html)).toContain("const a = 1")
        expect(html).not.toMatch(/--shiki-dark:#[0-9A-Za-z]+">const/)
    })
})

describe("shikiToolset", () => {
    it("resolves grammar aliases, so `yml` is not downgraded to plain text", () => {
        expect(resolveLanguage("yml")).toBe("yaml")
        expect(resolveLanguage(" SH ")).toBe("bash")
        expect(resolveLanguage("tf")).toBe("terraform")
        expect(resolveLanguage("brainfuck")).toBeUndefined()
        expect(resolveLanguage(undefined)).toBeUndefined()
    })

    it("registers only the requested grammars", async () => {
        const highlighter = await getHighlighterCore(["json"])
        expect(highlighter.getLoadedLanguages()).toContain("json")
        // Every other fence on the page would pull its own grammar on demand.
        const unloaded = ALL_LANGUAGES.filter(
            (lang) => !highlighter.getLoadedLanguages().includes(lang),
        )
        expect(unloaded.length).toBeGreaterThan(0)
    })

    it("loads both themes and no others", async () => {
        const highlighter = await getHighlighterCore([])
        expect(highlighter.getLoadedThemes().sort()).toEqual([
            "github-dark-default",
            "github-light-default",
        ])
    })
})
