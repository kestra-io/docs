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
                replacements: {
                    CalculatorFunnel: "_Calculator on the web page._",
                },
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
            replacements: { CalculatorFunnel: "calc", CalculatorPayback: "calc" },
        })
        expect(out).not.toMatch(/^import /m)
        expect(out).not.toMatch(/<\/?[A-Z]/)
    })
})

it("drops <mark> around a highlighted word in a statement slot", () => {
    expect(
        mdxToMarkdown(
            '<GuideCallout variant="lesson" label="Lesson">\n<Fragment slot="statement">Your vendor should <mark>not own</mark> your automation.</Fragment>\n\nBody.\n\n</GuideCallout>',
        ),
    ).toBe("**Lesson**\nYour vendor should not own your automation.\n\nBody.\n")
})

it("lets a replacement read the tag's attributes", () => {
    expect(
        mdxToMarkdown('- <Verdict kind="keep" /> The incumbent stays.', {
            replacements: { Verdict: ({ kind }) => `**${kind}**` },
        }),
    ).toBe("- **keep** The incumbent stays.\n")
})

it("writes a case study's status, stats and quote around its content", () => {
    expect(
        mdxToMarkdown(
            [
                '<CaseStudy status="MIGRATION COMPLETE" stats={[{ value: "30×", label: "faster delivery" }, { value: "90%", label: "lower cost" }]} quote="Six months became six days." quoteBy="Principal Hosting" storyHref="/stories/fortune-500-company">',
                "",
                "Body.",
                "",
                "</CaseStudy>",
            ].join("\n"),
        ),
    ).toBe(
        [
            "**MIGRATION COMPLETE**",
            "",
            "- **30×** faster delivery",
            "- **90%** lower cost",
            "",
            "Body.",
            "",
            "> Six months became six days.",
            "> — [Principal Hosting](/stories/fortune-500-company)",
            "",
        ].join("\n"),
    )
})

it("puts a figure's caption after the image and resolves the image path", () => {
    expect(
        mdxToMarkdown(
            '<GuideFigure caption="Figure 1: The estate">\n\n![The estate](./figure-1.png)\n\n</GuideFigure>',
            { images: { "./figure-1.png": "https://kestra.io/_astro/figure-1.abc.png" } },
        ),
    ).toBe(
        "![The estate](https://kestra.io/_astro/figure-1.abc.png)\n\n_Figure 1: The estate_\n",
    )
})

it("matches closing tags to their own wrapper when wrappers nest", () => {
    expect(
        mdxToMarkdown(
            '<GuideCards>\n<GuideCard title="A">\n\nOne.\n\n</GuideCard>\n<GuideFigure caption="Cap">\n\nTwo.\n\n</GuideFigure>\n</GuideCards>',
        ),
    ).toBe("**A**\n\nOne.\n\nTwo.\n\n_Cap_\n")
})
