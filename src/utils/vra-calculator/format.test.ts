import { describe, expect, it } from "vitest"
import { GOLDEN } from "./__fixtures__/golden"
import {
    currencyFromLocale,
    currencySymbol,
    formatCount,
    formatMoney,
} from "./format"

describe("formatMoney", () => {
    it.each(GOLDEN.money.map((m) => [m.cur, m.n, m.s] as const))(
        "%s %s -> %s like the reference",
        (cur, n, expected) => {
            expect(formatMoney(n, cur)).toBe(expected)
        },
    )

    it.each([Infinity, -Infinity, NaN])("shows a dash for %s", (n) => {
        expect(formatMoney(n, "EUR")).toBe("—")
    })

    it("falls back to the code and a space for an invalid currency", () => {
        expect(currencySymbol("NOPE!")).toBe("NOPE! ")
    })
})

describe("formatCount", () => {
    it.each([
        [9574.8, "9,575"],
        [0, "0"],
        [1234567, "1,234,567"],
    ])("%s -> %s", (n, expected) => {
        expect(formatCount(n)).toBe(expected)
    })
})

describe("currencyFromLocale", () => {
    it.each([
        ["en-US", "USD"],
        ["en-us", "USD"],
        ["zh-Hant-US", "USD"],
        ["en-GB", "GBP"],
        ["en-UK", "GBP"],
        ["fr-FR", "EUR"],
        ["en-IN", "EUR"],
        ["en", "EUR"],
        [["en-GB", "en-US"], "GBP"],
        [["fr-FR", "en-US"], "EUR"],
        [undefined, "EUR"],
        [null, "EUR"],
        [[], "EUR"],
        ["", "EUR"],
        ["not a locale!", "EUR"],
    ])("%j -> %s", (locales, expected) => {
        expect(currencyFromLocale(locales)).toBe(expected)
    })
})
