import type { SearchResult } from "~/utils/searchResults"
import {
    fullTextSnippets,
    withFullTextMatches,
    type FullTextMatch,
    type SnippetPart,
} from "~/utils/search/fullText"
import { $fetch } from "~/utils/fetch"
import { loadOnce } from "~/utils/search/loaders"
import {
    includesAll,
    isExactMatch,
    MAX_RESULTS,
    searchTokens,
} from "~/utils/search/matching"

const SCORE = { EXACT: 4, TITLE: 3, SECONDARY: 2, OTHER: 1 } as const

export type DocsSection = {
    title: string
    icon?: string
    order: number
    sidebar: boolean
    reference: boolean
    guide?: boolean
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
        snippet?: SnippetPart[]
    }
}

export const loadDocsIndex = loadOnce(() =>
    $fetch<DocsIndex>("/api/docs-search"),
)

const sectionOf = (page: DocsPage) => page.id.split("/")[0]

const depthOf = (page: DocsPage) => page.id.split("/").length

function rankDocs(docs: DocsIndex, query: string, tokens: string[]) {
    const section = (page: DocsPage) => docs.sections[sectionOf(page)]
    const bySection = (a: DocsPage, b: DocsPage) =>
        Number(section(a)?.reference) - Number(section(b)?.reference) ||
        Number(section(a)?.guide ?? false) -
            Number(section(b)?.guide ?? false) ||
        (section(a)?.order ?? 0) - (section(b)?.order ?? 0)
    const score = (page: DocsPage) => {
        if (isExactMatch(query, page.short, page.title)) return SCORE.EXACT
        const title = `${page.title} ${page.short}`
        if (includesAll(title, tokens)) return SCORE.TITLE
        return includesAll(`${title} ${page.headings.join(" ")}`, tokens)
            ? SCORE.SECONDARY
            : SCORE.OTHER
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
        .map((page) => ({ page, score: score(page) }))
        .sort(
            (a, b) =>
                b.score - a.score ||
                bySection(a.page, b.page) ||
                depthOf(a.page) - depthOf(b.page) ||
                a.page.short.length - b.page.short.length,
        )
}

type Ranked = { page: DocsPage; snippet?: SnippetPart[] }

const toResult = (
    docs: DocsIndex,
    { page, snippet }: Ranked,
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
        snippet,
    },
})

function groupRuns(docs: DocsIndex, ranked: Ranked[]) {
    const runs: Ranked[][] = []
    for (const entry of ranked) {
        const last = runs.at(-1)
        if (last && sectionOf(last[0].page) === sectionOf(entry.page)) {
            last.push(entry)
        } else {
            runs.push([entry])
        }
    }
    return runs.flatMap((run) => {
        const section = sectionOf(run[0].page)
        return run.map((entry, i) =>
            toResult(docs, entry, {
                section,
                title: docs.sections[section]?.title ?? section,
                icon: docs.sections[section]?.icon,
                start: i === 0,
                count: run.length,
            }),
        )
    })
}

// Before anything is typed: each section's own page, in sidebar order.
function docsHome(docs: DocsIndex) {
    const roots = docs.pages
        .filter(
            (page) =>
                !page.id.includes("/") &&
                docs.sections[page.id]?.sidebar === true &&
                docs.sections[page.id]?.reference === false,
        )
        .sort((a, b) => docs.sections[a.id].order - docs.sections[b.id].order)
    return roots.map((page, i) =>
        toResult(
            docs,
            { page },
            {
                section: "",
                title: "Documentation",
                start: i === 0,
                count: roots.length,
            },
        ),
    )
}

export function docsSearchResults(
    docs: DocsIndex,
    query: string,
    fullText: FullTextMatch[] = [],
) {
    const tokens = searchTokens(query)
    if (!tokens.length) {
        return { total: docs.pages.length, results: docsHome(docs) }
    }
    const ranked = rankDocs(docs, query, tokens)
    const local = new Set(ranked.map(({ page }) => page.id))
    const snippets = fullTextSnippets(fullText, "docs/")
    const pages = withFullTextMatches(
        ranked.map(({ page }) => page),
        docs.pages,
        fullText.map((match) => match.url),
        "docs/",
    )
    return {
        total: pages.length,
        results: groupRuns(
            docs,
            pages.slice(0, MAX_RESULTS).map((page) => ({
                page,
                snippet: local.has(page.id) ? undefined : snippets.get(page.id),
            })),
        ),
    }
}
