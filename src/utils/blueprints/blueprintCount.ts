import { $fetchApiCachedWithRetry } from "~/utils/fetch"

async function loadTotalBlueprintsCount(): Promise<string> {
    const { total = 0 } = await $fetchApiCachedWithRetry<{ total: number }>(
        "/blueprints/versions/latest?size=1&page=1",
    )
    const rounded = Math.floor(total / 10) * 10
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
