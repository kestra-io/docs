export interface SearchResult {
    url: string
    type: string
    title: string
    highlights?: string[]
    highlightTitle?: string
}

/**
 * Prepare raw search API results for rendering.
 *
 * The index can contain entries without a title (e.g. a file indexed
 * without frontmatter); the UI reads title/url/type unconditionally, so
 * such entries are dropped rather than letting one of them break the
 * whole result list. The matched part of each title is wrapped in
 * <mark> for highlighting.
 */
export function prepareSearchResults(
    results: unknown,
    searchValue?: string,
): SearchResult[] {
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
