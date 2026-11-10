export type GithubStats = {
    stargazers: number
    watchers: number
    issues: number
    forks: number
    network: number
    subscribers: number
    size: number
    contributors: number
}

type StoredStats = { stats: GithubStats; fetchedAt: number }

// The slice of a Workers KV binding used here, so tests can pass a Map.
type StatsKv = {
    get(key: string, type: "json"): Promise<unknown>
    put(
        key: string,
        value: string,
        options?: { expirationTtl?: number },
    ): Promise<void>
}

export const GITHUB_STATS_KEY = "github:kestra-io/kestra"
export const FRESH_MS = 10 * 60 * 1000
// After a failed refresh, wait this long before hitting GitHub again.
export const RETRY_MS = 10 * 60 * 1000
// With nothing cached, a failed fill blocks retries this long (KV's minimum TTL).
export const COLD_RETRY_MS = 60 * 1000
export const GITHUB_FAILURE_KEY = `${GITHUB_STATS_KEY}:failed`

const FIELDS = [
    "stargazers",
    "watchers",
    "issues",
    "forks",
    "network",
    "subscribers",
    "size",
    "contributors",
] as const satisfies readonly (keyof GithubStats)[]

// GitHub never legitimately reports 0 for these, so a 0 is an upstream failure.
export function keepNonZero(
    next: Partial<GithubStats>,
    previous?: GithubStats,
): GithubStats {
    return Object.fromEntries(
        FIELDS.map((field) => [field, next[field] || previous?.[field] || 0]),
    ) as GithubStats
}

const isEmpty = (stats: GithubStats) => FIELDS.every((field) => !stats[field])

type Options = {
    kv: StatsKv | undefined
    fetchStats: () => Promise<Partial<GithubStats>>
    waitUntil: (promise: Promise<unknown>) => void
    now?: number
}

// Dedupes refreshes within an isolate; KV writes take up to 60s to propagate.
let inflight: Promise<GithubStats | undefined> | undefined
let lastFailureAt = -Infinity

async function refresh(
    { kv, fetchStats, now }: Required<Omit<Options, "waitUntil">>,
    stored: StoredStats | null,
): Promise<GithubStats | undefined> {
    let fresh: Partial<GithubStats> = {}
    try {
        fresh = await fetchStats()
    } catch (error) {
        console.error("GitHub stats refresh failed:", error)
    }

    const stats = keepNonZero(fresh, stored?.stats)
    if (isEmpty(stats)) {
        lastFailureAt = now
        await kv
            ?.put(GITHUB_FAILURE_KEY, "1", {
                expirationTtl: COLD_RETRY_MS / 1000,
            })
            .catch(() => {})
        return undefined
    }

    const failed = isEmpty(keepNonZero(fresh))
    const fetchedAt = failed && stored ? now - FRESH_MS + RETRY_MS : now
    await kv
        ?.put(GITHUB_STATS_KEY, JSON.stringify({ stats, fetchedAt }))
        .catch((error) => console.error("GitHub stats KV write failed:", error))
    return stats
}

// The isolate check covers a missing KV; the KV marker covers other isolates.
async function coolingDown(kv: StatsKv | undefined, now: number) {
    if (now - lastFailureAt < COLD_RETRY_MS) return true
    return !!(await kv?.get(GITHUB_FAILURE_KEY, "json").catch(() => null))
}

// Serves the KV copy, refreshing it in the background once it is 10 min old.
export async function getGithubStats({
    kv,
    fetchStats,
    waitUntil,
    now = Date.now(),
}: Options): Promise<GithubStats | undefined> {
    const stored = (await kv
        ?.get(GITHUB_STATS_KEY, "json")
        .catch(() => null)) as StoredStats | null

    if (stored && now - stored.fetchedAt < FRESH_MS) return stored.stats
    if (!stored && (await coolingDown(kv, now))) return undefined

    inflight ??= refresh({ kv, fetchStats, now }, stored).finally(() => {
        inflight = undefined
    })
    if (stored) {
        waitUntil(inflight)
        return stored.stats
    }
    return inflight
}
