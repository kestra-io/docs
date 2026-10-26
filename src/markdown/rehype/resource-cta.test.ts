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
            /data-event="resource_end_cta_demo_click">Book a Demo<\/a><\/div><\/div>$/,
        )
    })

    it("uses the ::resource-cta position instead of the automatic one", async () => {
        const html = await render(`## A\n\n::resource-cta\n\n${sections(6)}`)
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

    it("injects nothing when front-matter resourceCta is false", async () => {
        const html = await render(sections(6), RESOURCE, { resourceCta: false })
        expect(html).not.toContain("data-resource-cta")
    })

    it("picks the tagline from the resource tag", async () => {
        const html = await render(sections(6), RESOURCE, { tag: "data" })
        expect(html).toContain("Ready to orchestrate your data pipelines?")
        expect(html).toContain("Your data pipelines, orchestrated end to end.")
    })

    it("falls back to the generic tagline for other tags", async () => {
        const html = await render(
            `## A\n\n::resource-cta\n\n${sections(6)}`,
            RESOURCE,
            {
                tag: "whitepapers",
            },
        )
        expect(html).toContain(
            "Ready to orchestrate everything from one place?",
        )
    })

    it("routes the primary button to resourceCtaOverride", async () => {
        const html = await render(
            `## A\n\n::resource-cta\n\n${sections(6)}`,
            RESOURCE,
            {
                tag: "infrastructure",
                resourceCtaOverride: {
                    href: "/resources/migration/pipedream",
                    label: "Read the migration guide",
                    tagline: "Planning the move?",
                    taglineEnd: "Move off Pipedream in four stages.",
                },
            },
        )
        expect(html).not.toContain("Get Started")
        expect(
            html.match(/href="\/resources\/migration\/pipedream"/g),
        ).toHaveLength(2)
        expect(html.match(/>Read the migration guide</g)).toHaveLength(2)
        expect(html).toContain('data-event="resource_mid_cta_guide_click"')
        expect(html).toContain('data-event="resource_end_cta_guide_click"')
        expect(html).toContain('data-event="resource_mid_cta_demo_click"')
        expect(html).toContain('data-event="resource_end_cta_demo_click"')
        expect(html).toContain("Planning the move?")
        expect(html).toContain("Move off Pipedream in four stages.")
        expect(html).not.toContain("Ready to orchestrate your infrastructure?")
    })

    it("uses the override action and taglines' fallbacks", async () => {
        const html = await render(sections(6), RESOURCE, {
            tag: "data",
            resourceCtaOverride: { href: "/x", label: "X", action: "x" },
        })
        expect(html).toContain('data-event="resource_mid_cta_x_click"')
        expect(html).toContain("Ready to orchestrate your data pipelines?")
        expect(html).toContain("Your data pipelines, orchestrated end to end.")

        const mid = await render(sections(6), RESOURCE, {
            resourceCtaOverride: { href: "/x", label: "X", tagline: "Same?" },
        })
        expect(mid.match(/Same\?/g)).toHaveLength(2)
    })

    it("keeps Get Started without an override", async () => {
        const html = await render(sections(6))
        expect(html.match(/href="\/get-started"/g)).toHaveLength(2)
        expect(html).not.toContain("_guide_click")
    })

    it("leaves other collections alone", async () => {
        const html = await render(sections(6), "/repo/src/contents/blogs/a.md")
        expect(html).not.toContain("data-resource-cta")
    })

    it("rejects ::resource-cta outside /resources", async () => {
        await expect(
            render("::resource-cta", "/repo/src/contents/blogs/a.md"),
        ).rejects.toThrow("only supported")
    })

    it("rejects the inline :resource-cta form", async () => {
        await expect(render("Text :resource-cta here")).rejects.toThrow(
            "only supported",
        )
    })
})
