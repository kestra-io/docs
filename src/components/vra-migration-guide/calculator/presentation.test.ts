import { describe, expect, it } from "vitest"
import { formatCount } from "~/utils/vra-calculator"
import { compute } from "~/utils/vra-calculator/compute"
import { GOLDEN } from "~/utils/vra-calculator/__fixtures__/golden"
import referenceCopy from "./__fixtures__/reference-copy.json"
import {
    PENDING_HEADLINE,
    PLACEHOLDER,
    avoidedLine,
    breakEvenLine,
    carefulCounts,
    complementPercent,
    costLine,
    effortBars,
    effortLine,
    funnelCounts,
    headline,
    netLine,
    paybackChart,
    reductionLine,
    renewalLine,
    toolShareLabel,
    viewMessages,
    yearBars,
    yearsTitle,
    type Rich,
} from "./presentation"

// reference-copy.json holds what the reference's render() wrote into each
// slot for every golden case (recorded from the same reference file as
// ~/utils/vra-calculator/__fixtures__/reference-golden.json).
type Slots = Record<string, string | { text: string; className: string }>
const COPY = referenceCopy as unknown as {
    _referenceSha256: string
    cases: { name: string; payback: Slots; funnel: Slots }[]
}

const toHtml = (rich: Rich) =>
    rich
        .map((p) =>
            typeof p === "string"
                ? p
                : p.tone
                  ? `<b class="kvc-${p.tone}">${p.strong}</b>`
                  : `<b>${p.strong}</b>`,
        )
        .join("")

const decode = (html: string) =>
    html.replace(/&mdash;/g, PLACEHOLDER).replace(/&middot;/g, "·")

const slot = (slots: Slots, key: string) => decode(slots[key] as string)

const cases = GOLDEN.cases.map((c) => {
    const copy = COPY.cases.find((x) => x.name === c.name)
    if (!copy) throw new Error(`copy for ${c.name} missing`)
    return [c.name, { state: c.state, copy }] as const
})

it("copy fixture comes from the same reference as the engine fixture", () => {
    expect(COPY._referenceSha256).toBe(GOLDEN._referenceSha256)
    expect(COPY.cases.length).toBe(GOLDEN.cases.length)
})

describe("funnel copy matches the reference", () => {
    it.each(cases)("%s", (_name, { state, copy }) => {
        const { funnel } = compute(state)
        const s = copy.funnel
        expect(funnelCounts(funnel).scope).toBe(slot(s, "rScope"))
        expect(carefulCounts(funnel)).toEqual({
            careful: slot(s, "careful"),
            distinct: slot(s, "distinctN"),
            wrappers: slot(s, "wrapN"),
        })
    })
})

describe("payback copy matches the reference", () => {
    it.each(cases)("%s", (_name, { state, copy }) => {
        const { funnel, payback } = compute(state)
        const s = copy.payback
        const cur = state.cur

        expect(toolShareLabel(state.tool)).toBe(slot(s, "toolOut"))
        expect((s.head as { text: string }).text).toBe(headline(payback))
        if (funnel)
            expect(toHtml(effortLine(funnel))).toBe(slot(s, "effortLine"))

        if (!payback) {
            expect(headline(payback)).toBe(PENDING_HEADLINE)
            expect(slot(s, "renewLine")).toBe(PLACEHOLDER)
            for (const key of ["anchor", "sub", "solve", "bars", "years"]) {
                expect(slot(s, key)).toBe("")
            }
            return
        }

        expect(toHtml(renewalLine(payback, cur))).toBe(slot(s, "renewLine"))
        expect(toHtml(avoidedLine(payback, cur))).toBe(slot(s, "anchor"))
        expect(toHtml(netLine(payback, cur))).toBe(slot(s, "sub"))
        expect(toHtml(breakEvenLine(payback, cur))).toBe(
            slot(s, "solve").split("<br>")[0],
        )

        const bars = [
            ...slot(s, "bars").matchAll(
                /<span>([^<]*)<\/span><b>([^<]*)<\/b><\/div><div class="kvc-track"><div class="kvc-fill" style="width:([^%]+)%/g,
            ),
        ].map((m) => ({ label: m[1], hours: m[2], percent: Number(m[3]) }))
        expect(
            effortBars(payback).map(({ label, hours, percent }) => ({
                label,
                hours,
                percent,
            })),
        ).toEqual(bars)

        const reduction = /<p class="kvc-mini">(.*)<\/p>$/.exec(slot(s, "bars"))
        expect(toHtml(reductionLine(payback, cur))).toBe(
            reduction ? reduction[1] : "",
        )

        const years = slot(s, "years")
        expect(
            years.startsWith(`<p class="kvc-label">${yearsTitle(payback)}</p>`),
        ).toBe(true)
        const rows = [
            ...years.matchAll(
                /<span>(Year \d+)<\/span>.*?left:([^%]+)%;width:([^%]+)%;.*?<span class="kvc-yval (kvc-pos|kvc-neg)">([^<]*)<\/span>/g,
            ),
        ].map((m) => ({
            label: m[1],
            left: Number(m[2]),
            width: Number(m[3]),
            positive: m[4] === "kvc-pos",
            value: m[5],
        }))
        expect(yearBars(payback, cur)).toEqual(rows)
    })
})

