export interface SearchResult {
    url: string
    type: string
    title: string
    highlights?: string[]
    highlightTitle?: string
}

/** Promote concept pages without replacing the API's ranking for broader queries. */
function documentationPriority(result: SearchResult, searchTerm?: string): number {
    if (!searchTerm || result.type !== "DOCS") return 0

    const path = result.url.split(/[?#]/)[0].split("/").filter(Boolean)
    if (path[0] !== "docs") return 0

    const matchesTitle = result.title.trim().toLowerCase() === searchTerm
    const matchesPage = path.at(-1)?.toLowerCase() === searchTerm.replace(/\s+/g, "-")
    if (!matchesTitle && !matchesPage) return 0

    // Versioned docs use docs/{major.minor}/{section}/..., otherwise docs/{section}/... .
    const section = path[/^\d+\.\d+$/.test(path[1] ?? "") ? 2 : 1]
    return ["tutorial", "how-to-guides", "migration-guide"].includes(section) ? 1 : 2
}

/**
 * Prepare raw search API results for rendering.
 *
 * The index can contain entries without a title (e.g. a file indexed
 * without frontmatter); the UI reads title/url/type unconditionally, so
 * such entries are dropped rather than letting one of them break the
 * whole result list. Exact documentation title/page-name matches come first,
 * with reference pages ahead of guides and migrations. Stable sorting keeps
 * the API's relevance order within each priority. The matched part of each
 * title is wrapped in <mark> for highlighting.
 */
export function prepareSearchResults(results: unknown, searchValue?: string): SearchResult[] {
    if (!Array.isArray(results)) {
        return []
    }

    const searchTerm = searchValue?.trim()?.toLowerCase()

    return results
        .filter(
            (result): result is SearchResult =>
                typeof result?.title === "string" &&
                typeof result?.url === "string" &&
                typeof result?.type === "string",
        )
        .sort((a, b) => documentationPriority(b, searchTerm) - documentationPriority(a, searchTerm))
        .map((result) => {
            if (searchTerm) {
                const index = result.title.toLowerCase().indexOf(searchTerm)
                if (index !== -1) {
                    result.highlightTitle = `${result.title.slice(0, index)}<mark>${result.title.slice(index, index + searchTerm.length)}</mark>${result.title.slice(index + searchTerm.length)}`
                }
            }
            return result
        })
}