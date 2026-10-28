import { describe, expect, it } from "vitest"
import {
    hourlySeed,
    orderContributors,
    rankContributors,
    SHUFFLE_POOL,
    shuffleWithSeed,
} from "~/components/community/contributors"

const contributor = (name: string, count?: number) => ({
    name,
    avatar: `https://avatars.githubusercontent.com/${name}`,
    count: count as number,
})

const many = (size: number) =>
    Array.from({ length: size }, (_, i) =>
        contributor(`user-${String(i).padStart(4, "0")}`, size - i),
    )

describe("rankContributors", () => {
    it("sorts by contribution count, highest first, then by name", () => {
        const ranked = rankContributors([
            contributor("low", 3),
            contributor("beta", 12),
            contributor("high", 30),
            contributor("alpha", 12),
        ])
        expect(ranked.map((c) => c.name)).toEqual([
            "high",
            "alpha",
            "beta",
            "low",
        ])
    })

    it("hides automation accounts", () => {
        const ranked = rankContributors([
            contributor("human", 5),
            contributor("dependabot[bot]", 500),
            contributor("actions-user", 400),
            contributor("robot-fan", 2),
        ])
        expect(ranked.map((c) => c.name)).toEqual(["human", "robot-fan"])
    })

    it("treats a missing count as zero and leaves the input untouched", () => {
        const input = [contributor("unknown"), contributor("one", 1)]
        const ranked = rankContributors(input)
        expect(ranked.map((c) => c.name)).toEqual(["one", "unknown"])
        expect(input.map((c) => c.name)).toEqual(["unknown", "one"])
    })
})

describe("shuffleWithSeed", () => {
    it("is a permutation that depends only on the seed", () => {
        const items = many(50).map((c) => c.name)
        const a = shuffleWithSeed(items, 42)
        expect(a).toEqual(shuffleWithSeed(items, 42))
        expect(a).not.toEqual(items)
        expect(a).not.toEqual(shuffleWithSeed(items, 43))
        expect([...a].sort()).toEqual([...items].sort())
    })
})

describe("orderContributors", () => {
    const list = many(SHUFFLE_POOL + 50)

    it("returns the plain ranking without a seed", () => {
        expect(orderContributors(list)).toEqual(rankContributors(list))
    })

    it("shuffles only the top pool and keeps the rest in count order", () => {
        const ordered = orderContributors(list, 7)
        const ranked = rankContributors(list)
        const pool = (c: { name: string }[]) =>
            c
                .slice(0, SHUFFLE_POOL)
                .map((x) => x.name)
                .sort()

        expect(ordered).toHaveLength(ranked.length)
        expect(new Set(ordered.map((c) => c.name)).size).toBe(ranked.length)
        expect(pool(ordered)).toEqual(pool(ranked))
        expect(ordered.slice(SHUFFLE_POOL)).toEqual(ranked.slice(SHUFFLE_POOL))
        expect(ordered.slice(0, SHUFFLE_POOL)).not.toEqual(
            ranked.slice(0, SHUFFLE_POOL),
        )
    })

    it("lets the browser continue the server's order from the seed alone", () => {
        const server = orderContributors(list, 99).slice(0, 27)
        const browser = orderContributors([...list].reverse(), 99)
        expect(browser.slice(0, 27)).toEqual(server)
    })
})

describe("hourlySeed", () => {
    it("changes once an hour", () => {
        const t = Date.UTC(2026, 9, 28, 10, 30)
        expect(hourlySeed(t)).toBe(hourlySeed(t + 29 * 60_000))
        expect(hourlySeed(t)).not.toBe(hourlySeed(t + 31 * 60_000))
    })
})
