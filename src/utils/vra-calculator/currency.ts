import type { Currency } from "./types"

export const CURRENCIES: readonly Currency[] = Object.freeze([
    "EUR",
    "USD",
    "GBP",
])

export function isCurrency(value: unknown): value is Currency {
    return (
        typeof value === "string" &&
        (CURRENCIES as readonly string[]).includes(value)
    )
}

function regionOf(tag: string): string | undefined {
    try {
        return new Intl.Locale(tag).region?.toUpperCase()
    } catch {
        return undefined
    }
}

/**
 * The product rule: USD for the US, GBP for the UK, EUR otherwise. Decided on
 * the region of the first locale only (e.g. "en-US", "es-US" -> USD;
 * "en-GB" -> GBP; "en", "fr-FR", "de" -> EUR). A tag without a region is not
 * guessed ("en" stays EUR). Pass the visitor's preferred locale(s); the
 * caller reads them from the browser.
 */
export function currencyFromLocale(
    locales: string | readonly string[] | null | undefined,
): Currency {
    const first = typeof locales === "string" ? locales : locales?.[0]
    if (!first) return "EUR"
    const region = regionOf(first)
    if (region === "US") return "USD"
    // "UK" is not an ISO region code, but some systems report it.
    if (region === "GB" || region === "UK") return "GBP"
    return "EUR"
}

export function currencySymbol(currency: string): string {
    try {
        const part = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency,
        })
            .formatToParts(0)
            .find((p) => p.type === "currency")
        if (part) return part.value
    } catch {
        // invalid currency code: fall through
    }
    return currency + " "
}
