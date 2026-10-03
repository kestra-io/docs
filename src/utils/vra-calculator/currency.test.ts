import { describe, expect, it } from "vitest"
import {
    CURRENCIES,
    currencyFromLocale,
    currencySymbol,
    isCurrency,
} from "./currency"

describe("currencyFromLocale", () => {
    it.each([
        ["en-US", "USD"],
        ["es-US", "USD"],
        ["en-us", "USD"],
        ["en-GB", "GBP"],
        ["cy-GB", "GBP"],
        ["en-UK", "GBP"],
        ["fr-FR", "EUR"],
        ["de-DE", "EUR"],
        ["en-IE", "EUR"],
        ["en-IN", "EUR"],
        ["en-CA", "EUR"],
        ["en", "EUR"],
        ["de", "EUR"],
        ["zh-Hant-US", "USD"],
    ])("%s -> %s", (locale, expected) => {
        expect(currencyFromLocale(locale)).toBe(expected)
    })

    it("uses only the first preferred locale", () => {
        expect(currencyFromLocale(["en-GB", "en-US"])).toBe("GBP")
        expect(currencyFromLocale(["fr-FR", "en-US"])).toBe("EUR")
    })

    it("falls back to EUR for missing or malformed locales", () => {
        expect(currencyFromLocale(undefined)).toBe("EUR")
        expect(currencyFromLocale(null)).toBe("EUR")
        expect(currencyFromLocale([])).toBe("EUR")
        expect(currencyFromLocale("")).toBe("EUR")
        expect(currencyFromLocale("not a locale!")).toBe("EUR")
    })
})

describe("currencySymbol", () => {
    it("returns the reference symbols", () => {
        expect(currencySymbol("EUR")).toBe("€")
        expect(currencySymbol("USD")).toBe("$")
        expect(currencySymbol("GBP")).toBe("£")
    })

    it("falls back to the code and a space for an invalid code", () => {
        expect(currencySymbol("NOPE!")).toBe("NOPE! ")
    })
})

describe("isCurrency", () => {
    it("accepts only the offered currencies", () => {
        expect(CURRENCIES).toEqual(["EUR", "USD", "GBP"])
        expect(isCurrency("GBP")).toBe(true)
        expect(isCurrency("JPY")).toBe(false)
        expect(isCurrency(undefined)).toBe(false)
    })
})
