import { $fetchApiCached } from "./fetch"

// In-process cache for Slack members count
// Caches the promise to deduplicate concurrent requests during build
let cachedPromise: Promise<number> | null = null
let cachedValue: number = 0
let cacheTimestamp: number = 0
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

export async function fetchSlackMembers(): Promise<number> {
    const now = Date.now()

    // Return cached value if still valid (including cached failures)
    if (cacheTimestamp > 0 && now - cacheTimestamp < CACHE_DURATION) {
        return cachedValue
    }

    // If a request is already in flight, return the same promise
    // This prevents multiple concurrent requests during build
    if (cachedPromise) {
        return cachedPromise
    }

    // Create and cache the promise
    cachedPromise = (async () => {
        try {
            const result = await $fetchApiCached<{ total: number }>(
                "/communities/slack",
                CACHE_DURATION,
            )
            cachedValue = result.total
        } catch (e) {
            console.warn("Failed to fetch slack members count", e)
            // Keep previous cachedValue (or 0 if never set)
        } finally {
            // Always update timestamp to prevent retry storms on failure
            cacheTimestamp = Date.now()
            // Clear the promise so future calls after cache expires can retry
            cachedPromise = null
        }
        return cachedValue
    })()

    return cachedPromise
}