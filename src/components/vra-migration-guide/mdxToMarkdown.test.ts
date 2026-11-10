import { readFileSync } from "node:fs"
import { expect, it } from "vitest"
import { mdxToMarkdown } from "./mdxToMarkdown"

it("unwraps components and writes their attributes back as markdown", () => {
    const mdx = [
        'import Card from "./Card.astro"',
        "",
        "{/* a comment */}",
        '<Card title="Most of it stays">',
        "",
        '- <Verdict kind="keep" /> See <a href="#section-7-2">7.2</a>, <mark>now</mark>.',
        "",
        "</Card>",
        '<CaseStudy status="DONE" stats={[{ value: "30×", label: "faster" }]} quote="Six days." quoteBy="Ops" storyHref="/stories/x">',
        "",
        "![Estate](./figure-1.png)",
        "",
        "</CaseStudy>",
        '<GuideFigure caption="Figure 1" />',
        "<Calculator client:visible />",
    ].join("\n")
    const out = mdxToMarkdown(mdx, {
        replacements: {
            Calculator: "_Calculator on the web page._",
            Verdict: ({ kind }) => `**${kind}**`,
        },
        images: { "./figure-1.png": "/f1.png" },
    })
    expect(out).toBe(
        [
            "**Most of it stays**",
            "",
            "- **keep** See [7.2](#section-7-2), now.",
            "",
            "**DONE**",
            "",
            "- **30×** faster",
            "",
            "![Estate](/f1.png)",
            "",
            "> Six days.",
            "> — [Ops](/stories/x)",
            "",
            "_Figure 1_",
            "",
            "_Calculator on the web page._",
            "",
        ].join("\n"),
    )
})

it("leaves no JSX or imports in the real guide", () => {
    const path = new URL(
        "../../contents/resources/vra-migration-guide/index.mdx",
        import.meta.url,
    )
    const body = readFileSync(path, "utf8").replace(/^---[\s\S]*?\n---\n/, "")
    const out = mdxToMarkdown(body)
    expect(out).not.toMatch(/^import /m)
    expect(out).not.toMatch(/<\/?[A-Za-z]/)
})
