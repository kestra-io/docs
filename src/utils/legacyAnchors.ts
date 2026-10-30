/**
 * Where an anchor that moved off the current page now lives, or null.
 *
 * `hash` is `location.hash`. Released Kestra versions link to
 * `/docs/configuration#encryption?utm_source=...`, with the query inside the
 * hash, so the id stops at the first "?" and that query is moved in front of
 * the target's own "#". `exists` says whether the id is still on the page, in
 * which case nothing moved.
 */
export function legacyAnchorTarget(
    hash: string,
    anchors: Record<string, string>,
    exists: (id: string) => boolean,
): string | null {
    const [rawId, query = ""] = hash.replace(/^#/, "").split(/\?(.*)/s)
    let id = rawId
    try {
        id = decodeURIComponent(rawId)
    } catch {
        // malformed escape, keep the raw id
    }
    if (!id || !Object.hasOwn(anchors, id) || exists(id)) return null

    const target = anchors[id]
    if (!query) return target

    const [path, targetHash = ""] = target.split("#")
    return `${path}?${query}${targetHash ? `#${targetHash}` : ""}`
}
