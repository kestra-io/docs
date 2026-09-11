import { describe, it, expect } from "vitest"
import { renderVersionedDocBody, splitComponentPlaceholders } from "./renderVersionedDoc"
import { readdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { componentKey } from "../markdown/mdcTree"

// The tags docs-versioned.astro's component glob resolves to a real component.
const renderableComponents = new Set([
    "api-doc",
    "api-doc-ee",
    "home-page-buttons",
    "support-links",
])

const render = async (markdown: string) =>
    (await renderVersionedDocBody({ version: "1.3", path: "x", markdown })).html

// Reconstructs the visible text of Shiki's per-token <span> output, so
// assertions check what a reader actually sees instead of matching any
// substring that happens to appear inside an HTML attribute. Loops until
// stable so a single pass can't leave a tag reconstituted from adjacent
// fragments (e.g. "<scr<script>ipt>") behind.
const textOnly = (html: string) => {
    let stripped = html
    let previous
    do {
        previous = stripped
        stripped = stripped.replace(/<[^>]*>/g, "")
    } while (stripped !== previous)
    return stripped
}

describe("renderVersionedDocBody MDC directive handling", () => {
    it("gives markdown tables the site's table classes, like latest's remark plugin", async () => {
        const html = await render(`---
title: T
---
| Runner | Isolation |
| ------ | --------- |
| Docker | container |`)
        expect(html).toContain('<table class="table table-dark">')
    })

    it("renders a known ::alert block with the site's alert classes, no :: leak", async () => {
        const html = await render(`---
title: T
---
:::alert{type="warning"}
known content here
:::`)
        expect(html).toContain("known content here")
        expect(html).toContain('class="doc-alert alert alert-warning"')
        expect(html).not.toContain(":::")
    })

    it("renders a ::collapse with its title as a native <details> toggle", async () => {
        const html = await render(`---
title: T
---
:::collapse{title="Show more"}
collapsed body
:::`)
        expect(html).toContain('<details class="doc-collapse">')
        expect(html).toContain("<summary")
        expect(html).toContain("Show more")
        expect(html).toContain("collapsed body")
        expect(html).not.toContain(":::")
    })

    it("renders an unknown/relic ::block, keeping its content, no :: leak", async () => {
        // Old versioned docs reference components removed from this repo. The
        // directive is stripped and its inner content kept (like the Kestra UI
        // MDC renderer), rather than leaking the literal "::" markup as text.
        const html = await render(`---
title: T
---
:::relicblock{foo="bar"}
relic content here
:::`)
        expect(html).toContain("relic content here")
        expect(html).not.toContain(":::")
        expect(html).not.toContain("relicblock")
    })

    it("keeps inline relic directive content inline, no leak", async () => {
        const html = await render(`---
title: T
---
Text with :gone[label]{x=1} inline.`)
        expect(html).toContain("label")
        expect(html).not.toContain(":gone")
        expect(html).not.toContain("::")
    })

    it("renders an unknown inline directive as a <span>, not splitting the paragraph", async () => {
        // :PluginCount is an island with no SSR equivalent here. The default hast
        // handler would emit a block <div>, splitting the intro into
        // <p>Thanks to </p><div></div><p> plugins…</p>. Forcing <span> keeps the
        // paragraph intact (the count itself is simply absent, no leak).
        const html = await render(`---
title: T
---
Thanks to :PluginCount plugins and embedded Code editor, building is easy.`)
        expect(html).not.toContain(":PluginCount")
        expect(html).not.toContain("<div></div>")
        expect(html).toContain("Thanks to")
        expect(html).toContain("plugins and embedded Code editor")
        // single intact paragraph, not split by a block element
        expect(html).toMatch(/<p>Thanks to[\s\S]*?easy\.<\/p>/)
    })

    it("renders an attribute-derived ::badge mirroring the real remark badge directive's markup, no leak", async () => {
        // ::badge has no inline children — its text is built from the version and
        // editions attributes (edition codes mapped to full labels). A badge with
        // neither attribute renders nothing rather than throwing.
        const html = await render(`---
title: T
---
Intro paragraph.

::badge{version=">=0.15" editions="EE"}

Trailing paragraph.`)
        expect(html).not.toContain("::badge")
        expect(html).toContain('class="fw-bold d-flex gap-2 flex-wrap mb-3"')
        expect(html).toContain("Available on:")
        expect(html).toContain("v&gt;=0.15")
        expect(html).toContain("Enterprise Edition")
        expect(html).toContain("Intro paragraph.")
        expect(html).toContain("Trailing paragraph.")
    })

    it("renders a ::badge with no attributes without throwing (no 302) or leaking", async () => {
        // The whole reason this page styles badges with its own transform instead
        // of remark-custom-elements: that handler throws when a badge has neither
        // version nor editions, which would 302 the entire archive page. Ours must
        // render nothing and resolve cleanly.
        const html = await render(`---
title: T
---
Before.

::badge{}

After.`)
        expect(html).not.toContain("::badge")
        expect(html).toContain("Before.")
        expect(html).toContain("After.")
    })

    it("passes raw HTML blocks (video embeds, iframes) through to the output", async () => {
        // Real homepages embed raw HTML — a video-container div wrapping a
        // YouTube iframe. These must survive to the output, not be escaped or
        // dropped.
        const html = await render(`---
title: T
---
Intro.

<div class="video-container">
<iframe width="560" src="https://www.youtube.com/embed/xnGYiWFM2uk" allowfullscreen></iframe>
</div>

Outro.`)
        expect(html).toContain('class="video-container"')
        expect(html).toContain("<iframe")
        expect(html).toContain('src="https://www.youtube.com/embed/xnGYiWFM2uk"')
        // not HTML-escaped into visible text
        expect(html).not.toContain("&lt;iframe")
        expect(html).toContain("Intro.")
        expect(html).toContain("Outro.")
    })

    it("still renders ordinary markdown", async () => {
        const html = await render(`---
title: T
---
## Heading

A paragraph with [a link](https://kestra.io).`)
        expect(html).toContain("<h2")
        expect(html).toContain("Heading")
        expect(html).toContain('href="https://kestra.io"')
    })

    it("hands HomePageButtons to the page with its :buttons JSON parsed, not leaking the raw prop", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            renderableComponents,
            markdown: `---
title: T
---
Welcome.

:::HomePageButtons{ :buttons='[{"label":"Quickstart →","href":"/docs/quickstart#start-kestra"},{"label":"Why Kestra?","href":"/docs/why-kestra"}]'}
:::

More.`,
        })
        const html = body.html
        expect(body.components).toEqual([
            {
                tag: "home-page-buttons",
                props: {
                    buttons: [
                        { label: "Quickstart →", href: "/docs/quickstart#start-kestra" },
                        { label: "Why Kestra?", href: "/docs/why-kestra" },
                    ],
                },
            },
        ])
        expect(html).toContain("<!--mdc:0-->")
        expect(html).not.toContain(":buttons")
        expect(html).not.toContain("HomePageButtons")
        // the container's closing ::: must be consumed too, not orphaned
        expect(html).not.toContain(":::")
        expect(html).toContain("Welcome.")
        expect(html).toContain("More.")
    })

    it("strips leading Astro ESM imports (the '~/' component alias) without leaking them", async () => {
        const html = await render(`---
title: T
---

import ChildCard from "~/components/docs/ChildCard.astro"
import PluginCount from "~/components/content/PluginCount.vue"

Welcome.`)
        expect(html).not.toContain("import ChildCard")
        expect(html).not.toContain("import PluginCount")
        expect(html).not.toContain("~/components")
        expect(html).toContain("Welcome.")
    })

    it("keeps an import-like line that isn't the '~/' component alias (a real code sample)", async () => {
        const html = await render(`---
title: T
---

\`\`\`javascript
import { configureClient } from "@kestra-io/kestra-sdk";
\`\`\``)
        expect(textOnly(html)).toContain('import { configureClient } from "@kestra-io/kestra-sdk";')
    })

    it("normalizes the homepage's real JSX <HomePageButtons buttons={[...]}/> into parsed props, no leak", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            renderableComponents,
            markdown: `---
title: T
---

<HomePageButtons
    buttons={[
        { label: "Quickstart →", href: "/docs/quickstart#start-kestra" },
        { label: "Why Kestra?", href: "/docs/why-kestra" },
    ]}
/>`,
        })
        expect(body.components[0].props.buttons).toEqual([
            { label: "Quickstart →", href: "/docs/quickstart#start-kestra" },
            { label: "Why Kestra?", href: "/docs/why-kestra" },
        ])
        expect(body.html).not.toContain("HomePageButtons")
        expect(body.html).not.toContain("buttons={")
    })

    it("normalizes a self-closing <HomePageHeader title=.../> without swallowing the following paragraph as raw text", async () => {
        // Old homepages open with a genuinely childless JSX tag. The parser
        // doesn't recognize its self-close and instead treats it as an opener
        // that swallows the immediately-following paragraph as unwrapped,
        // un-parsed text (literal "**bold**", no <p>) until the next blank line.
        const html = await render(`---
title: T
---

<HomePageHeader title="What is Kestra?" />
Kestra is an open-source, infinitely-scalable **orchestration platform**.

Second paragraph, thanks to :PluginCount plugins.`)
        expect(html).toContain('<h2 id="what-is-kestra">What is Kestra?</h2>')
        expect(html).toContain(
            "<p>Kestra is an open-source, infinitely-scalable <strong>orchestration platform</strong>.</p>",
        )
        expect(html).not.toContain("**")
        expect(html).not.toContain("HomePageHeader")
        expect(html).toContain("<p>Second paragraph, thanks to hundreds of plugins.</p>")
    })

    it("strips an empty bespoke component block without leaking it", async () => {
        const html = await render(`---
title: T
---
Intro.

:::WhatsNew{title="x"}
:::

Outro.`)
        expect(html).not.toContain("WhatsNew")
        expect(html).not.toContain(":::")
        expect(html).toContain("Intro.")
        expect(html).toContain("Outro.")
    })
})

