import { $fetchApiCached } from "~/utils/fetch"

// Un-memoized: for per-request (prerender = false) pages, where the memo
// below freezes the count for the Worker isolate's lifetime.
export async function loadTotalBlueprintsCount(): Promise<string> {
    const { total } = await $fetchApiCached<{ total?: number }>(
        "/blueprints/versions/latest?size=1&page=1",
    )
    const rounded = Math.floor((total ?? 0) / 10) * 10
    // A 200 carrying a missing or nonsensical total is as wrong as a failed
    // request, so it fails the same way rather than shipping "0+ Blueprints".
    if (rounded <= 0) {
        throw new Error(
            `Blueprints count endpoint returned no usable total (got ${total})`,
        )
    }
    return `${rounded}`
}

let totalBlueprintsCountPromise: Promise<string> | undefined

// Build-time blueprint total, floored to the ten, without the trailing "+".
// Memoized so every page shares one request; a failure is not cached and
// propagates rather than degrading to "0", so a build fails loudly instead.
export function fetchTotalBlueprintsCount(): Promise<string> {
    if (!totalBlueprintsCountPromise) {
        totalBlueprintsCountPromise = loadTotalBlueprintsCount().catch((e) => {
            totalBlueprintsCountPromise = undefined
            console.error("Failed to fetch blueprints count:", e)
            throw e
        })
    }
    return totalBlueprintsCountPromise
}
