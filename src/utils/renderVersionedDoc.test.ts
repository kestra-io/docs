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

    it("renders HomePageButtons as a styled link row, not leaking :buttons", async () => {
        const html = await render(`---
title: T
---
Welcome.

:::HomePageButtons{ :buttons='[{"label":"Quickstart →","href":"/docs/quickstart#start-kestra"}]'}
:::

More.`)
        expect(html).toContain('class="vd-buttons"')
        expect(html).toContain('class="vd-button"')
        expect(html).toContain("Quickstart →")
        expect(html).toContain('href="/docs/quickstart#start-kestra"')
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
