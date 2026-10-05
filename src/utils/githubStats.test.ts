import { beforeEach, describe, expect, it, vi } from "vitest"
import {
    FRESH_MS,
    GITHUB_STATS_KEY,
    RETRY_MS,
    getGithubStats,
    keepNonZero,
    type GithubStats,
} from "./githubStats"

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

beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {})
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

    it("returns nothing and writes nothing when there is no data at all", async () => {
        const kv = fakeKv()

        const result = await getGithubStats({
            kv: kv,
            fetchStats: async () => stats(0),
            waitUntil: vi.fn(),
            now: NOW,
        })

        expect(result).toBeUndefined()
        expect(kv.put).not.toHaveBeenCalled()
    })
})