describe("renderVersionedDocBody heading ids and fences", () => {
    it("gives headings clean, stable ids across repeated renders", async () => {
        // The memoized parser's slugger leaks state across renders, minting
        // "outputs-2", "outputs-3"… for the same heading on each request.
        const md = `---
title: T
---
## How to Retrieve Outputs

## Debug Expressions`
        const first = await render(md)
        const second = await render(md)
        expect(first).toContain('id="how-to-retrieve-outputs"')
        expect(first).toContain('id="debug-expressions"')
        expect(second).toContain('id="how-to-retrieve-outputs"')
    })

    it("dedupes duplicate headings within one page", async () => {
        const html = await render(`---
title: T
---
## Setup

## Setup`)
        expect(html).toContain('id="setup"')
        expect(html).toContain('id="setup-1"')
    })

    it("slugs headings the same way the site's own github-slugger does", async () => {
        // Matches rehypeHeadingIds' scheme (github-slugger), so authored
        // #anchor links and inbound deep links keep resolving.
        const html = await render(`---
title: T
---
## Inputs & Outputs`)
        expect(html).toContain('id="inputs--outputs"')
    })

    it("renders fenced code blocks with real Shiki syntax highlighting", async () => {
        const html = await render(`---
title: T
---
\`\`\`yaml
id: hello
\`\`\``)
        expect(html).toContain('<pre class="astro-code language-yaml">')
        expect(textOnly(html)).toContain("id: hello")
        // Per-token light color plus a dark-mode CSS variable, matching the
        // site's other Shiki-rendered markdown (marked-shiki.ts).
        expect(html).toMatch(/<span style="color:#[0-9A-Za-z]+;--shiki-dark:#[0-9A-Za-z]+">/)
    })

    it("shows a language label and a copy button, matching the real docs' expressive-code frame", async () => {
        const html = await render(`---
title: T
---
\`\`\`yaml
id: hello
\`\`\``)
        expect(html).toContain('<span class="language">yaml</span>')
        expect(html).toContain('<button class="copy"')
        // the label and the button both precede the actual code, and the label
        // comes first so it's the one on top (hidden on hover to reveal the button)
        const languageIndex = html.indexOf('<span class="language">')
        const copyIndex = html.indexOf('<button class="copy"')
        const codeIndex = html.indexOf("<code>")
        expect(languageIndex).toBeLessThan(copyIndex)
        expect(copyIndex).toBeLessThan(codeIndex)
    })

    it("shows a copy button on a fence with no declared language too (MDC defaults it to 'text')", async () => {
        const html = await render(`---
title: T
---
\`\`\`
plain text
\`\`\``)
        expect(html).toContain('<span class="language">text</span>')
        expect(html).toContain('<button class="copy"')
    })

    it("does not emit a spurious trailing blank line (MDC always appends a trailing newline to the code prop)", async () => {
        const html = await render(`---
title: T
---
\`\`\`yaml
id: hello
\`\`\``)
        expect(html.match(/<span class="line">/g)).toHaveLength(1)
    })

    it("still themes a fence in an unregistered language, just without token colors", async () => {
        const html = await render(`---
title: T
---
\`\`\`made-up-lang
x
\`\`\``)
        expect(html).toContain('<pre class="astro-code language-made-up-lang">')
        expect(html).toContain('<span class="language">made-up-lang</span>')
        expect(html).toContain(">x<")
    })

    it("collects h2/h3 headings for the right-rail TOC", async () => {
        const { headings } = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---
title: T
---
## One

text

## Two

### Two Sub`,
        })
        expect(headings).toEqual([
            { id: "one", text: "One", level: 2 },
            { id: "two", text: "Two", level: 2 },
            { id: "two-sub", text: "Two Sub", level: 3 },
        ])
    })
})

