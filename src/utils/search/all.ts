import type { SearchResult } from "~/utils/searchResults"
import { includesAll, MAX_RESULTS, searchTokens } from "~/utils/search/matching"

type Row = SearchResult & {
    doc?: { fullTitle: string; groupStart: boolean }
    plugin?: { subgroup: boolean }
}

const EXACT_TITLE = 2
const IN_TITLE = 1
const ELSEWHERE = 0

function relevance(row: Row, tokens: string[]) {
    const titles = [row.title, row.doc?.fullTitle]
        .filter((title): title is string => Boolean(title))
        .map((title) => title.toLowerCase().trim().replace(/\s+/g, " "))
    if (!row.plugin?.subgroup && titles.includes(tokens.join(" "))) {
        return EXACT_TITLE
    }
    return titles.some((title) => includesAll(title, tokens))
        ? IN_TITLE
        : ELSEWHERE
}

// Each tab keeps its own order; at each relevance level the tabs take turns, so none buries another.
export function allResults(
    tabs: { kind: string; results: Row[] }[],
    query: string,
    limit = MAX_RESULTS,
) {
    const tokens = searchTokens(query)
    const levels = [EXACT_TITLE, IN_TITLE, ELSEWHERE].map((level) =>
        tabs.map(({ kind, results }) =>
            results
                .filter((row) => relevance(row, tokens) === level)
                .map((row) => ({
                    ...row,
                    ...(row.doc
                        ? { doc: { ...row.doc, groupStart: false } }
                        : {}),
                    kind,
                })),
        ),
    )
    const mixed = levels.flatMap((lists) => {
        const longest = Math.max(0, ...lists.map((list) => list.length))
        return Array.from({ length: longest }, (_, i) =>
            lists.flatMap((list) => list[i] ?? []),
        ).flat()
    })
    return mixed.slice(0, limit)
}
