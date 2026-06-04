import { $fetchApiCached } from "~/utils/fetch"
import { docVersions, type DocVersion } from "~/utils/versionedDocs"

// The version list only feeds the version selector and changes a few times a
// year, so it must not be fetched on every page render. Memoize it per worker
// isolate (and once per static build) with a TTL — fetched once when warm,
// refreshed every 10 minutes so new releases still appear. (Date.now() is
// available in both the Cloudflare runtime and the Node build.)
const VERSIONS_TTL_MS = 10 * 60 * 1000
let versionsCache: { at: number; data: DocVersion[] } | null = null

export async function getDocVersions(): Promise<DocVersion[]> {
    const now = Date.now()
    if (versionsCache && now - versionsCache.at < VERSIONS_TTL_MS) {
        return versionsCache.data
    }
    try {
        const raw = await $fetchApiCached<{ version: string }[]>("/versions")
        versionsCache = { at: now, data: docVersions(raw) }
    } catch {
        // Keep stale data if we have it; otherwise the selector shows Latest only.
        return versionsCache?.data ?? []
    }
    return versionsCache.data
}