describe("renderVersionedDocBody unknown-component diagnostics", () => {
    it("reports unrecognized components while still rendering their children", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---
title: T
---
:::steps
step content survives
:::

:::ChildCard
:::`,
        })
        expect(body.unknownComponents).toEqual(["steps"])
        expect(body.html).toContain("step content survives")
        expect(body.html).not.toContain(":::")
    })

    it("reports nothing when every component is a known one", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---
title: T
---
:::alert{type="info"}
fine
:::`,
        })
        expect(body.unknownComponents).toEqual([])
    })

    it("dedupes and sorts repeated unknown components", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---
title: T
---
:::zeta
one
:::

:::alpha
two
:::

:::zeta
three
:::`,
        })
        expect(body.unknownComponents).toEqual(["alpha", "zeta"])
    })

    it("renders GFM task-list checkboxes and audio as HTML instead of reporting them", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---
title: T
---
- [ ] pending task
- [x] done task

<audio src="/x.mp3"></audio>`,
        })
        expect(body.unknownComponents).toEqual([])
        expect(body.html).toContain("<input")
        expect(body.html).toContain("<audio")
    })

    it("still reports an unrecognized component when it's the last, childless thing on the page", async () => {
        // A component that's both trailing and childless is trimmed as
        // presumed-decorative residue (trimTrailingResidue) unless it's in
        // ATTR_DRIVEN_COMPONENTS — trimmed away before componentHtml ever
        // sees it, which used to make it invisible to this diagnostic too
        // (this exact shape silently dropped GuidesChildCard in production).
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---
title: T
---
Before.

<SomeFutureComponent />`,
        })
        expect(body.unknownComponents).toEqual(["some-future-component"])
        expect(body.html).toBe("<p>Before.</p>")
    })

    it("doesn't mistake a code sample's <Foo> generic/tag for a component reference", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---
title: T
---
\`\`\`java
List<Foo> items = new ArrayList<>();
\`\`\`

Trailing inline \`<Bar/>\` code too.`,
        })
        expect(body.unknownComponents).toEqual([])
    })
})

