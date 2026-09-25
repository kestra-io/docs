import { describe, expect, it } from "vitest"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkDirective from "remark-directive"
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import { VFile } from "vfile"
import remarkCustomElements from "../remark/remark-custom-elements/index.mjs"
import rehypeResourceCta from "./resource-cta"

const RESOURCE = "/repo/src/contents/resources/foo/index.md"

async function render(md: string, path = RESOURCE, frontmatter = {}) {
    const file = new VFile({ path, value: md })
    file.data.astro = { frontmatter }
    const out = await unified()
        .use(remarkParse)
        .use(remarkDirective)
        .use(remarkCustomElements)
        .use(remarkRehype)
        .use(rehypeResourceCta)
        .use(rehypeStringify)
        .process(file)
    return String(out)
}

const sections = (n: number) =>
    Array.from({ length: n }, (_, i) => `## S${i + 1}\n\ntext ${i + 1}`).join(
        "\n\n",
    )

describe("rehypeResourceCta", () => {
    it("puts the mid CTA before the h2 at index ceil(n / 2)", async () => {
        const html = await render(sections(5))
        const mid = html.indexOf('data-resource-cta="mid"')
        expect(mid).toBeGreaterThan(html.indexOf("text 3"))
        expect(mid).toBeLessThan(html.indexOf("<h2>S4</h2>"))
        expect(html).toContain(
            'data-event="resource_mid_cta_get_started_click"',
        )
        expect(html).toContain('data-event="resource_mid_cta_demo_click"')
    })

    it("skips the mid CTA under 4 h2s but keeps the end one", async () => {
        const html = await render(sections(3))
        expect(html).not.toContain('data-resource-cta="mid"')
        expect(html.trimEnd()).toMatch(
            /data-event="resource_end_cta_demo_click">Book a Demo<\/a><\/div>$/,
        )
    })

    it("uses the ::cta position instead of the automatic one", async () => {
        const html = await render(`## A\n\n::cta\n\n${sections(6)}`)
        expect(html.match(/data-resource-cta="mid"/g)).toHaveLength(1)
        expect(html.indexOf('data-resource-cta="mid"')).toBeLessThan(
            html.indexOf("<h2>S1</h2>"),
        )
    })

    it("drops the end CTA when front-matter cta: is set", async () => {
        const html = await render(sections(6), RESOURCE, {
            cta: { heading: "x" },
        })
        expect(html).not.toContain('data-resource-cta="end"')
        expect(html).toContain('data-resource-cta="mid"')
    })

    it("leaves other collections alone", async () => {
        const html = await render(sections(6), "/repo/src/contents/blogs/a.md")
        expect(html).not.toContain("data-resource-cta")
    })
})
