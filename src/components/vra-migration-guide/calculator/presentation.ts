import {
    formatCount,
    formatMoney,
    toNumber,
    type CalcResult,
    type Currency,
    type FunnelResult,
    type InputValue,
    type PaybackResult,
} from "~/utils/vra-calculator"
import { MESSAGES } from "~/utils/vra-calculator/validate"

// Display copy and chart geometry for the calculator views, worded as in the
// reference's render(). Numbers all come from the engine; this module only
// formats them and lays them out. Copy is returned as rich-text parts rather
// than HTML so the views never need v-html.

export type Tone = "pos" | "neg"
export type RichPart = string | { strong: string; tone?: Tone }
export type Rich = RichPart[]

const strong = (text: string | number, tone?: Tone): RichPart =>
    tone ? { strong: String(text), tone } : { strong: String(text) }

export const PLACEHOLDER = "—"

/**
 * The share "executed in the last 12 months" is the complement of the stored
 * `dormant` share. Rounded to four decimals so the round trip through floating
 * point gives back what was typed (0.1 -> 99.9 -> 0.1, not 0.0999…).
 */
export function complementPercent(value: InputValue): InputValue {
    const n = toNumber(value)
    return n === null ? value : String(Math.round((100 - n) * 1e4) / 1e4)
}

export function carefulCounts(f: FunnelResult | null) {
    return {
        careful: f ? formatCount(f.careful) : PLACEHOLDER,
        distinct: f ? formatCount(f.distinct) : PLACEHOLDER,
        wrappers: f ? formatCount(f.wrappers) : PLACEHOLDER,
    }
}

export function renewalLine(p: PaybackResult, cur: Currency): Rich {
    const parts: Rich = [
        "At renewal you would pay about ",
        strong(formatMoney(p.renewalCost, cur)),
        " a year for vRA and vRO",
    ]
    if (p.otherCost > 0) {
        parts.push(
            ", plus ",
            strong(formatMoney(p.otherCost, cur)),
            " in other annual costs",
        )
    }
    parts.push(".")
    return parts
}

export function avoidedLine(p: PaybackResult, cur: Currency): Rich {
    if (!(p.avoided > 0)) return []
    return [
        "Avoiding ",
        strong(formatMoney(p.avoided, cur)),
        " a year, from the renewal in ",
        strong(p.renewInMonths),
        ` month${p.renewInMonths === 1 ? "" : "s"}.`,
    ]
}

const PENDING_HEADLINE = "Fix the inputs to see a payback."

export function headline(p: PaybackResult | null): string {
    if (!p) return PENDING_HEADLINE
    switch (p.paybackStatus) {
        case "within-horizon":
            return `Pays back in month ${p.paybackMonth}, in year ${p.paybackYear}.`
        case "past-horizon":
            return `Pays back in year ${p.paybackYear}, past your ${p.horizonYears}-year horizon.`
        default:
            return "Does not pay back within fifteen years."
    }
}

export function netLine(p: PaybackResult, cur: Currency): Rich {
    const tail: Rich = [
        ", after ",
        strong(formatMoney(p.migrationCost, cur)),
        " in migration costs" +
            (p.kestraBlank ? " (before Kestra licensing)" : "") +
            ".",
    ]
    if (p.net >= 0) {
        return [
            `Over ${p.horizonYears} years, you save `,
            strong(formatMoney(p.net, cur), "pos"),
            " by migrating to Kestra",
            ...tail,
        ]
    }
    return [
        `Over ${p.horizonYears} years, migrating costs `,
        strong(formatMoney(-p.net, cur), "neg"),
        " more than renewing",
        ...tail,
    ]
}

