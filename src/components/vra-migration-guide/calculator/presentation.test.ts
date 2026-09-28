import { describe, expect, it } from "vitest"
import { compute } from "~/utils/vra-calculator"
import { GOLDEN } from "~/utils/vra-calculator/__fixtures__/golden"
import referenceCopy from "./__fixtures__/reference-copy.json"
import {
    PENDING_HEADLINE,
    PLACEHOLDER,
    avoidedLine,
    breakEvenLine,
    carefulCounts,
    effortBars,
    effortLine,
    funnelLine,
    funnelReadout,
    funnelSummary,
    headline,
    netLine,
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
        if (funnel) {
            expect(toHtml(funnelLine(funnel))).toBe(slot(s, "funnelLine"))
        } else {
            expect(slot(s, "funnelLine")).toBe(PLACEHOLDER)
        }
        expect(funnelReadout(funnel).map((t) => t.value)).toEqual(
            ["rTotal", "rScope", "rDistinct", "rWrap"].map((k) => slot(s, k)),
        )
        expect(funnelSummary(funnel)).toBe(slot(s, "funnelShort"))
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
        expect(viewMessages(result, "payback").errors).toEqual([
            "Effort hours have to be zero or more.",
        ])
    })

    it("keeps warnings in the payback view only", () => {
        const result = compute({ ...GOLDEN.defaults, total: 0 })
        expect(viewMessages(result, "funnel").warnings).toEqual([])
        expect(viewMessages(result, "payback").warnings).toHaveLength(1)
    })

    it("shows the funnel view only errors about its own inputs", () => {
        const paybackOnly = compute({ ...GOLDEN.defaults, horizon: 0 })
        expect(viewMessages(paybackOnly, "funnel").errors).toEqual([])
        expect(viewMessages(paybackOnly, "payback").errors).toHaveLength(1)

        const funnelError = compute({ ...GOLDEN.defaults, total: "" })
        expect(viewMessages(funnelError, "funnel").errors).toEqual(
            funnelError.errors,
        )
    })
})
