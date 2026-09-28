import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { mdxToMarkdown } from "./mdxToMarkdown"

describe("mdxToMarkdown", () => {
    it("drops imports, comments and fragments", () => {
        const out = mdxToMarkdown(
            [
                'import Card from "./Card.astro"',
                "",
                "{/* a comment */}",
                '<Fragment slot="what">',
                "",
                "Text",
                "",
                "</Fragment>",
            ].join("\n"),
        )
        expect(out).toBe("Text\n")
    })

    it("keeps content inside wrappers and turns titles into bold lines", () => {
        const out = mdxToMarkdown(
            [
                '<Card kicker="01" title="Most of it stays">',
                "",
                "Body with a [link](#section-2-5).",
                "",
                "</Card>",
            ].join("\n"),
        )
        expect(out).toBe(
            "**Most of it stays**\n\nBody with a [link](#section-2-5).\n",
        )
    })

    it("handles attributes with nested expressions", () => {
        const out = mdxToMarkdown(
            '<GuideTabs id="x" label="Stages" tabs={[{ kicker: "STAGE 1", label: "Assess" }]}>\ninside\n</GuideTabs>',
        )
        expect(out).toBe("**Stages**\ninside\n")
    })

    it("replaces named components", () => {
        const out = mdxToMarkdown(
            '<CalculatorFunnel client:visible idPrefix="a" />',
            {
                CalculatorFunnel: "_Calculator on the web page._",
            },
        )
        expect(out).toBe("_Calculator on the web page._\n")
    })

    it("converts inline HTML links", () => {
        expect(mdxToMarkdown('See <a href="#section-7-2">7.2</a>.')).toBe(
            "See [7.2](#section-7-2).\n",
        )
    })

    it("leaves no JSX or imports in the real guide", () => {
        const path = fileURLToPath(
            new URL(
                "../../contents/resources/vra-migration-guide/index.mdx",
                import.meta.url,
            ),
        )
        const body = readFileSync(path, "utf8").replace(
            /^---[\s\S]*?\n---\n/,
            "",
        )
        const out = mdxToMarkdown(body, {
            CalculatorFunnel: "calc",
            CalculatorPayback: "calc",
        })
        expect(out).not.toMatch(/^import /m)
        expect(out).not.toMatch(/<\/?[A-Z]/)
        expect(out).toContain(
            "### 7.2 What leaving costs, and when it pays back",
        )
        expect(out).toContain("**Request intake and governance**")
    })
})
