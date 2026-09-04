import { describe, it, expect } from "vitest"
import { buildVersionedNavigation, versionedBreadcrumbItems } from "./versionedNavigation"
import type { DocChildren } from "./versionedDocs"

describe("buildVersionedNavigation", () => {
    it("groups top-level pages into the curated sections when enough titles match", () => {
        // Five real titles from the "Get Started with Kestra" section in
        // getNavigationTree.ts's curated map — enough to trigger grouping.
        const children: DocChildren = {
            docs: { title: "Documentation" },
            "docs/quickstart": { title: "Quickstart" },
            "docs/installation-guide": { title: "Installation Guide" },
            "docs/tutorial": { title: "Tutorial" },
            "docs/architecture": { title: "Architecture" },
            "docs/contribute": { title: "Contribute to Kestra" },
        }
        const nav = buildVersionedNavigation(children, "1.3")
        expect(nav).toHaveLength(1)
        expect(nav[0].isSection).toBe(true)
        expect(nav[0].title).toBe("Get Started with Kestra")
        const childTitles = nav[0].children?.map((c) => c.title)
        expect(childTitles).toEqual([
            "Quickstart",
            "Installation Guide",
            "Tutorial",
            "Architecture",
            "Contribute to Kestra",
        ])
        expect(nav[0].children?.[0].path).toBe("/docs/1.3/quickstart")
    })

    it("falls back to a flat, nav-ordered tree when fewer than 5 curated titles match", () => {
        // Old versions' page titles don't line up with the current curated map
        // (renamed/removed pages) — grouping into mostly-empty sections would be
        // worse than just showing the flat tree.
        const children: DocChildren = {
            docs: { title: "Documentation" },
            "docs/foo": { title: "Foo" },
            "docs/bar": { title: "Bar" },
            "docs/bar/baz": { title: "Baz" },
        }
        const nav = buildVersionedNavigation(children, "1.3")
        expect(nav.every((n) => !n.isSection)).toBe(true)
        expect(nav.map((n) => n.title)).toEqual(["Foo", "Bar"])
        expect(nav.find((n) => n.title === "Bar")?.children?.[0].title).toBe("Baz")
        expect(nav.find((n) => n.title === "Foo")?.path).toBe("/docs/1.3/foo")
    })

    it("matches a curated section title against the raw title when it differs from sidebarTitle", () => {
        // The curated map's "Scale with Kestra" entry is the long SEO title
        // ("Task Runners in Kestra: Offload & Isolate Compute"), but the API
        // returns the short "Task Runners" as sidebarTitle — buildDocTree
        // prefers sidebarTitle, so node.title alone would never match.
        const children: DocChildren = {
            docs: { title: "Documentation" },
            "docs/quickstart": { title: "Quickstart" },
            "docs/installation-guide": { title: "Installation Guide" },
            "docs/tutorial": { title: "Tutorial" },
            "docs/architecture": { title: "Architecture" },
            "docs/task-runners": {
                title: "Task Runners in Kestra: Offload & Isolate Compute",
                sidebarTitle: "Task Runners",
            },
        }
        const nav = buildVersionedNavigation(children, "1.3")
        const scale = nav.find((n) => n.title === "Scale with Kestra")
        expect(scale?.children?.map((c) => c.title)).toContain("Task Runners")
        // must appear exactly once — not also duplicated into the ungrouped tail
        // as a top-level sibling of the sections
        const all = nav.flatMap((n) => [n, ...(n.children ?? [])])
        expect(all.filter((c) => c.title === "Task Runners")).toHaveLength(1)
    })

    it("appends a top-level page the curated map doesn't mention, ungrouped, after the sections", () => {
        const children: DocChildren = {
            docs: { title: "Documentation" },
            "docs/quickstart": { title: "Quickstart" },
            "docs/installation-guide": { title: "Installation Guide" },
            "docs/tutorial": { title: "Tutorial" },
            "docs/architecture": { title: "Architecture" },
            "docs/contribute": { title: "Contribute to Kestra" },
            "docs/brand-new-page": { title: "Brand New Page" },
        }
        const nav = buildVersionedNavigation(children, "1.3")
        const last = nav[nav.length - 1]
        expect(last.isSection).toBeFalsy()
        expect(last.title).toBe("Brand New Page")
    })

    it("hides pages flagged hideSidebar, matching the latest-docs sidebar", () => {
        const children: DocChildren = {
            docs: { title: "Documentation" },
            "docs/quickstart": { title: "Quickstart" },
            "docs/installation-guide": { title: "Installation Guide" },
            "docs/tutorial": { title: "Tutorial" },
            "docs/architecture": { title: "Architecture" },
            "docs/contribute": { title: "Contribute to Kestra" },
            "docs/brand-assets": { title: "Brand Assets", hideSidebar: true },
        }
        const nav = buildVersionedNavigation(children, "1.3")
        const titles = JSON.stringify(nav)
        expect(titles).not.toContain("Brand Assets")
    })
})

describe("versionedBreadcrumbItems", () => {
    const children: DocChildren = {
        docs: { title: "Welcome" },
        "docs/getting-started": { title: "Getting Started" },
        "docs/getting-started/quickstart": { title: "Quickstart" },
    }

    it("shows a single 'Docs' crumb linking to the version's own home page", () => {
        const items = versionedBreadcrumbItems("1.3", "", children)
        expect(items).toEqual([{ label: "Docs", href: "/docs/1.3" }])
    })

    it("builds ancestor crumbs from the children map, never surfacing the version as its own hop", () => {
        const items = versionedBreadcrumbItems("1.3", "getting-started/quickstart", children)
        expect(items).toEqual([
            { label: "Docs", href: "/docs/1.3" },
            { label: "Getting Started", href: "/docs/1.3/getting-started" },
            { label: "Quickstart", href: "/docs/1.3/getting-started/quickstart" },
        ])
        expect(items.some((i) => i.label === "1.3")).toBe(false)
    })

    it("prefers sidebarTitle over the long title, matching the sidebar/cards", () => {
        const children: DocChildren = {
            docs: { title: "Welcome" },
            "docs/task-runners": {
                title: "Task Runners in Kestra: Offload & Isolate Compute",
                sidebarTitle: "Task Runners",
            },
        }
        const items = versionedBreadcrumbItems("1.3", "task-runners", children)
        expect(items).toEqual([
            { label: "Docs", href: "/docs/1.3" },
            { label: "Task Runners", href: "/docs/1.3/task-runners" },
        ])
    })

    it("falls back to the URL segment when the children map has no title for it", () => {
        const items = versionedBreadcrumbItems("1.3", "unlisted-page", {})
        expect(items).toEqual([
            { label: "Docs", href: "/docs/1.3" },
            { label: "unlisted-page", href: "/docs/1.3/unlisted-page" },
        ])
    })
})
