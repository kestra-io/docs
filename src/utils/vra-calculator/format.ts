export const CURRENCIES = Object.freeze(["EUR", "USD", "GBP"] as const)

export type Currency = (typeof CURRENCIES)[number]

export function isCurrency(value: unknown): value is Currency {
    return (CURRENCIES as readonly unknown[]).includes(value)
}

const REGION_CURRENCY: Record<string, Currency> = {
    US: "USD",
    GB: "GBP",
    UK: "GBP",
}

/**
 * USD for a US region, GBP for GB/UK, EUR otherwise, from the first locale
 * only. A tag without a region is not guessed ("en" stays EUR).
 */
export function currencyFromLocale(
    locales: string | readonly string[] | null | undefined,
): Currency {
    const first = typeof locales === "string" ? locales : locales?.[0]
    try {
        const { region = "" } = new Intl.Locale(first ?? "")
        return REGION_CURRENCY[region] ?? "EUR"
    } catch {
        return "EUR"
    }
}

/** Falls back to the code and a space for a code Intl rejects. */
export function currencySymbol(currency: string): string {
    try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency })
            .formatToParts(0)
            .find((p) => p.type === "currency")!.value
    } catch {
        return currency + " "
    }
}

export function formatCount(n: number): string {
    return Math.round(n).toLocaleString("en-US")
}

/**
 * Compact money (€6.3M, €309K, €2,500), rounded like the reference's
 * `money()`: 999,999 shows as "1000K". Intl's compact notation would say "1M".
 */
export function formatMoney(n: number, currency: string): string {
    if (!Number.isFinite(n)) return "—"
    const a = Math.abs(n)
    const m = a / 1e6
    const amount =
        a >= 1e6
            ? (m >= 10 ? Math.round(m) : Math.round(m * 10) / 10) + "M"
            : a >= 1e4
              ? Math.round(a / 1e3) + "K"
              : formatCount(a)
    return (n < 0 ? "-" : "") + currencySymbol(currency) + amount
}
