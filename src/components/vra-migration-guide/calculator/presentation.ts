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

export function funnelLine(f: FunnelResult): Rich {
    return [
        strong(formatCount(f.scope)),
        ` of your ${formatCount(f.total)} workflows need to be migrated. They will become `,
        strong(`${formatCount(f.distinct)} distinct flows`),
        ` in Kestra (${formatCount(f.scope)} - ${f.dupesPct}%). Out of those, `,
        strong(formatCount(f.wrappers)),
        ` (${f.wrapPct}%) are wrappers that can be migrated mostly for free.`,
    ]
}

export function effortLine(f: FunnelResult): Rich {
    return [
        strong(formatCount(f.scope)),
        " workflows need to migrate and will become ",
        strong(formatCount(f.distinct)),
        " distinct flows in Kestra. Out of those, ",
        strong(formatCount(f.wrappers)),
        " are wrappers and migrate for free.",
    ]
}

export function funnelSummary(f: FunnelResult | null): string {
    if (!f) return ""
    return `· ${formatCount(f.total)} vRO workflows, ${formatCount(f.distinct)} flows in Kestra`
}

export function funnelReadout(f: FunnelResult | null) {
    const n = (v: number | undefined) =>
        f && v !== undefined ? formatCount(v) : PLACEHOLDER
    return [
        { value: n(f?.total), label: "vRO workflows" },
        { value: n(f?.scope), label: "migrate to Kestra" },
        { value: n(f?.distinct), label: "flows in Kestra" },
        { value: n(f?.wrappers), label: "are wrappers (easy migration)" },
    ]
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

export const PENDING_HEADLINE = "Fix the inputs to see a payback."

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

export interface EffortBar {
    label: string
    hours: string
    percent: number
    variant: "naive" | "manual" | "tool"
}

export function effortBars(p: PaybackResult): EffortBar[] {
    const max = Math.max(p.naiveHours, p.manualHours, p.hours, 1)
    const bar = (
        label: string,
        value: number,
        variant: EffortBar["variant"],
    ): EffortBar => ({
        label,
        hours: `${formatCount(value)} h`,
        percent: (value / max) * 100,
        variant,
    })
    return [
        bar(
            "Every vRO workflow converted by hand, one at a time",
            p.naiveHours,
            "naive",
        ),
        bar(
            "After retiring, grouping near-duplicates and calling wrappers",
            p.manualHours,
            "manual",
        ),
        bar(
            `With the AI-assisted vRO migration tool at ${p.toolPct}%`,
            p.hours,
            "tool",
        ),
    ]
}

export function reductionLine(p: PaybackResult, cur: Currency): Rich {
    if (!(p.reductionPct > 0)) return []
    return [
        `${p.reductionPct}% less than converting every workflow by hand. At ${formatMoney(p.rate, cur)} an hour, that is savings of `,
        strong(formatMoney(p.saved, cur)),
        ".",
    ]
}

export interface YearBar {
    label: string
    value: string
    positive: boolean
    left: number
    width: number
}

export function yearsTitle(p: PaybackResult): string {
    return (
        "Cumulative position against renewing" +
        (p.kestraBlank ? " (before Kestra licensing)" : "")
    )
}

export function yearBars(p: PaybackResult, cur: Currency): YearBar[] {
    const max = Math.max(...p.yearly.map(Math.abs), 1)
    return p.yearly.map((v, i) => {
        const width = (Math.abs(v) / max) * 50
        return {
            label: `Year ${i + 1}`,
            value: formatMoney(v, cur),
            positive: v >= 0,
            left: v >= 0 ? 50 : 50 - width,
            width,
        }
    })
}

export function toolShareLabel(value: InputValue): string {
    return `${toNumber(value) || 0}%`
}

/**
 * Messages to show above a view. The payback view shows every error and the
 * warnings. The funnel view shows only errors about its own four inputs
 * (the reference shows all errors there, including fields the 3.2.2 view
 * does not have). Repeated messages (one per invalid effort-hour field) are
 * shown once.
 */
export function viewMessages(result: CalcResult, view: "funnel" | "payback") {
    const unique = (list: string[]) => [...new Set(list)]
    if (view === "funnel") {
        // Funnel errors are the only ones that leave `funnel` null.
        return {
            errors: result.funnel ? [] : unique(result.errors),
            warnings: [],
        }
    }
    return { errors: unique(result.errors), warnings: unique(result.warnings) }
}