export function breakEvenLine(p: PaybackResult, cur: Currency): Rich {
    if (!p.kestraBlank) return []
    const h = p.horizonYears
    if (p.breakEven !== null) {
        return [
            "You'd still save at any Kestra price up to ",
            strong(formatMoney(p.breakEven, cur)),
            " a year.",
        ]
    }
    if (p.breakEvenAlt !== null) {
        return [
            `This does not save money over ${h} years even before Kestra licensing. Over ${h + 2} years, you'd save at any Kestra price up to `,
            strong(formatMoney(p.breakEvenAlt, cur)),
            " a year.",
        ]
    }
    return [
        `This does not save money within ${h + 2} years even before Kestra licensing. Check the renewal multiple first, then the near-duplicate and wrapper shares.`,
    ]
}

export function yearsTitle(p: PaybackResult): string {
    return (
        "Cumulative position against renewing" +
        (p.kestraBlank ? " (before Kestra licensing)" : "")
    )
}

// The calculator asks for the share of workflows still in use, the complement
// of the engine's "not executed" input, so its error says so too. The engine
// keeps the reference's wording.
export const MESSAGE_OVERRIDES: Readonly<Record<string, string>> =
    Object.freeze({
        [MESSAGES.dormant]:
            "The share still in use has to be between 0 and 100 percent.",
    })

/**
 * Messages to show above the calculator: every error and the warnings, each
 * once (one per invalid effort-hour field otherwise).
 */
export function viewMessages(result: CalcResult) {
    const unique = (list: string[]) => [...new Set(list)]
    return {
        errors: unique(result.errors.map((e) => MESSAGE_OVERRIDES[e] ?? e)),
        warnings: unique(result.warnings),
    }
}

export function funnelCounts(f: FunnelResult | null) {
    const n = (v: number | undefined) =>
        f && v !== undefined ? formatCount(v) : PLACEHOLDER
    return {
        scope: n(f?.scope),
        distinct: n(f?.distinct),
        // Shown as a deduction from the unique flows, but never as "-0".
        wrappers: !f
            ? PLACEHOLDER
            : f.wrappers > 0
              ? `-${formatCount(f.wrappers)}`
              : formatCount(f.wrappers),
        careful: n(f?.careful),
    }
}

export function costLine(p: PaybackResult, cur: Currency): Rich {
    return [
        "About ",
        strong(`${formatCount(p.hours)} h`),
        ", so ",
        strong(formatMoney(p.migrationCost, cur)),
        " of migration work.",
    ]
}

export interface ChartTick {
    label: string
    x: number
}

export interface PaybackChart {
    line: string
    area: string
    zeroY: number
    renewalX: number | null
    point: { x: number; y: number } | null
    ticks: ChartTick[]
    caption: string
}

export function paybackChart(p: PaybackResult): PaybackChart {
    const months = p.horizonMonths
    const series = [0, ...p.cumulative.slice(0, months)]
    const top = Math.max(...series, 0)
    const bottom = Math.min(...series, 0)
    const range = top - bottom || 1
    const round = (v: number) => Math.round(v * 100) / 100
    const x = (m: number) => round((m / months) * 100)
    const y = (v: number) => round(((top - v) / range) * 100)

    const points = series.map((v, m) => `${x(m)},${y(v)}`)
    const line = `M${points.join(" L")}`
    const zeroY = y(0)
    const inHorizon = (m: number | null): m is number =>
        m !== null && m > 0 && m <= months

    return {
        line,
        area: `${line} L100,${zeroY} L0,${zeroY} Z`,
        zeroY,
        renewalX: inHorizon(p.renewInMonths) ? x(p.renewInMonths) : null,
        point: inHorizon(p.paybackMonth)
            ? { x: x(p.paybackMonth), y: y(series[p.paybackMonth]) }
            : null,
        ticks: [
            { label: "Today", x: 0 },
            ...Array.from({ length: p.horizonYears }, (_, i) => ({
                label: `Year ${i + 1}`,
                x: x((i + 1) * 12),
            })),
        ],
        caption: `Over ${p.horizonYears} year${p.horizonYears === 1 ? "" : "s"}`,
    }
}
