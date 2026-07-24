import { $fetchApiCached } from "~/utils/fetch"
import { apiDocPath, type DocChildren } from "~/utils/versionedDocs"

// The doc navigation tree (the sidebar) is the same for every page of a given
// version and changes only when a release is cut, so it must not be fetched on
// every page render. Memoize it per version per worker isolate (and once per
// static build) with a TTL — fetched once when warm, refreshed every 10 minutes.
// (Date.now() is available in both the Cloudflare runtime and the Node build.)
const CHILDREN_TTL_MS = 10 * 60 * 1000
const childrenCache = new Map<string, { at: number; data: DocChildren }>()

export async function getDocChildren(version: string): Promise<DocChildren> {
    const now = Date.now()
    const cached = childrenCache.get(version)
    if (cached && now - cached.at < CHILDREN_TTL_MS) {
        return cached.data
    }
    try {
        // The children endpoint hangs off the version home doc path.
        const data = await $fetchApiCached<DocChildren>(
            `${apiDocPath(version, "")}/children`,
        )
        childrenCache.set(version, { at: now, data })
        return data
    } catch {
        // Keep stale data if we have it; otherwise the page renders sidebar-less.
        return cached?.data ?? {}
    }
}