describe("renderVersionedDocBody bespoke components", () => {
    it("lifts component titles into slugged headings that reach the TOC", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "",
            markdown: `---
title: T
---
:::HomePageHeader{title="What is Kestra?"}
:::

## Real heading
`,
        })
        expect(body.headings).toEqual([
            { id: "what-is-kestra", text: "What is Kestra?", level: 2 },
            { id: "real-heading", text: "Real heading", level: 2 },
        ])
    })

    it("renders HomePageHeader's title as a heading instead of dropping it", async () => {
        const html = await render(`---
title: T
---
:::HomePageHeader{title="What is Kestra?"}
:::`)
        expect(html).toContain("<h2")
        expect(html).toContain("What is Kestra?")
        expect(html).not.toContain("HomePageHeader")
    })

    it("substitutes a static quantity for the inline :PluginCount island", async () => {
        const html = await render(`---
title: T
---
Thanks to :PluginCount plugins, building is easy.`)
        expect(html).toContain("Thanks to hundreds of plugins")
    })

    it("hands SupportLinks to the page to render as the real component", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            renderableComponents,
            markdown: `---
title: T
---
:::SupportLinks
:::`,
        })
        expect(body.components).toEqual([{ tag: "support-links", props: {} }])
        expect(body.html).toContain("<!--mdc:0-->")
        expect(body.html).not.toContain("SupportLinks")
    })

    it("trims the trailing rule and spacer left by dropped components", async () => {
        const html = await render(`---
title: T
---
Real content.

---

:::WhatsNew{title="x"}
:::

<div style="height: 50px"></div>`)
        expect(html).toContain("Real content.")
        expect(html).not.toContain("<hr")
        expect(html).not.toContain("height: 50px")
    })

    it("closes a nested component on its own fence, not the parent's", async () => {
        const html = await render(`---
title: T
---
::::alert{type="info"}
outer copy

:::collapse{title="Inner"}
inner copy
:::

still outer
::::`)
        expect(html).toMatch(
            /<div class="doc-alert alert alert-info"[^>]*>[\s\S]*<details class="doc-collapse">[\s\S]*inner copy[\s\S]*<\/details>[\s\S]*still outer[\s\S]*<\/div>/,
        )
        expect(html).not.toContain("::")
    })

    it("treats an unclosed :: directive as a leaf, leaving the following prose its own paragraph", async () => {
        const html = await render(`---
title: T
---
::badge{editions="EE"}

Body copy.`)
        expect(html).toContain("Enterprise Edition")
        expect(html).toContain("<p>Body copy.</p>")
    })

    it("keeps a raw-HTML wrapper around the markdown blocks it spans", async () => {
        // Blank lines split the wrapper's open and close tags into separate
        // tokens; the div must still contain the markdown between them.
        const html = await render(`---
title: T
---
<div class="callout">

Wrapped **copy**.

</div>`)
        expect(html).toMatch(
            /<div class="callout">[\s\S]*<p>Wrapped <strong>copy<\/strong>.<\/p>[\s\S]*<\/div>/,
        )
    })

    it("does not double-escape entities already written in the source", async () => {
        const html = await render(`---
title: T
---
Use &lt;task&gt; and R&amp;D.`)
        expect(html).toContain("Use &lt;task&gt; and R&amp;D.")
        expect(html).not.toContain("&amp;lt;")
    })

    it("leaves a URL's colon alone instead of reading it as an inline directive", async () => {
        const html = await render(`---
title: T
---
See https://kestra.io/docs for more.`)
        expect(html).toContain("https://kestra.io/docs")
    })

    it("keeps a mid-document rule", async () => {
        const html = await render(`---
title: T
---
Before.

---

After.`)
        expect(html).toContain("<hr")
        expect(html).toContain("After.")
    })
})

