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
    put(key: string, value: string): Promise<void>
}

export const GITHUB_STATS_KEY = "github:kestra-io/kestra"
export const FRESH_MS = 2 * 60 * 60 * 1000
// After a failed refresh, wait this long before hitting GitHub again.
export const RETRY_MS = 10 * 60 * 1000

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
    if (isEmpty(stats)) return undefined

    const failed = isEmpty(keepNonZero(fresh))
    const fetchedAt = failed && stored ? now - FRESH_MS + RETRY_MS : now
    await kv
        ?.put(GITHUB_STATS_KEY, JSON.stringify({ stats, fetchedAt }))
        .catch((error) => console.error("GitHub stats KV write failed:", error))
    return stats
}

// Serves the KV copy, refreshing it in the background once it is 2h old.
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

    inflight ??= refresh({ kv, fetchStats, now }, stored).finally(() => {
        inflight = undefined
    })
    if (stored) {
        waitUntil(inflight)
        return stored.stats
    }
    return inflight
}
