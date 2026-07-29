// Adapts the flat, path-keyed versioned-docs children map into the
// NavigationItem[] shape NavSideBar.vue/RecursiveNavSidebar.vue already render
// for the latest docs, so the versioned sidebar reuses the same component
// (and CSS) instead of a bespoke tree renderer.
import type { NavigationItem } from "~/components/docs/RecursiveNavSidebar.vue"
import { navigationTree as SECTION_TITLES } from "~/utils/getNavigationTree"
import {
    buildDocTree,
    docChildHref,
    type DocChildren,
    type DocTreeNode,
} from "~/utils/versionedDocs"

// Below this many curated titles matched, the version's children data doesn't
// line up with the current curated map closely enough to group meaningfully
// (older releases renamed/dropped pages the map references) — fall back to
// the flat, nav-ordered tree rather than a mostly-empty set of sections.
const MIN_MATCHED_SECTION_TITLES = 5

function toNavigationItem(node: DocTreeNode, version: string): NavigationItem {
    return {
        title: node.title,
        path: docChildHref(version, node.path),
        children: node.children.length
            ? node.children.map((c) => toNavigationItem(c, version))
            : undefined,
    }
}

/**
 * Build the versioned sidebar's NavigationItem[] tree, grouped into the same
 * curated sections as the latest docs when enough of their titles are present
 * in this version, otherwise the raw flat-but-nested tree.
 */
export function buildVersionedNavigation(
    children: DocChildren,
    version: string,
): NavigationItem[] {
    const tree = buildDocTree(children)
    const docsRoot = tree.find((n) => n.path === "docs")
    const topNodes = docsRoot ? docsRoot.children : tree
    // The curated map below has entries authored against either form, so index
    // both: node.title is already the short sidebarTitle-preferring label,
    // but some curated titles are the long SEO title (the raw `title` field).
    const byTitle = new Map<string, DocTreeNode>()
    for (const n of topNodes) {
        byTitle.set(n.title, n)
        const rawTitle = children[n.path]?.title
        if (rawTitle && rawTitle !== n.title) byTitle.set(rawTitle, n)
    }

    const sections: NavigationItem[] = []
    // Tracks which topNodes a section already claimed, by path rather than
    // title — a node can match its section via either title form (see
    // byTitle above), so a title-string comparison here would miss it and
    // duplicate the node into the ungrouped tail below.
    const claimedPaths = new Set<string>()
    let matched = 0
    for (const [section, titles] of Object.entries(SECTION_TITLES)) {
        const sectionChildren = titles
            .map((t) => byTitle.get(t))
            .filter((n): n is DocTreeNode => Boolean(n))
        matched += sectionChildren.length
        if (!sectionChildren.length) continue
        sectionChildren.forEach((n) => claimedPaths.add(n.path))
        sections.push({
            title: section,
            isSection: true,
            path: "#",
            children: sectionChildren.map((n) => toNavigationItem(n, version)),
        })
    }

    if (matched < MIN_MATCHED_SECTION_TITLES) {
        return topNodes.map((n) => toNavigationItem(n, version))
    }

    // A top-level node the curated map doesn't mention (a page added since the
    // map was last updated) is appended after the last section, ungrouped.
    const unclaimed = topNodes.filter((n) => !claimedPaths.has(n.path))
    return [...sections, ...unclaimed.map((n) => toNavigationItem(n, version))]
}

/**
 * Breadcrumb.vue's generic slug-splitting would turn the version into its own
 * confusing hop ("Docs / 1.2 / Tutorial"). Build the crumbs explicitly instead
 * — "Docs" (the version's own home) then each ancestor directory's title from
 * the children map — via Breadcrumb.vue's `items` override, so the version
 * segment never surfaces as a fake page.
 */
export function versionedBreadcrumbItems(
    version: string,
    path: string,
    children: DocChildren,
): { label: string; href: string }[] {
    const docsHref = docChildHref(version, "docs")
    if (!path) return [{ label: "Docs", href: docsHref }]
    const segs = path.split("/")
    const items = [{ label: "Docs", href: docsHref }]
    let acc = "docs"
    for (const seg of segs.slice(0, -1)) {
        acc = `${acc}/${seg}`
        const meta = children[acc]
        items.push({ label: meta?.sidebarTitle ?? meta?.title ?? seg, href: docChildHref(version, acc) })
    }
    const lastKey = `docs/${path}`
    const lastMeta = children[lastKey]
    items.push({
        label: lastMeta?.sidebarTitle ?? lastMeta?.title ?? segs[segs.length - 1],
        href: docChildHref(version, lastKey),
    })
    return items
}