describe("renderVersionedDocBody data-driven components", () => {
    const children = {
        docs: { title: "Welcome" },
        "docs/getting-started": {
            title: "Getting Started",
            description: "Follow the [Quickstart Guide](./01.quickstart.md) to install.",
        },
        "docs/getting-started/quickstart": {
            title: "Quickstart",
            icon: "/docs/icons/quickstart.svg",
        },
        "docs/use-cases": { title: "Use Cases" },
        "docs/use-cases/dbt": { title: "dbt", description: "Run dbt.", sidebarTitle: "DBT" },
        "docs/use-cases/python": { title: "Python" },
        "docs/hidden": { title: "Hidden", hideSidebar: true },
    }
    const renderWith = async (path: string, markdown: string) =>
        (
            await renderVersionedDocBody({
                version: "1.3",
                path,
                markdown: `---\ntitle: T\n---\n${markdown}`,
                children,
            })
        ).html

    it("renders a bare ChildCard as the current page's child cards, mirroring the real GuidesChildCard.vue's markup", async () => {
        const html = await renderWith("getting-started", ":::ChildCard\n:::")
        expect(html).toContain('class="ks-child-card-grid"')
        expect(html).toContain('class="ks-child-card" href="/docs/1.3/getting-started/quickstart"')
        expect(html).toContain('class="ks-child-card-title"')
        expect(html).toContain("Quickstart")
        expect(html).not.toContain("ChildCard")
    })

    it("renders the child's icon as an img when the children map has one", async () => {
        const html = await renderWith("getting-started", ":::ChildCard\n:::")
        expect(html).toContain('class="ks-child-card-icon"')
        expect(html).toContain(
            'src="https://api.kestra.io/v1/docs/docs/icons/quickstart.svg/versions/1.3.0"',
        )
    })

    it("omits the icon element when the child has none", async () => {
        const html = await renderWith("use-cases", ":::ChildCard\n:::")
        expect(html).not.toContain("ks-child-card-icon")
    })

    it("strips the 1.2+ API's /src/contents content-root prefix from icon refs", async () => {
        const withPrefixedIcon = {
            ...children,
            "docs/getting-started/quickstart": {
                title: "Quickstart",
                icon: "/src/contents/docs/icons/quickstart.svg",
            },
        }
        const html = (
            await renderVersionedDocBody({
                version: "1.3",
                path: "getting-started",
                markdown: "---\ntitle: T\n---\n:::ChildCard\n:::",
                children: withPrefixedIcon,
            })
        ).html
        expect(html).toContain(
            'src="https://api.kestra.io/v1/docs/docs/icons/quickstart.svg/versions/1.3.0"',
        )
        expect(html).not.toContain("/src/contents")
    })

    it("prefers sidebarTitle for the card's title, like the real card component does", async () => {
        const html = await renderWith("use-cases", ":::ChildCard\n:::")
        expect(html).toContain(">DBT<")
        expect(html).not.toContain(">dbt<")
    })

    it("renders BigChildCards from its directory with title and plain-text description", async () => {
        const html = await renderWith(
            "",
            ':::BigChildCards{directory="/docs/use-cases" title="What is possible"}\n:::',
        )
        expect(html).toContain('<h2 id="what-is-possible">What is possible</h2>')
        expect(html).toContain('href="/docs/1.3/use-cases/dbt"')
        expect(html).toContain("Run dbt.")
        expect(html).not.toContain("BigChildCards")
        // the 0.19-era pageUrl variant targets the same data
        const html019 = await renderWith(
            "",
            ':::ChildCard{pageUrl="/docs/getting-started/"}\n:::',
        )
        expect(html019).toContain('href="/docs/1.3/getting-started/quickstart"')
        // description markdown is unwrapped to plain text; hidden pages excluded
        const htmlHome = await renderWith("", ":::ChildCard\n:::")
        expect(htmlHome).toContain("Follow the Quickstart Guide to install.")
        expect(htmlHome).not.toContain('href="/docs/1.3/hidden"')
    })

    it("renders nothing for ChildCard when the children map is empty", async () => {
        const html = await render(`---\ntitle: T\n---\n:::ChildCard\n:::`)
        expect(html).not.toContain('class="ks-child-card-grid"')
        expect(html).not.toContain("ChildCard")
    })

    it("surfaces GuidesChildCard's data for the real Vue island, even as the trailing page element", async () => {
        // Matches the real how-to-guides index page exactly: a genuinely
        // self-closing JSX tag (not the ":::" fence form) with nothing after
        // it — GuidesChildCard's real filtering is interactive, so it's
        // rendered by docs-versioned.astro as an actual client:load island,
        // not a static grid; this only needs to surface its data correctly,
        // including from the trailing/childless source position that used to
        // get the whole component silently trimmed away pre-serialize.
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "getting-started",
            markdown: `---\ntitle: T\n---\nAdjust the filters based on your needs or search directly.\n\n<GuidesChildCard />`,
            children,
        })
        expect(body.html).not.toContain("ks-child-card-grid")
        expect(body.html).not.toContain("GuidesChildCard")
        expect(body.unknownComponents).toEqual([])
        expect(body.guidesChildCard).toEqual([
            {
                title: "Quickstart",
                description: undefined,
                path: "/docs/1.3/getting-started/quickstart",
                icon: "https://api.kestra.io/v1/docs/docs/icons/quickstart.svg/versions/1.3.0",
                stage: undefined,
                topics: undefined,
            },
        ])
    })

    it("omits guidesChildCard when the page doesn't use the component", async () => {
        const html = await renderWith("getting-started", ":::ChildCard\n:::")
        expect(html).toContain('class="ks-child-card-grid"')
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "getting-started",
            markdown: `---\ntitle: T\n---\n:::ChildCard\n:::`,
            children,
        })
        expect(body.guidesChildCard).toBeUndefined()
    })

    it("re-points absolute /docs links that exist in this version", async () => {
        const html = await renderWith(
            "getting-started",
            "[qs](/docs/getting-started/quickstart#start) [gone](/docs/not-in-this-version) [versioned](/docs/1.1/foo) [home](/docs)",
        )
        expect(html).toContain('href="/docs/1.3/getting-started/quickstart#start"')
        expect(html).toContain('href="/docs/not-in-this-version"')
        expect(html).toContain('href="/docs/1.1/foo"')
        expect(html).toContain('href="/docs/1.3"')
    })

    it("re-points the HomePageButtons CTA hrefs too", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "",
            children,
            renderableComponents,
            markdown: `---\ntitle: T\n---\n:::HomePageButtons{ :buttons='[{"label":"Quickstart","href":"/docs/getting-started/quickstart#go"},{"label":"Ext","href":"/pricing"}]'}\n:::`,
        })
        expect(body.components[0].props.buttons).toEqual([
            { label: "Quickstart", href: "/docs/1.3/getting-started/quickstart#go" },
            { label: "Ext", href: "/pricing" },
        ])
    })
})

