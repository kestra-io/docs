import { $fetchApiCached } from "~/utils/fetch"
import { apiDocPath, type DocChildren } from "~/utils/versionedDocs"

// The doc navigation tree (the sidebar) is the same for every page of a given
// version and changes only when a release is cut, so it must not be fetched on
// every page render. Only versioned pages call this (they're SSR, never
// prerendered) — memoized per version per worker isolate with a TTL, fetched
// once when warm, refreshed every 10 minutes. (Date.now() is available in
// both the Cloudflare runtime and the Node build.)
const CHILDREN_TTL_MS = 10 * 60 * 1000
// Failures negative-cache on a much shorter TTL (mirrors docVersionsFetch):
// long enough that an outage costs one fetch per window instead of one per
// request, short enough that sidebar-less pages recover soon after the API.
const CHILDREN_FAILURE_TTL_MS = 60 * 1000
const childrenCache = new Map<string, { at: number; data: DocChildren; ok: boolean }>()

export async function getDocChildren(version: string): Promise<DocChildren> {
    const now = Date.now()
    const cached = childrenCache.get(version)
    if (cached && now - cached.at < (cached.ok ? CHILDREN_TTL_MS : CHILDREN_FAILURE_TTL_MS)) {
        return cached.data
    }
    try {
        // The children endpoint hangs off the version home doc path.
        const data = await $fetchApiCached<DocChildren>(
            `${apiDocPath(version, "")}/children`,
        )
        childrenCache.set(version, { at: now, data, ok: true })
        return data
    } catch (error) {
        // Keep stale data if we have it; otherwise the page renders sidebar-less.
        console.error(`Failed to fetch doc children for version ${version}:`, error)
        childrenCache.set(version, { at: now, data: cached?.data ?? {}, ok: false })
        return cached?.data ?? {}
    }
}
