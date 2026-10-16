import { describe, expect, it } from "vitest"
import { GOLDEN } from "./__fixtures__/golden"
import { formatCount, formatMoney } from "./format"

describe("formatMoney matches the reference", () => {
    it.each(GOLDEN.money.map((m) => [m.cur, m.n, m.s] as const))(
        "%s %s -> %s",
        (cur, n, expected) => {
            expect(formatMoney(n, cur)).toBe(expected)
        },
    )
})

describe("formatCount", () => {
    it("rounds and groups like the reference", () => {
        expect(formatCount(9574.8)).toBe("9,575")
        expect(formatCount(0)).toBe("0")
        expect(formatCount(1234567)).toBe("1,234,567")
    })
})
