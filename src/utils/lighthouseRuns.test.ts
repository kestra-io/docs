import { describe, expect, it } from "vitest"
import { PAGES } from "../../tests/fixtures/page-sample.mjs"
import {
    DEFAULT_RUNS,
    runsFor,
    shardPages,
} from "../../scripts/lighthouse-shared.mjs"

// Literals rather than a helper: runsFor is typed as one of the sample's own
// object shapes, and an optional `runs` matches none of them.
const plain = { path: "/x", label: "x" }
const counted = (runs: number) => ({ path: "/x", label: "x", runs })

describe("runsFor", () => {
    it("measures a page without a count DEFAULT_RUNS times", () => {
        expect(runsFor(plain)).toBe(DEFAULT_RUNS)
        expect(DEFAULT_RUNS).toBeGreaterThan(1)
    })

    it("keeps an explicit count that differs from the default", () => {
        expect(runsFor(counted(5))).toBe(5)
    })

    // A page can still opt out of the median, which is what runs: 1 means.
    it("honours an explicit opt-out", () => {
        expect(runsFor(counted(1))).toBe(1)
        expect(runsFor(counted(0))).toBe(1)
    })

    it("lets MULTI_RUN_COUNT override every page, defaults included", () => {
        expect(runsFor(plain, 2)).toBe(2)
        expect(runsFor(counted(5), 2)).toBe(2)
    })

    it("leaves no sampled page on a single unaveraged run", () => {
        expect(PAGES.filter((p) => runsFor(p) === 1)).toEqual([])
    })
})

describe("shardPages", () => {
    it("assigns every page exactly once", () => {
        const paths = shardPages(4)
            .flat()
            .map((p) => p.path)
        expect(paths.sort()).toEqual(PAGES.map((p) => p.path).sort())
    })

    it("balances shards by measuring cost, not page count", () => {
        const loads = shardPages(4).map((shard) =>
            shard.reduce((sum, p) => sum + runsFor(p), 0),
        )
        const total = PAGES.reduce((sum, p) => sum + runsFor(p), 0)
        expect(Math.max(...loads) - Math.min(...loads)).toBeLessThanOrEqual(
            Math.max(...PAGES.map((p) => runsFor(p))),
        )
        expect(loads.reduce((a, b) => a + b, 0)).toBe(total)
    })
})
