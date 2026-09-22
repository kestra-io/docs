import { $fetchApiCached } from "~/utils/fetch"

// Un-memoized: for per-request (prerender = false) pages, where the memo
// below freezes the count for the Worker isolate's lifetime.
export async function loadTotalBlueprintsCount(): Promise<string> {
    const { total } = await $fetchApiCached<{ total?: number }>(
        "/blueprints/versions/latest?size=1&page=1",
    )
    const rounded = Math.floor((total ?? 0) / 10) * 10
    // A 200 carrying a missing or nonsensical total is as wrong as a failed
    // request, so it takes the same fallback rather than shipping "0+ Blueprints".
    if (rounded <= 0) {
        throw new Error(
            `Blueprints count endpoint returned no usable total (got ${total})`,
        )
    }
    return `${rounded}`
}

// The blueprint equivalent of PLUGIN_COUNT_FLOOR: shown only once the request
// and both of internalFetch's retries have failed, and never "0+ Blueprints".
export const BLUEPRINT_COUNT_FLOOR = 690

let totalBlueprintsCountPromise: Promise<string> | undefined

// Build-time blueprint total, floored to the ten, without the trailing "+".
// Memoized so every page shares one request. A failure is not cached: it falls
// back to BLUEPRINT_COUNT_FLOOR for this caller and the next one tries again,
// so a blip cannot freeze the floor across a build, and cannot abort one either
// — the pages showing this number are prerendered.
export function fetchTotalBlueprintsCount(): Promise<string> {
    if (!totalBlueprintsCountPromise) {
        totalBlueprintsCountPromise = loadTotalBlueprintsCount().catch((e) => {
            totalBlueprintsCountPromise = undefined
            console.error(
                `Failed to fetch blueprints count, falling back to ${BLUEPRINT_COUNT_FLOOR}:`,
                e,
            )
            return `${BLUEPRINT_COUNT_FLOOR}`
        })
    }
    return totalBlueprintsCountPromise
}
