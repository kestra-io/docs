import { $fetchApiCached } from "~/utils/fetch"

const FETCH_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 500

// Retries transient fetch failures (with a short growing backoff) before
// giving up, mirroring ~/utils/plugins/pluginCount: a single network blip
// should not fail the whole build.
async function fetchWithRetry<T>(url: string): Promise<T> {
    let lastError: unknown
    for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt++) {
        try {
            return await $fetchApiCached<T>(url)
        } catch (e) {
            lastError = e
            if (attempt < FETCH_ATTEMPTS) {
                await new Promise((resolve) =>
                    setTimeout(resolve, RETRY_BASE_DELAY_MS * attempt),
                )
            }
        }
    }
    throw lastError
}

async function loadTotalBlueprintsCount(): Promise<string> {
    const { total = 0 } = await fetchWithRetry<{ total: number }>(
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
