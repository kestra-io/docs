import { $fetchApiCached } from "~/utils/fetch"
import { docVersionLabels, versionMajorMinor } from "~/utils/versionedDocs"

// Memoized per worker isolate; changes only a few times a year so it must not be fetched per render.
const TTL_MS = 10 * 60 * 1000
// Shorter TTL on failure so a sustained outage retries sooner without hammering the API.
const FAILURE_TTL_MS = 60 * 1000

let latestCache: { at: number; data: string | undefined; ok: boolean } | null = null

/** MAJOR.MINOR of the current GA release (e.g. "1.3"), or undefined if unavailable/stale-empty. */
export async function getLatestDocVersion(): Promise<string | undefined> {
    const now = Date.now()
    if (latestCache) {
        const ttl = latestCache.ok ? TTL_MS : FAILURE_TTL_MS
        if (now - latestCache.at < ttl) {
            return latestCache.data
        }
    }
    try {
        const raw = await $fetchApiCached<{ version: string }>("/versions/latest")
        latestCache = { at: now, data: versionMajorMinor(raw.version), ok: true }
    } catch (error) {
        // Cache the failure too, so a sustained outage isn't refetched on every render.
        console.error("Failed to fetch latest doc version:", error)
        latestCache = { at: now, data: latestCache?.data, ok: false }
    }
    return latestCache.data
}

export interface KnownDocVersionsResult {
    versions: string[]
    /** false when the last refresh attempt failed — `versions` is stale or empty. */
    ok: boolean
}

let knownCache: { at: number; data: string[]; ok: boolean } | null = null

/** All routable MAJOR.MINOR labels (>= 1.0), plus fetch health for the middleware's 404-vs-503 split. */
export async function getKnownDocVersions(): Promise<KnownDocVersionsResult> {
    const now = Date.now()
    if (knownCache) {
        const ttl = knownCache.ok ? TTL_MS : FAILURE_TTL_MS
        if (now - knownCache.at < ttl) {
            return { versions: knownCache.data, ok: knownCache.ok }
        }
    }
    try {
        const raw = await $fetchApiCached<{ version: string }[]>("/versions")
        knownCache = { at: now, data: docVersionLabels(raw), ok: true }
    } catch (error) {
        console.error("Failed to fetch known doc versions:", error)
        knownCache = { at: now, data: knownCache?.data ?? [], ok: false }
    }
    return { versions: knownCache.data, ok: knownCache.ok }
}