describe("viewMessages", () => {
    it("shows each repeated effort-hours error once", () => {
        const result = compute({ ...GOLDEN.defaults, hp1: "", hp2: -1 })
        expect(result.errors).toHaveLength(2)
        expect(viewMessages(result).errors).toEqual([
            "Effort hours have to be zero or more.",
        ])
    })

    it("words the dormant error as the share still in use in the payback view", () => {
        const result = compute({ ...GOLDEN.defaults, dormant: 150 })
        expect(viewMessages(result).errors).toEqual([
            "The share still in use has to be between 0 and 100 percent.",
        ])
        expect(result.errors).toEqual([
            "The share not executed has to be between 0 and 100 percent.",
        ])
    })

    it("shows the warnings", () => {
        const result = compute({ ...GOLDEN.defaults, total: 0 })
        expect(viewMessages(result).warnings).toHaveLength(1)
    })
})

describe("design views", () => {
    const { funnel, payback } = compute(GOLDEN.cases[0].state)

    it("counts the funnel rows, wrappers as a deduction", () => {
        const { careful, distinct, wrappers } = carefulCounts(funnel)
        expect(funnelCounts(funnel)).toEqual({
            scope: formatCount(funnel!.scope),
            distinct,
            wrappers: `-${wrappers}`,
            careful,
        })
        const noWrappers = compute({ ...GOLDEN.cases[0].state, wrappers: 0 })
        expect(funnelCounts(noWrappers.funnel).wrappers).toBe("0")
        expect(funnelCounts(null)).toEqual({
            scope: PLACEHOLDER,
            distinct: PLACEHOLDER,
            wrappers: PLACEHOLDER,
            careful: PLACEHOLDER,
        })
    })

    it("states hours and cost of the migration work", () => {
        expect(toHtml(costLine(payback!, "EUR"))).toMatch(
            /^About <b>[\d,]+ h<\/b>, so <b>€[\d.,]+[KM]?<\/b> of migration work\.$/,
        )
    })

    it("plots the cumulative position from today to the horizon", () => {
        const chart = paybackChart(payback!)
        const points = chart.line.slice(1).split(" L")
        expect(points).toHaveLength(payback!.horizonMonths + 1)
        expect(points[0].startsWith("0,")).toBe(true)
        expect(points.at(-1)!.startsWith("100,")).toBe(true)
        expect(chart.ticks.map((t) => t.label)).toEqual([
            "Today",
            ...Array.from(
                { length: payback!.horizonYears },
                (_, i) => `Year ${i + 1}`,
            ),
        ])
        for (const p of points) {
            const [x, y] = p.split(",").map(Number)
            expect(x).toBeGreaterThanOrEqual(0)
            expect(y).toBeGreaterThanOrEqual(0)
            expect(y).toBeLessThanOrEqual(100)
        }
        if (chart.point) {
            expect(chart.point.y).toBeCloseTo(chart.zeroY, -1)
        }
    })
})

describe("complementPercent", () => {
    it("gives back what was typed after a round trip", () => {
        // 100 - 99.9 is 0.09999999999999432 in floating point; the field
        // must not re-render the visitor's 0.1 as that.
        for (let tenths = 1; tenths < 1000; tenths++) {
            const typed = String(tenths / 10)
            expect(complementPercent(complementPercent(typed))).toBe(typed)
        }
        expect(complementPercent("0.1")).toBe("99.9")
        expect(complementPercent(15)).toBe("85")
    })

    it("passes non-numbers through for validation to flag", () => {
        expect(complementPercent("")).toBe("")
        expect(complementPercent(null)).toBe(null)
        expect(complementPercent("abc")).toBe("abc")
    })
})
