type ServerResult = { url: string; type: string; highlights?: string[] }

export type FullTextMatch = { url: string; highlights?: string[] }

export type SnippetPart = { text: string; mark: boolean }

export const fullTextMatches = (
    results: ServerResult[],
    type: string,
): FullTextMatch[] =>
    results
        .filter((result) => result.type === type)
        .map(({ url, highlights }) => ({ url, highlights }))

const OPEN = "\u0001"
const CLOSE = "\u0002"

const plainText = (text: string) =>
    text
        .replaceAll("<mark>", OPEN)
        .replaceAll("</mark>", CLOSE)
        .replace(/<[^>]*>/g, " ")
        .replace(/:::\w*(\{[^}]*\})?/g, " ")
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\S*\.(png|jpe?g|svg|gif|webp)\)?/gi, " ")
        .replace(/[`*#|<>]/g, "")
        .replace(/\s+/g, " ")
        .trim()

export function snippetParts(highlight: string): SnippetPart[] {
    return plainText(highlight)
        .split(new RegExp(`${OPEN}(.*?)${CLOSE}`, "g"))
        .map((text, i) => ({
            text: text.replaceAll(OPEN, "").replaceAll(CLOSE, ""),
            mark: i % 2 === 1,
        }))
        .filter((part) => part.text !== "")
}

export function fullTextSnippets(matches: FullTextMatch[], prefix: string) {
    const snippets = new Map<string, SnippetPart[]>()
    for (const { url, highlights = [] } of matches) {
        const highlight = highlights.find((text) => text.includes("<mark>"))
        const id = url.replace(prefix, "")
        if (highlight && !snippets.has(id)) {
            snippets.set(id, snippetParts(highlight))
        }
    }
    return snippets
}

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
