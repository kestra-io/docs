import { describe, it, expect } from "vitest"
import { renderVersionedDocHtml } from "./renderVersionedDoc"

const render = (markdown: string) =>
    renderVersionedDocHtml({ version: "1.3", path: "x", markdown, versions: [] })

describe("renderVersionedDocHtml MDC directive handling", () => {
    it("renders a known ::alert block styled, without leaking the :: syntax", async () => {
        const html = await render(`---
title: T
---
:::alert{type="warning"}
known content here
:::`)
        expect(html).toContain("known content here")
        expect(html).toContain("vd-alert vd-alert-warning")
        expect(html).not.toContain(":::")
    })

    it("renders a ::collapse with its title as a native <details> toggle", async () => {
        const html = await render(`---
title: T
---
:::collapse{title="Show more"}
collapsed body
:::`)
        expect(html).toContain("<details")
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

    it("renders an attribute-derived ::badge as a version/edition hint, no leak", async () => {
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
        expect(html).toContain("vd-badge")
        expect(html).toContain("Available on:")
        expect(html).toContain("0.15")
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

    it("renders HomePageButtons as a styled link row, first primary then secondary, not leaking :buttons", async () => {
        const html = await render(`---
title: T
---
Welcome.

:::HomePageButtons{ :buttons='[{"label":"Quickstart →","href":"/docs/quickstart#start-kestra"},{"label":"Why Kestra?","href":"/docs/why-kestra"}]'}
:::

More.`)
        expect(html).toContain('class="vd-buttons"')
        // first button is primary, the rest secondary (mirrors the live site)
        expect(html).toContain('class="vd-button vd-button-primary"')
        expect(html).toContain('class="vd-button vd-button-secondary"')
        expect(html).toContain("Quickstart →")
        expect(html).toContain('href="/docs/quickstart#start-kestra"')
        expect(html).toContain("Why Kestra?")
        expect(html).not.toContain(":buttons")
        expect(html).not.toContain("HomePageButtons")
        // the container's closing ::: must be consumed too, not orphaned
        expect(html).not.toContain(":::")
        expect(html).toContain("Welcome.")
        expect(html).toContain("More.")
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

describe("renderVersionedDocHtml heading ids and fences", () => {
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

    it("labels fenced code blocks with their language", async () => {
        const html = await render(`---
title: T
---
\`\`\`yaml
id: hello
\`\`\``)
        expect(html).toContain('data-lang="yaml"')
        expect(html).toContain("pre[data-lang]:after")
    })
})

describe("renderVersionedDocHtml bespoke components", () => {
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

    it("renders SupportLinks as the live site's static card row", async () => {
        const html = await render(`---
title: T
---
:::SupportLinks
:::`)
        expect(html).toContain('class="vd-support"')
        expect(html).toContain('href="https://kestra.io/slack"')
        expect(html).toContain("Community Slack")
        expect(html).toContain('href="https://github.com/kestra-io/kestra"')
        expect(html).not.toContain("SupportLinks")
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

describe("renderVersionedDocHtml data-driven components", () => {
    const children = {
        docs: { title: "Welcome" },
        "docs/getting-started": {
            title: "Getting Started",
            description: "Follow the [Quickstart Guide](./01.quickstart.md) to install.",
            icon: "/docs/icons/start.svg",
        },
        "docs/getting-started/quickstart": { title: "Quickstart" },
        "docs/use-cases": { title: "Use Cases" },
        "docs/use-cases/dbt": { title: "dbt", description: "Run dbt." },
        "docs/use-cases/python": { title: "Python" },
        "docs/hidden": { title: "Hidden", hideSidebar: true },
    }
    const renderWith = (path: string, markdown: string) =>
        renderVersionedDocHtml({
            version: "1.3",
            path,
            markdown: `---\ntitle: T\n---\n${markdown}`,
            versions: [],
            children,
        })

    it("renders a bare ChildCard as the current page's child cards", async () => {
        const html = await renderWith("getting-started", ":::ChildCard\n:::")
        expect(html).toContain('class="vd-cards"')
        expect(html).toContain('href="/docs/1.3/getting-started/quickstart"')
        expect(html).toContain("Quickstart")
        expect(html).not.toContain("ChildCard")
    })

    it("renders BigChildCards from its directory with title, icon and plain-text description", async () => {
        const html = await renderWith(
            "",
            ':::BigChildCards{directory="/docs/use-cases" title="What is possible"}\n:::',
        )
        expect(html).toContain("<h2")
        expect(html).toContain("What is possible")
        expect(html).toContain('href="/docs/1.3/use-cases/dbt"')
        expect(html).toContain("Run dbt.")
        expect(html).not.toContain("BigChildCards")
        // the 0.19-era pageUrl variant targets the same data
        const html019 = await renderWith(
            "",
            ':::ChildCard{pageUrl="/docs/getting-started/"}\n:::',
        )
        expect(html019).toContain('href="/docs/1.3/getting-started/quickstart"')
        // icon is versioned like any asset; description markdown is unwrapped
        const htmlHome = await renderWith("", ":::ChildCard\n:::")
        expect(htmlHome).toContain(
            'src="https://api.kestra.io/v1/docs/docs/icons/start.svg/versions/1.3.0"',
        )
        expect(htmlHome).toContain("Follow the Quickstart Guide to install.")
        expect(htmlHome).not.toContain('href="/docs/1.3/hidden"')
    })

    it("renders nothing for ChildCard when the children map is empty", async () => {
        const html = await render(`---\ntitle: T\n---\n:::ChildCard\n:::`)
        expect(html).not.toContain('class="vd-cards"')
        expect(html).not.toContain("ChildCard")
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
        const html = await renderWith(
            "",
            `:::HomePageButtons{ :buttons='[{"label":"Quickstart","href":"/docs/getting-started/quickstart#go"},{"label":"Ext","href":"/pricing"}]'}\n:::`,
        )
        expect(html).toContain('href="/docs/1.3/getting-started/quickstart#go"')
        expect(html).toContain('href="/pricing"')
    })

    it("renders a breadcrumb trail with children titles", async () => {
        const html = await renderWith("getting-started/quickstart", "Body.")
        expect(html).toContain('class="vd-breadcrumb"')
        expect(html).toContain('href="/docs/1.3"')
        expect(html).toContain('href="/docs/1.3/getting-started"')
        expect(html).toContain(">Getting Started</a>")
        expect(html).toContain("<span>Quickstart</span>")
    })

    it("renders prev/next footer cards from nav order, skipping hidden pages", async () => {
        const html = await renderWith("use-cases/dbt", "Body.")
        expect(html).toContain('class="vd-pn-row"')
        expect(html).toContain(">Previous</span>")
        expect(html).toContain(">Next</span>")
        expect(html).toContain('href="/docs/1.3/use-cases"')
        expect(html).toContain('href="/docs/1.3/use-cases/python"')
    })

    it("renders a right-rail TOC when the page has 2+ section headings", async () => {
        const html = await renderWith("getting-started", "## One\n\ntext\n\n## Two\n\n### Two Sub")
        expect(html).toContain('class="vd-toc"')
        expect(html).toContain('href="#one"')
        expect(html).toContain('href="#two"')
        expect(html).toContain('class="vd-toc-sub"')
    })

    it("skips the TOC for a page with a single heading", async () => {
        const html = await renderWith("getting-started", "## Only One")
        expect(html).not.toContain('class="vd-toc"')
    })
})

describe("renderVersionedDocHtml chrome extras", () => {
    it("loads brand fonts from a stable CDN URL and ships a copy-button script", async () => {
        const html = await render(`---\ntitle: T\n---\nBody.`)
        expect(html).toContain("fonts.googleapis.com/css2?family=Mona+Sans")
        expect(html).toContain("JetBrains+Mono")
        expect(html).toContain("vd-copy")
        expect(html).toContain("navigator.clipboard")
    })
})

describe("renderVersionedDocHtml navbar", () => {
    const nav = () =>
        renderVersionedDocHtml({
            version: "1.3",
            path: "tutorial/inputs",
            markdown: "---\ntitle: T\n---\n# Hi",
            versions: [{ label: "1.3", major: 1, minor: 3 }],
        })

    it("renders a branded navbar with logo, CTAs and version select", async () => {
        const html = await nav()
        expect(html).toContain('class="vd-logo"')
        expect(html).toContain('class="vd-logo-light"')
        expect(html).toContain('class="vd-logo-dark"')
        expect(html).toContain('href="/get-started"')
        expect(html).toContain('href="/demo"') // Contact Sales
        expect(html).toContain("Contact Sales")
        expect(html).toContain("<select")
        expect(html).toContain("<svg")
    })

    it("mirrors the site header's top-level nav (labels + plain links)", async () => {
        const html = await nav()
        for (const label of [
            "Product",
            "Solutions",
            "Plugins",
            "Learn",
            "Company",
            "Pricing",
        ]) {
            expect(html).toContain(`>${label}`)
        }
        expect(html).toContain('href="/plugins"')
        expect(html).toContain('href="/pricing"')
    })

    it("renders the grouped sections as dropdowns with their links", async () => {
        const html = await nav()
        expect(html).toContain('class="vd-nav-item"')
        expect(html).toContain('class="vd-dropdown"')
        // dropdown children sampled from each grouped section
        expect(html).toContain('href="/features"') // Product
        expect(html).toContain('href="/data"') // Solutions use-case
        expect(html).toContain("Use-cases") // Solutions column heading
        expect(html).toContain('href="/blueprints"') // Learn
        expect(html).toContain('href="/about-us"') // Company
    })

    it("ships a self-contained menu script and hamburger so every section is reachable", async () => {
        const html = await nav()
        // hamburger drawer mirrors the real header's mobile collapse
        expect(html).toContain('class="vd-burger"')
        expect(html).toContain('id="vd-drawer"')
        expect(html).toContain('aria-controls="vd-drawer"')
        // section toggles are click-openable (aria-expanded driven by the script)
        expect(html).toContain('aria-expanded="false"')
        // one inline, framework-free script drives both burger and section toggles
        expect(html).toContain("<script")
        expect(html).toContain("addEventListener")
        expect(html).toContain("vd-open")
        // no external asset graph — the script is inlined, not sourced
        expect(html).not.toContain("<script src")
    })
})

describe("renderVersionedDocHtml sidebar", () => {
    const children = {
        docs: { title: "Documentation" },
        "docs/getting-started": { title: "Getting Started" },
        "docs/getting-started/quickstart": { title: "Quickstart" },
        "docs/ui": { title: "User Interface" },
        "docs/ui/dashboard": { title: "Dashboard" },
    }
    const withSidebar = (path: string) =>
        renderVersionedDocHtml({
            version: "1.3",
            path,
            markdown: "---\ntitle: T\n---\n# Hi",
            versions: [],
            children,
        })

    it("lays the content out next to a tree sidebar built from the children map", async () => {
        const html = await withSidebar("ui/dashboard")
        expect(html).toContain('class="vd-layout"')
        expect(html).toContain('class="vd-sidebar"')
        // top-level home link + sections
        expect(html).toContain('href="/docs/1.3"')
        expect(html).toContain("Getting Started")
        expect(html).toContain("User Interface")
        // nested child link uses the versioned URL
        expect(html).toContain('href="/docs/1.3/ui/dashboard"')
        expect(html).toContain('href="/docs/1.3/getting-started/quickstart"')
    })

    it("marks the current page active and opens its ancestor sections", async () => {
        const html = await withSidebar("ui/dashboard")
        // the active leaf is highlighted with aria-current
        expect(html).toMatch(
            /<a class="vd-tree-link vd-tree-active" href="\/docs\/1\.3\/ui\/dashboard" aria-current="page">/,
        )
        // its parent <details> is rendered open server-side (no JS needed)
        expect(html).toMatch(/<details open><summary[\s\S]*?User Interface/)
        // an unrelated section stays collapsed
        expect(html).toMatch(/<details><summary[\s\S]*?Getting Started/)
    })

    it("collapses the tree behind a toggle and scrolls the active link into view", async () => {
        const html = await withSidebar("ui/dashboard")
        expect(html).toContain('class="vd-sidebar-toggle"')
        expect(html).toContain('aria-controls="vd-sidebar-nav"')
        // sidebar script is inlined alongside the nav script (no extra asset)
        expect(html).toContain("vd-tree-active")
        expect(html).toContain("scrollTop")
        expect(html).not.toContain("<script src")
    })

    it("degrades to a single content column when there are no children", async () => {
        const html = await renderVersionedDocHtml({
            version: "1.3",
            path: "x",
            markdown: "---\ntitle: T\n---\n# Hi",
            versions: [],
            children: {},
        })
        expect(html).not.toContain('class="vd-layout"')
        expect(html).not.toContain('class="vd-sidebar"')
        expect(html).toContain('class="vd-content"')
    })

    it("renders sidebar-less when children are omitted entirely", async () => {
        const html = await render(`---\ntitle: T\n---\n# Hi`)
        expect(html).not.toContain('class="vd-sidebar"')
    })
})

describe("renderVersionedDocHtml asset rewriting", () => {
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
        const html = await renderVersionedDocHtml({
            version: "1.3",
            path: "x",
            markdown: `---\ntitle: T\n---\n![d](/docs/x.png)`,
            versions: [],
            apiUrl: "https://staging.example/v1",
        })
        expect(html).toContain(
            'src="https://staging.example/v1/docs/docs/x.png/versions/1.3.0"',
        )
        expect(html).not.toContain("api.kestra.io")
    })

    it("rewrites relative source links to versioned pretty URLs", async () => {
        const html = await renderVersionedDocHtml({
            version: "1.3",
            path: "tutorial/outputs",
            markdown: `---
title: T
---
See [storage](../07.architecture/09.internal-storage.md) and [expr](../expressions/index.md#syntax).`,
            versions: [],
        })
        expect(html).toContain('href="/docs/1.3/architecture/internal-storage"')
        expect(html).toContain('href="/docs/1.3/expressions#syntax"')
        expect(html).not.toContain(".md")
    })

    it("resolves version-home relative links inside the version", async () => {
        // Without rewriting, "./01.getting-started/01.quickstart.md" on
        // /docs/0.19 resolves against /docs/ and silently exits versioned docs.
        const html = await renderVersionedDocHtml({
            version: "1.3",
            path: "",
            markdown: `---
title: T
---
[Quickstart](./01.getting-started/01.quickstart.md)`,
            versions: [],
        })
        expect(html).toContain('href="/docs/1.3/getting-started/quickstart"')
    })

    it("resolves an index page's links inside its own directory", async () => {
        const html = await renderVersionedDocHtml({
            version: "1.3",
            path: "tutorial",
            markdown: `---
title: T
---
[Fundamentals](./01.fundamentals.md)`,
            versions: [],
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