describe("renderVersionedDocBody asset rewriting", () => {
    it("re-points a /docs-rooted image at the versioned asset API (doubled docs)", async () => {
        const html = await render(`---
title: T
---
![diagram](/docs/tutorial/fundamentals/create_button.png)`)
        expect(html).toContain(
            'src="https://api.kestra.io/v1/docs/docs/tutorial/fundamentals/create_button.png/versions/1.3.0"',
        )
        // the raw, un-versioned ref must not survive
        expect(html).not.toContain('src="/docs/tutorial/fundamentals/create_button.png"')
    })

    it("re-points a bare-root asset keeping a single docs (the single-docs discriminator)", async () => {
        // Proves we mirror the in-app resourceUrl, NOT apiDocPath: apiDocPath
        // always doubles "docs" and would 500 on this bare-root form.
        const html = await render(`---
title: T
---
![autocomplete](/autocompletion.gif)`)
        expect(html).toContain(
            'src="https://api.kestra.io/v1/docs/autocompletion.gif/versions/1.3.0"',
        )
        expect(html).not.toContain('src="/autocompletion.gif"')
    })

    it("leaves an external image URL untouched", async () => {
        const html = await render(`---
title: T
---
![ext](https://cdn.example.com/x.png)`)
        expect(html).toContain('src="https://cdn.example.com/x.png"')
        expect(html).not.toContain("/versions/1.3.0")
    })

    it("leaves a protocol-relative image URL untouched", async () => {
        const html = await render(`---
title: T
---
<img src="//cdn.example.com/x.png">`)
        expect(html).toContain('src="//cdn.example.com/x.png"')
        expect(html).not.toContain("/versions/1.3.0")
    })

    it("uses the injected apiUrl (the production-injected base, not the default)", async () => {
        const { html } = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---\ntitle: T\n---\n![d](/docs/x.png)`,
            apiUrl: "https://staging.example/v1",
        })
        expect(html).toContain(
            'src="https://staging.example/v1/docs/docs/x.png/versions/1.3.0"',
        )
        expect(html).not.toContain("api.kestra.io")
    })

    it("rewrites relative source links to versioned pretty URLs", async () => {
        const { html } = await renderVersionedDocBody({
            version: "1.3",
            path: "tutorial/outputs",
            markdown: `---
title: T
---
See [storage](../07.architecture/09.internal-storage.md) and [expr](../expressions/index.md#syntax).`,
        })
        expect(html).toContain('href="/docs/1.3/architecture/internal-storage"')
        expect(html).toContain('href="/docs/1.3/expressions#syntax"')
        expect(html).not.toContain(".md")
    })

    it("resolves version-home relative links inside the version", async () => {
        // Without rewriting, "./01.getting-started/01.quickstart.md" on
        // /docs/0.19 resolves against /docs/ and silently exits versioned docs.
        const { html } = await renderVersionedDocBody({
            version: "1.3",
            path: "",
            markdown: `---
title: T
---
[Quickstart](./01.getting-started/01.quickstart.md)`,
        })
        expect(html).toContain('href="/docs/1.3/getting-started/quickstart"')
    })

    it("resolves an index page's links inside its own directory", async () => {
        const { html } = await renderVersionedDocBody({
            version: "1.3",
            path: "tutorial",
            markdown: `---
title: T
---
[Fundamentals](./01.fundamentals.md)`,
            children: {
                docs: { title: "Docs" },
                "docs/tutorial": { title: "Tutorial" },
                "docs/tutorial/fundamentals": { title: "Fundamentals" },
            },
        })
        expect(html).toContain('href="/docs/1.3/tutorial/fundamentals"')
    })

    it("leaves absolute, anchor and external links untouched", async () => {
        const html = await render(`---
title: T
---
[abs](/docs/why-kestra) [ext](https://kestra.io/slack) [anchor](#here)`)
        expect(html).toContain('href="/docs/why-kestra"')
        expect(html).toContain('href="https://kestra.io/slack"')
        expect(html).toContain('href="#here"')
    })

    it("re-points a 1.2+ colocated relative image at the versioned asset API", async () => {
        const { html } = await renderVersionedDocBody({
            version: "1.3",
            path: "tutorial/fundamentals",
            markdown: `---\ntitle: T\n---\n![Create flow](./create_button.png)`,
            children: {
                docs: { title: "Docs" },
                "docs/tutorial": { title: "Tutorial", isIndex: true },
                "docs/tutorial/fundamentals": { title: "Fundamentals", isIndex: true },
            },
        })
        expect(html).toContain(
            'src="https://api.kestra.io/v1/docs/docs/tutorial/fundamentals/create_button.png/versions/1.3.0"',
        )
        expect(html).not.toContain('src="./create_button.png"')
    })

    it("re-points a relative image that walks up out of the page's directory", async () => {
        const { html } = await renderVersionedDocBody({
            version: "1.3",
            path: "use-cases/dbt",
            markdown: `---\ntitle: T\n---\n![editor](../../15.how-to-guides/dbt/dbt-code-editor.png)`,
            children: {
                docs: { title: "Docs" },
                "docs/use-cases/dbt": { title: "dbt", isIndex: true },
            },
        })
        expect(html).toContain(
            'src="https://api.kestra.io/v1/docs/docs/how-to-guides/dbt/dbt-code-editor.png/versions/1.3.0"',
        )
    })

    it("tags images `zoom`, like latest's rehype plugin", async () => {
        const html = await render(`---
title: T
---
![diagram](/docs/x.png)`)
        expect(html).toContain('class="zoom"')
    })

    it("re-points a raw-HTML video src and poster", async () => {
        const html = await render(`---
title: T
---
<video src="/docs/demo.mp4" poster="/docs/demo.png"></video>`)
        expect(html).toContain(
            'src="https://api.kestra.io/v1/docs/docs/demo.mp4/versions/1.3.0"',
        )
        expect(html).toContain(
            'poster="https://api.kestra.io/v1/docs/docs/demo.png/versions/1.3.0"',
        )
    })
})

