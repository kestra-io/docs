import { describe, expect, it } from "vitest"
import YAML from "yaml"
import {
    buildDocMarkdown,
    parseDocFrontmatter,
    rewriteRelativeLinks,
    splitLinkTarget,
} from "./docMarkdown"

const frontmatterOf = (markdown: string): Record<string, unknown> => {
    const match = /^---\n([\s\S]*?)\n---\n/.exec(markdown)
    expect(match).not.toBeNull()
    return YAML.parse(match![1])
}

describe("buildDocMarkdown", () => {
    const meta = {
        title: "Build a Hello World Flow in Kestra",
        h1: "Create Your First Hello World Flow",
        description: "Build your first Hello World flow in Kestra.",
        url: "https://kestra.io/docs/tutorial/fundamentals",
    }

    it("emits frontmatter, the page's real H1, then the body", () => {
        expect(buildDocMarkdown(meta, "Start by building a simple flow.\n")).toBe(
            [
                "---",
                "title: Build a Hello World Flow in Kestra",
                "description: Build your first Hello World flow in Kestra.",
                "url: https://kestra.io/docs/tutorial/fundamentals",
                "---",
                "",
                "# Create Your First Hello World Flow",
                "",
                "Start by building a simple flow.",
                "",
            ].join("\n"),
        )
    })

    it("heads the document with the SEO title only when the page has no h1", () => {
        const markdown = buildDocMarkdown({ ...meta, h1: undefined }, "body")
        expect(markdown).toContain("\n# Build a Hello World Flow in Kestra\n")
        expect(markdown).not.toContain("# Create Your First Hello World Flow")
        expect(markdown.match(/^# /gm)).toHaveLength(1)
    })

    it("keeps the SEO title in frontmatter, never as a second heading", () => {
        const markdown = buildDocMarkdown(meta, "body")
        expect(frontmatterOf(markdown).title).toBe(meta.title)
        expect(markdown.match(/^# /gm)).toEqual(["# "])
        expect(markdown).not.toContain("# Build a Hello World Flow in Kestra")
    })

    it("omits an absent description rather than writing null", () => {
        const markdown = buildDocMarkdown({ ...meta, description: undefined }, "body")
        expect(markdown).not.toContain("description")
        expect(frontmatterOf(markdown)).toEqual({ title: meta.title, url: meta.url })
    })

    it("serializes colons, quotes, unicode, hashes and multi-line values as valid YAML", () => {
        const tricky = {
            title: 'Kestra Docs: Your "Infinitely-Scalable" Orchestration Platform',
            h1: "Welcome to Kestra",
            description: "Línea uno — #not a comment\nline two: with colon\n",
            url: "https://kestra.io/docs?x=1#top",
        }
        const parsed = frontmatterOf(buildDocMarkdown(tricky, "body"))
        expect(parsed).toEqual({
            title: tricky.title,
            description: tricky.description,
            url: tricky.url,
        })
    })

    it("does not fold a long description across lines", () => {
        const description = "word ".repeat(40).trim()
        const markdown = buildDocMarkdown({ ...meta, description }, "body")
        expect(markdown).toContain(`\ndescription: ${description}\n`)
    })

    it("keeps a value that looks like a frontmatter delimiter inside the block", () => {
        const markdown = buildDocMarkdown({ ...meta, title: "---", h1: undefined }, "body")
        expect(frontmatterOf(markdown).title).toBe("---")
        expect(markdown.split("\n---\n")).toHaveLength(2)
    })

    it("drops blank lines a stripped source leaves ahead of its body", () => {
        const markdown = buildDocMarkdown(meta, "\n\nStart here.\n", (t) => t)
        expect(markdown).toContain("# Create Your First Hello World Flow\n\nStart here.\n")
        expect(buildDocMarkdown(meta, " \r\n\nStart here.")).toContain("Flow\n\nStart here.")
    })

    it("leaves the body untouched without a resolver", () => {
        const body = "See [x](../01.x/index.md) and ![y](./y.png)\n"
        expect(buildDocMarkdown(meta, body)).toContain(body)
    })

    it("resolves the body's relative links through the resolver", () => {
        const markdown = buildDocMarkdown(meta, "See [x](../01.x/index.md)", (t) => `R(${t})`)
        expect(markdown).toContain("See [x](R(../01.x/index.md))")
    })
})

describe("rewriteRelativeLinks", () => {
    const upper = (target: string) => `https://kestra.io/${target.toUpperCase()}`

    it("rewrites ./ and ../ link and image destinations only", () => {
        const body = [
            "[a](./a.md) [b](../b/index.mdx) ![c](./c.png)",
            "[root](/docs/x) [anchor](#here) [abs](https://example.com/../x) [mail](mailto:a@b.c)",
            "[bare](plugins/a.md) [empty]()",
        ].join("\n")
        expect(rewriteRelativeLinks(body, upper)).toBe(
            [
                "[a](https://kestra.io/./A.MD) [b](https://kestra.io/../B/INDEX.MDX) ![c](https://kestra.io/./C.PNG)",
                "[root](/docs/x) [anchor](#here) [abs](https://example.com/../x) [mail](mailto:a@b.c)",
                "[bare](plugins/a.md) [empty]()",
            ].join("\n"),
        )
    })

    it("keeps a link title", () => {
        expect(
            rewriteRelativeLinks('![Tenants](./tenants-select.png "Tenant switcher")', upper),
        ).toBe('![Tenants](https://kestra.io/./TENANTS-SELECT.PNG "Tenant switcher")')
    })

    it("hands the whole target, anchor and query included, to the resolver", () => {
        const seen: string[] = []
        rewriteRelativeLinks("[a](../x/index.md#part) [b](./y.md?v=2)", (t) => {
            seen.push(t)
            return t
        })
        expect(seen).toEqual(["../x/index.md#part", "./y.md?v=2"])
    })

    it("leaves a target as written when the resolver declines", () => {
        expect(rewriteRelativeLinks("[a](./a.md) ![b](./b.mp4)", (t) => (t.endsWith(".md") ? "X" : undefined))).toBe(
            "[a](X) ![b](./b.mp4)",
        )
    })

    it("does not touch fenced code blocks, backtick or tilde, with or without a language", () => {
        const body = [
            "[a](./a.md)",
            "```yaml",
            "# a comment with [a](./a.md)",
            "```",
            "[b](./b.md)",
            "~~~",
            "[c](./c.md)",
            "~~~",
            "   ```",
            "[d](./d.md)",
            "   ```",
            "[e](./e.md)",
        ].join("\n")
        const out = rewriteRelativeLinks(body, upper)
        expect(out.split("\n").filter((l) => l.includes("kestra.io"))).toEqual([
            "[a](https://kestra.io/./A.MD)",
            "[b](https://kestra.io/./B.MD)",
            "[e](https://kestra.io/./E.MD)",
        ])
    })

    it("only closes a fence with the same character at least as long", () => {
        const body = ["````md", "```", "[a](./a.md)", "```", "````", "[b](./b.md)"].join("\n")
        const out = rewriteRelativeLinks(body, upper)
        expect(out).toContain("[a](./a.md)")
        expect(out).toContain("[b](https://kestra.io/./B.MD)")
    })

    it("rewrites several links on one line", () => {
        expect(rewriteRelativeLinks("[a](./a.md), [b](../b.md).", upper)).toBe(
            "[a](https://kestra.io/./A.MD), [b](https://kestra.io/../B.MD).",
        )
    })
})

describe("parseDocFrontmatter", () => {
    it("reads title, h1 and description, unquoting and keeping block scalars", () => {
        const md = [
            "---",
            'title: "Kestra Docs: Your Platform"',
            "h1: Welcome to Kestra",
            "description: >",
            "  Folded over",
            "  two lines.",
            "icon: /x.svg",
            "---",
            "",
            "# Body",
        ].join("\n")
        expect(parseDocFrontmatter(md)).toEqual({
            title: "Kestra Docs: Your Platform",
            h1: "Welcome to Kestra",
            description: "Folded over two lines.",
        })
    })

    it("keeps a literal block's line breaks and strips the trailing one", () => {
        const md = "---\ntitle: T\ndescription: |\n  line one\n  line two\n---\n"
        expect(parseDocFrontmatter(md).description).toBe("line one\nline two")
    })

    it("omits keys that are absent or empty", () => {
        expect(parseDocFrontmatter("---\ntitle: T\nh1: ''\n---\nbody")).toEqual({ title: "T" })
        expect(parseDocFrontmatter("# No frontmatter\n")).toEqual({})
    })

    it("falls back to the line-based reader when the block isn't valid YAML", () => {
        const md = "---\ntitle: Broken: [unclosed\nh1: Still Here\n---\n"
        expect(parseDocFrontmatter(md)).toEqual({ title: "Broken: [unclosed", h1: "Still Here" })
    })

    it("falls back per key when a value isn't a plain string", () => {
        const md = "---\ntitle: 2.0\nh1: Kestra 2.0\n---\n"
        expect(parseDocFrontmatter(md)).toEqual({ title: "2.0", h1: "Kestra 2.0" })
    })

    it("handles CRLF frontmatter", () => {
        expect(parseDocFrontmatter("---\r\ntitle: CRLF\r\n---\r\n# Body")).toEqual({ title: "CRLF" })
    })
})

describe("splitLinkTarget", () => {
    it("separates the path from its query and hash", () => {
        expect(splitLinkTarget("../x/index.md#part")).toEqual(["../x/index.md", "#part"])
        expect(splitLinkTarget("./y.png?v=2#f")).toEqual(["./y.png", "?v=2#f"])
        expect(splitLinkTarget("./plain.md")).toEqual(["./plain.md", ""])
    })
})
