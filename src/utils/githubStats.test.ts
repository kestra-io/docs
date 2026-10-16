import { beforeEach, describe, expect, it, vi } from "vitest"
import {
    COLD_RETRY_MS,
    FRESH_MS,
    GITHUB_FAILURE_KEY,
    GITHUB_STATS_KEY,
    RETRY_MS,
    keepNonZero,
    type GithubStats,
} from "./githubStats"

// Fresh module per test: the failure cooldown is module-level state.
let getGithubStats: typeof import("./githubStats").getGithubStats

const stats = (value: number): GithubStats => ({
    stargazers: value,
    watchers: value,
    issues: value,
    forks: value,
    network: value,
    subscribers: value,
    size: value,
    contributors: value,
})

function fakeKv(initial?: { stats: GithubStats; fetchedAt: number }) {
    const store = new Map<string, string>()
    if (initial) store.set(GITHUB_STATS_KEY, JSON.stringify(initial))
    return {
        store,
        get: vi.fn(async (key: string) => {
            const value = store.get(key)
            return value ? JSON.parse(value) : null
        }),
        put: vi.fn(async (key: string, value: string) => {
            store.set(key, value)
        }),
    }
}

const NOW = 1_000_000_000_000

beforeEach(async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    vi.resetModules()
    ;({ getGithubStats } = await import("./githubStats"))
})

describe("keepNonZero", () => {
    it("replaces zero or missing fields with the previous value", () => {
        expect(keepNonZero({ stargazers: 0, forks: 9 }, stats(5))).toEqual({
            ...stats(5),
            forks: 9,
        })
    })
})

describe("getGithubStats", () => {
    it("serves a fresh KV copy without calling GitHub", async () => {
        const kv = fakeKv({ stats: stats(5), fetchedAt: NOW - FRESH_MS + 1 })
        const fetchStats = vi.fn()

        const result = await getGithubStats({
            kv: kv,
            fetchStats,
            waitUntil: vi.fn(),
            now: NOW,
        })

        expect(result).toEqual(stats(5))
        expect(fetchStats).not.toHaveBeenCalled()
    })

    it("serves a stale copy and refreshes it in the background", async () => {
        const kv = fakeKv({ stats: stats(5), fetchedAt: NOW - FRESH_MS })
        const waitUntil = vi.fn()

        const result = await getGithubStats({
            kv: kv,
            fetchStats: async () => stats(7),
            waitUntil,
            now: NOW,
        })
        await waitUntil.mock.calls[0][0]

        expect(result).toEqual(stats(5))
        expect(JSON.parse(kv.store.get(GITHUB_STATS_KEY)!)).toEqual({
            stats: stats(7),
            fetchedAt: NOW,
        })
    })

    it("keeps the previous non-zero values when GitHub returns zeros", async () => {
        const kv = fakeKv({ stats: stats(5), fetchedAt: 0 })
        const waitUntil = vi.fn()

        await getGithubStats({
            kv: kv,
            fetchStats: async () => ({ ...stats(0), forks: 9 }),
            waitUntil,
            now: NOW,
        })
        await waitUntil.mock.calls[0][0]

        expect(JSON.parse(kv.store.get(GITHUB_STATS_KEY)!).stats).toEqual({
            ...stats(5),
            forks: 9,
        })
    })

    it("backs off for RETRY_MS when the refresh fails", async () => {
        const kv = fakeKv({ stats: stats(5), fetchedAt: 0 })
        const waitUntil = vi.fn()

        await getGithubStats({
            kv: kv,
            fetchStats: async () => {
                throw new Error("GitHub 403")
            },
            waitUntil,
            now: NOW,
        })
        await waitUntil.mock.calls[0][0]

        expect(JSON.parse(kv.store.get(GITHUB_STATS_KEY)!)).toEqual({
            stats: stats(5),
            fetchedAt: NOW - FRESH_MS + RETRY_MS,
        })
    })

    it("fetches inline on an empty cache", async () => {
        const kv = fakeKv()

        const result = await getGithubStats({
            kv: kv,
            fetchStats: async () => stats(3),
            waitUntil: vi.fn(),
            now: NOW,
        })

        expect(result).toEqual(stats(3))
        expect(kv.put).toHaveBeenCalledOnce()
    })

    it("returns nothing and writes no stats when there is no data at all", async () => {
        const kv = fakeKv()

        const result = await getGithubStats({
            kv: kv,
            fetchStats: async () => stats(0),
            waitUntil: vi.fn(),
            now: NOW,
        })

        expect(result).toBeUndefined()
        expect(kv.store.has(GITHUB_STATS_KEY)).toBe(false)
    })

    it("does not retry an empty cache within COLD_RETRY_MS of a failure", async () => {
        const kv = fakeKv()
        const fetchStats = vi.fn(async () => {
            throw new Error("GitHub 403")
        })
        const call = (now: number) =>
            getGithubStats({ kv, fetchStats, waitUntil: vi.fn(), now })

        expect(await call(NOW)).toBeUndefined()
        expect(await call(NOW + COLD_RETRY_MS - 1)).toBeUndefined()
        expect(fetchStats).toHaveBeenCalledOnce()
        expect(kv.put).toHaveBeenCalledWith(GITHUB_FAILURE_KEY, "1", {
            expirationTtl: COLD_RETRY_MS / 1000,
        })

        kv.store.delete(GITHUB_FAILURE_KEY)
        await call(NOW + COLD_RETRY_MS)
        expect(fetchStats).toHaveBeenCalledTimes(2)
    })

    it("honours a failure marker written by another isolate", async () => {
        const kv = fakeKv()
        kv.store.set(GITHUB_FAILURE_KEY, "1")
        const fetchStats = vi.fn(async () => stats(3))

        const result = await getGithubStats({
            kv,
            fetchStats,
            waitUntil: vi.fn(),
            now: NOW,
        })

        expect(result).toBeUndefined()
        expect(fetchStats).not.toHaveBeenCalled()
    })
})
