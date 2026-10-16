import { describe, expect, it } from "vitest"
import { GOLDEN } from "./__fixtures__/golden"
import { allocate, breakEven } from "./payback"

describe("allocate", () => {
    it.each(GOLDEN.alloc.map((a) => [a.total, a.w, a.out] as const))(
        "splits %s across %j like the reference",
        (total, weights, expected) => {
            expect(allocate(total, [...weights])).toEqual(expected)
        },
    )

    it("always adds up to the total when weights are non-zero", () => {
        const out = allocate(17, [3, 5, 7])
        expect(out.reduce((a, b) => a + b, 0)).toBe(17)
    })
})

describe("breakEven", () => {
    const cash = {
        avoided: 1_500_000,
        renewInMonths: 12,
        migrationCost: 209_500,
    }

    it("is null when the horizon ends at or before the renewal", () => {
        expect(breakEven(1, cash)).toBeNull()
    })

    it("spreads the avoided renewal minus migration over the horizon", () => {
        expect(breakEven(3, cash)).toBeCloseTo((1_500_000 * 2 - 209_500) / 3)
    })

    it("is null when nothing is left for Kestra", () => {
        expect(
            breakEven(2, { ...cash, avoided: 100_000, migrationCost: 500_000 }),
        ).toBeNull()
    })
})
