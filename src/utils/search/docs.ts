import type { SearchResult } from "~/utils/searchResults"
import { withFullTextMatches } from "~/utils/search/fullText"
import { fetchJson, loadOnce } from "~/utils/search/loaders"
import { includesAll, MAX_RESULTS, searchTokens } from "~/utils/search/matching"

export type DocsSection = {
    title: string
    icon?: string
    order: number
    reference: boolean
}

export type DocsPage = {
    id: string
    title: string
    short: string
    description: string
    headings: string[]
}

export type DocsIndex = {
    sections: Record<string, DocsSection>
    pages: DocsPage[]
}

export interface DocsSearchResult extends SearchResult {
    doc: {
        id: string
        fullTitle: string
        description: string
        section: string
        sectionTitle: string
        sectionIcon?: string
        groupStart: boolean
        groupCount: number
    }
}

export const loadDocsIndex = loadOnce(() =>
    fetchJson<DocsIndex>("/api/docs-search"),
)

const sectionOf = (page: DocsPage) => page.id.split("/")[0]

const depthOf = (page: DocsPage) => page.id.split("/").length

function rankDocs(docs: DocsIndex, tokens: string[]) {
    const section = (page: DocsPage) => docs.sections[sectionOf(page)]
    const bySection = (a: DocsPage, b: DocsPage) =>
        Number(section(a)?.reference) - Number(section(b)?.reference) ||
        (section(a)?.order ?? 0) - (section(b)?.order ?? 0)
    const tier = (page: DocsPage) => {
        const title = `${page.title} ${page.short}`
        if (includesAll(title, tokens)) return 3
        return includesAll(`${title} ${page.headings.join(" ")}`, tokens)
            ? 2
            : 1
    }
    return docs.pages
        .filter((page) =>
            includesAll(
                [
                    page.title,
                    page.short,
                    ...page.headings,
                    page.description,
                    page.id.replaceAll("-", " "),
                ].join(" "),
                tokens,
            ),
        )
        .map((page) => ({ page, tier: tier(page) }))
        .sort(
            (a, b) =>
                b.tier - a.tier ||
                bySection(a.page, b.page) ||
                depthOf(a.page) - depthOf(b.page) ||
                a.page.short.length - b.page.short.length,
        )
        .map(({ page }) => page)
}

const toResult = (
    docs: DocsIndex,
    page: DocsPage,
    group: {
        section: string
        title: string
        icon?: string
        start: boolean
        count: number
    },
): DocsSearchResult => ({
    url: `docs/${page.id}`,
    type: "DOCS",
    title: group.section
        ? page.short
        : (docs.sections[page.id]?.title ?? page.short),
    doc: {
        id: page.id,
        fullTitle: page.title,
        description: page.description,
        section: group.section,
        sectionTitle: group.title,
        sectionIcon: group.icon,
        groupStart: group.start,
        groupCount: group.count,
    },
})

function groupBySection(docs: DocsIndex, pages: DocsPage[]) {
    const groups = new Map<string, DocsPage[]>()
    for (const page of pages) {
        const section = sectionOf(page)
        groups.set(section, [...(groups.get(section) ?? []), page])
    }
    return [...groups].flatMap(([section, list]) =>
        list.map((page, i) =>
            toResult(docs, page, {
                section,
                title: docs.sections[section]?.title ?? section,
                icon: docs.sections[section]?.icon,
                start: i === 0,
                count: list.length,
            }),
        ),
    )
}

// Before anything is typed: each section's own page, in sidebar order.
function docsHome(docs: DocsIndex) {
    const roots = docs.pages
        .filter(
            (page) =>
                !page.id.includes("/") &&
                docs.sections[page.id]?.reference === false,
        )
        .sort((a, b) => docs.sections[a.id].order - docs.sections[b.id].order)
    return roots.map((page, i) =>
        toResult(docs, page, {
            section: "",
            title: "Documentation",
            start: i === 0,
            count: roots.length,
        }),
    )
}

export function docsSearchResults(
    docs: DocsIndex,
    query: string,
    fullTextUrls: string[] = [],
) {
    const tokens = searchTokens(query)
    if (!tokens.length) {
        return { total: docs.pages.length, results: docsHome(docs) }
    }
    const pages = withFullTextMatches(
        rankDocs(docs, tokens),
        docs.pages,
        fullTextUrls,
        "docs/",
    )
    return {
        total: pages.length,
        results: groupBySection(docs, pages.slice(0, MAX_RESULTS)),
    }
}