describe("renderVersionedDocBody real-component rendering", () => {
    it("hands a codebase component to the page even as the last, childless node", async () => {
        // The reported /docs/1.3/api-reference/enterprise blank page: ApiDocEE is
        // trailing and childless, so it was trimmed as decorative residue before
        // it could ever be rendered.
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "api-reference/enterprise",
            markdown: `---
title: T
---
import ApiDocEE from "~/components/content/ApiDocee.astro"

API Reference of Kestra Cloud & Enterprise.

## Explore the Kestra Cloud and Enterprise API

<ApiDocEE />`,
            renderableComponents,
        })
        expect(body.components).toEqual([
            { tag: "api-doc-ee", props: { specUrl: "/api/openapi/1.3/ee.yml" } },
        ])
        expect(body.html).toContain("<!--mdc:0-->")
        expect(body.unknownComponents).toEqual([])
    })

    it("keeps a placeholder inline so it can't split the surrounding paragraph", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---
title: T
---
Text with <SupportLinks /> inline.`,
            renderableComponents,
        })
        expect(body.html).toMatch(/<p>Text with <!--mdc:0--> inline\.<\/p>/)
    })

    it("passes a component's attributes through as props", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---
title: T
---
<SupportLinks title="Need help?" />`,
            renderableComponents,
        })
        expect(body.components).toEqual([
            { tag: "support-links", props: { title: "Need help?" } },
        ])
    })

    it("re-points home-page-buttons hrefs at the rendered version", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "",
            markdown: `---
title: T
---
<HomePageButtons buttons={[{label: "Get Started", href: "/docs/getting-started"}]}/>`,
            children: { docs: {}, "docs/getting-started": {} },
            renderableComponents,
        })
        expect(body.components).toEqual([
            {
                tag: "home-page-buttons",
                props: {
                    buttons: [
                        { label: "Get Started", href: "/docs/1.3/getting-started" },
                    ],
                },
            },
        ])
    })

    it("still reports a component that exists nowhere in the codebase", async () => {
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---
title: T
---
Before.

<SomeDeletedComponent />`,
            renderableComponents,
        })
        expect(body.components).toEqual([])
        expect(body.unknownComponents).toEqual(["some-deleted-component"])
    })

    it("points an archived API reference at that version's own spec", async () => {
        // Otherwise an archived page documents today's API: the spec is a static
        // asset of the live site, not part of the versioned doc content.
        const body = await renderVersionedDocBody({
            version: "0.19",
            path: "api-reference/open-source",
            markdown: `---
title: T
---
::api-doc
::`,
            renderableComponents,
        })
        expect(body.components).toEqual([
            { tag: "api-doc", props: { specUrl: "/api/openapi/0.19/oss.yml" } },
        ])
    })
})

describe("renderVersionedDocBody remark directive reuse", () => {
    it("renders a directive registered in the live remark componentMap with no bespoke case", async () => {
        // next-link is registered for current docs but had no case here, so it
        // rendered as nothing on versioned pages.
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---
title: T
---
:::next-link
[Next up](/docs/x)
:::`,
        })
        expect(body.html).toContain("ks-doc-next-link")
        expect(body.html).toContain("btn btn-outline-primary btn-chevron-right")
        expect(body.html).toContain("Next up")
        expect(body.unknownComponents).toEqual([])
    })

    it("degrades to the directive's children when its handler throws", async () => {
        // badge throws without version/editions; a relic page must not 500.
        const body = await renderVersionedDocBody({
            version: "1.3",
            path: "x",
            markdown: `---
title: T
---
::badge

After.`,
        })
        expect(body.html).toContain("After.")
        expect(body.html).not.toContain("::badge")
    })
})

