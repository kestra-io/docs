import { $fetchApiCached } from "~/utils/fetch"
import { docVersions, type DocVersion } from "~/utils/versionedDocs"

// The version list only feeds the version selector and changes a few times a
// year, so it must not be fetched on every page render. Memoize it per worker
// isolate with a TTL — fetched once when warm, refreshed every 10 minutes so
// new releases appear on versioned-doc requests without a redeploy. Latest
// docs are prerendered, so their selector only picks up a new release on the
// next build regardless of this TTL. (Date.now() is available in both the
// Cloudflare runtime and the Node build.)
const VERSIONS_TTL_MS = 10 * 60 * 1000
// A failure (cold-start or otherwise) gets a much shorter TTL than a success:
// middleware.ts 404s any /docs/X.Y/* whose version isn't in this list, so
// caching a failure for the full 10 minutes would keep every versioned doc
// 404ing for that long after the API recovers.
const VERSIONS_FAILURE_TTL_MS = 60 * 1000
let versionsCache: { at: number; data: DocVersion[]; ok: boolean } | null = null

export interface DocVersionsResult {
    versions: DocVersion[]
    /** false when the last refresh attempt failed — `versions` is stale or empty. */
    ok: boolean
}

/** Version list plus fetch health, for callers whose response depends on it (the middleware's 404-vs-503 split). */
export async function getDocVersionsResult(): Promise<DocVersionsResult> {
    const now = Date.now()
    if (versionsCache) {
        const ttl = versionsCache.ok ? VERSIONS_TTL_MS : VERSIONS_FAILURE_TTL_MS
        if (now - versionsCache.at < ttl) {
            return { versions: versionsCache.data, ok: versionsCache.ok }
        }
    }
    try {
        const raw = await $fetchApiCached<{ version: string }[]>("/versions")
        versionsCache = { at: now, data: docVersions(raw), ok: true }
    } catch (error) {
        // Cache the failure too (even with no prior data) so a sustained
        // outage costs one fetch per short TTL window, not one per page rendered.
        console.error("Failed to fetch doc versions:", error)
        versionsCache = { at: now, data: versionsCache?.data ?? [], ok: false }
    }
    return { versions: versionsCache.data, ok: versionsCache.ok }
}

export async function getDocVersions(): Promise<DocVersion[]> {
    return (await getDocVersionsResult()).versions
}
