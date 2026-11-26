type ServerResult = { url: string; type: string }

export const fullTextUrls = (results: ServerResult[], type: string) =>
    results.filter((result) => result.type === type).map((result) => result.url)

export function withFullTextMatches<T extends { id: string }>(
    matches: T[],
    all: T[],
    urls: string[],
    prefix: string,
): T[] {
    const found = new Set(matches.map((entry) => entry.id))
    const byId = new Map(all.map((entry) => [entry.id, entry]))
    const extra = urls
        .map((url) => byId.get(url.replace(prefix, "")))
        .filter(
            (entry): entry is T => entry !== undefined && !found.has(entry.id),
        )
    return [...matches, ...new Set(extra)]
}
