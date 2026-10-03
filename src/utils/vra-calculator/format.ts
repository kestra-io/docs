import { currencySymbol } from "./currency"

export function formatCount(n: number): string {
    return Math.round(n).toLocaleString("en-US")
}

/**
 * Compact money for display: €6.3M, €309K, €2,500. The reference's `money()`,
 * including its rounding (999,999 shows as "1000K"). The CSV keeps exact
 * values instead.
 */
export function formatMoney(n: number, currency: string): string {
    const a = Math.abs(n)
    const sign = n < 0 ? "-" : ""
    const symbol = currencySymbol(currency)
    if (a >= 1e6) {
        const v = a / 1e6
        return (
            sign +
            symbol +
            (v >= 10 ? Math.round(v) : Math.round(v * 10) / 10) +
            "M"
        )
    }
    if (a >= 1e4) return sign + symbol + Math.round(a / 1e3) + "K"
    return sign + symbol + formatCount(a)
}
