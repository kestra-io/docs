import type { SearchResult } from "~/utils/searchResults"

export const ALL_SECTION_SIZE = 3

type Row = SearchResult & { doc?: { groupStart: boolean } }

export function allSections(
    sections: { type: string; label: string; results: Row[] }[],
) {
    return sections.flatMap(({ type, label, results }) =>
        results.slice(0, ALL_SECTION_SIZE).map((result, i) => ({
            ...result,
            ...(result.doc
                ? { doc: { ...result.doc, groupStart: false } }
                : {}),
            section: i === 0 ? { type, label } : undefined,
        })),
    )
}