describe("splitComponentPlaceholders", () => {
    it("splits the HTML runs around each component placeholder", () => {
        expect(splitComponentPlaceholders("<p>a</p><!--mdc:0--><p>b</p>")).toEqual([
            { type: "html", html: "<p>a</p>" },
            { type: "component", index: 0 },
            { type: "html", html: "<p>b</p>" },
        ])
    })

    it("keeps adjacent placeholders and their order", () => {
        expect(splitComponentPlaceholders("<!--mdc:1--><!--mdc:0-->")).toEqual([
            { type: "component", index: 1 },
            { type: "component", index: 0 },
        ])
    })

    it("leaves placeholder-free HTML as a single run", () => {
        expect(splitComponentPlaceholders("<p>only</p>")).toEqual([
            { type: "html", html: "<p>only</p>" },
        ])
    })

    it("splits a placeholder sitting mid-element without balancing the halves", () => {
        // The page injects each run with set:html, so an unbalanced run is fine
        // as long as the concatenation is whole — that's what keeps an inline
        // component from breaking its paragraph in two.
        expect(splitComponentPlaceholders("<p>x <!--mdc:0--> y</p>")).toEqual([
            { type: "html", html: "<p>x " },
            { type: "component", index: 0 },
            { type: "html", html: " y</p>" },
        ])
    })
})

describe("componentKey file-name resolution", () => {
    // The page resolves a placeholder's tag against the component file names the
    // glob returns, so a tag only renders if both sides canonicalise the same —
    // <ApiDocEE/> living in ApiDocee.astro is exactly the mismatch that guards.
    const componentFileKeys = new Set(
        ["content", "docs"].flatMap((dir) =>
            readdirSync(resolve(dirname(fileURLToPath(import.meta.url)), "../components", dir))
                .filter((file) => file.endsWith(".astro"))
                .map((file) => componentKey(file.replace(/\.astro$/, ""))),
        ),
    )

    it.each(["api-doc-ee", "api-doc", "home-page-buttons", "support-links", "child-table-of-contents"])(
        "resolves <%s> to a component file",
        (tag) => {
            expect(componentFileKeys).toContain(componentKey(tag))
        },
    )
})
