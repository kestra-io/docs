import { $fetchApiCached } from "~/utils/fetch"
import { apiDocPath, type DocSection } from "~/utils/versionedDocs"

// That version's own curated sidebar grouping, published per release by the
// docs indexer. Same caching shape as docChildrenFetch: it changes only when a
// release is cut, so it must not be fetched per page render.
const SECTIONS_TTL_MS = 10 * 60 * 1000
// Versions indexed before the indexer started publishing this file have none,
// and the API answers a missing asset with an error rather than a 404, so a
// short negative cache keeps that from costing a fetch per request.
const SECTIONS_FAILURE_TTL_MS = 60 * 1000
const sectionsCache = new Map<
    string,
    { at: number; data: DocSection[] | undefined; ok: boolean }
>()

export async function getDocSections(
    version: string,
): Promise<DocSection[] | undefined> {
    const now = Date.now()
    const cached = sectionsCache.get(version)
    if (cached && now - cached.at < (cached.ok ? SECTIONS_TTL_MS : SECTIONS_FAILURE_TTL_MS)) {
        return cached.data
    }
    try {
        const data = await $fetchApiCached<DocSection[]>(
            apiDocPath(version, "_sections.json"),
        )
        // A version whose extraction failed upstream must fall back rather than
        // render an empty sidebar.
        const sections = Array.isArray(data) && data.length ? data : undefined
        sectionsCache.set(version, { at: now, data: sections, ok: true })
        return sections
    } catch (error) {
        console.error(`Failed to fetch doc sections for version ${version}:`, error)
        sectionsCache.set(version, { at: now, data: cached?.data, ok: false })
        return cached?.data
    }
}
