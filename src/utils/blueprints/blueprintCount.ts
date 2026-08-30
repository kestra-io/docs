import { $fetchApiCached } from "~/utils/fetch"

async function loadTotalBlueprintsCount(): Promise<string> {
    const { total = 0 } = await $fetchApiCached<{ total: number }>(
        "/blueprints/versions/latest?size=1&page=1",
    )
    const rounded = Math.floor(total / 10) * 10
    return `${rounded}`
}

let totalBlueprintsCountPromise: Promise<string> | undefined

// Memoized at module level: every page that renders this count shares one
// request, keeping them all on the same value within a build. A failure is not
// cached (the next caller retries) and propagates instead of degrading to "0",
// so a build fails loudly rather than shipping "0+ blueprints" in copy.
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
