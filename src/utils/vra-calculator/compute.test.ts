import { describe, expect, it } from "vitest"
import { GOLDEN } from "./__fixtures__/golden"
import { compute } from "./compute"
import {
    DEFAULTS,
    INPUT_KEYS,
    isPresetMultiple,
    resolveInputs,
} from "./defaults"
import type { CalcInputs, CalcResult } from "./types"
import { MESSAGES, WARNINGS } from "./validate"

function toReferenceShape(r: CalcResult): Record<string, unknown> {
    const out: Record<string, unknown> = {
        err: r.errors,
        warn: r.warnings,
        bad: Object.fromEntries(Object.keys(r.invalid).map((k) => [k, 1])),
        funnelOk: r.funnel !== null,
        payOk: r.payback !== null,
    }
    if (r.funnel) {
        const f = r.funnel
        Object.assign(out, {
            total: f.total,
            scope: f.scope,
            variants: f.variants,
            distinct: f.distinct,
            wrappers: f.wrappers,
            careful: f.careful,
            dupesPct: f.dupesPct,
            wrapPct: f.wrapPct,
        })
    }
    if (r.payback) {
        const p = r.payback
        Object.assign(out, {
            P: p.distinctByBucket,
            V: p.variantsByBucket,
            hours: p.hours,
            manual: p.manualHours,
            naive: p.naiveHours,
            byBucket: p.hoursByBucket,
            rate: p.rate,
            mig: p.migrationCost,
            saved: p.saved,
            avoid: p.avoided,
            renewal: p.renewalCost,
            otherCost: p.otherCost,
            renew: p.renewInMonths,
            horizon: p.horizonYears,
            H: p.horizonMonths,
            kBlank: p.kestraBlank,
            k: p.kestraAnnual,
            cum: p.cumulative,
            payback: p.paybackMonth ?? -1,
            net: p.net,
            be: p.breakEven,
            beAlt: p.breakEvenAlt,
            tool: p.toolPct,
            complexPct: p.complexPct,
        })
    }
    return out
}

describe("golden fixture", () => {
    it("was recorded from the expected reference", () => {
        // SHA-256 of the reference file the fixture was recorded from.
        expect(GOLDEN._referenceSha256).toBe(
            "dfed6ff94524eec28b40679bb37520c93a2b5b5f2476ba37eed77d2478f7f2d3",
        )
        expect(GOLDEN.cases.length).toBeGreaterThanOrEqual(20)
    })
})

describe("defaults", () => {
    it("match the reference's starting assumptions", () => {
        expect({ ...DEFAULTS }).toEqual(GOLDEN.defaults)
        expect(INPUT_KEYS).toEqual(Object.keys(GOLDEN.defaults))
    })

    it("default the renewal multiple to the 3x chip", () => {
        expect(DEFAULTS.mult).toBe(3)
        expect(isPresetMultiple(DEFAULTS.mult)).toBe(true)
        expect(isPresetMultiple("5")).toBe(true)
        expect(isPresetMultiple(3.5)).toBe(false)
        expect(isPresetMultiple("")).toBe(false)
    })

    it("resolveInputs keeps present keys, blank or not, and fills the rest", () => {
        const resolved = resolveInputs({ total: "", cur: "GBP" })
        expect(resolved.total).toBe("")
        expect(resolved.cur).toBe("GBP")
        expect(resolved.rate).toBe(DEFAULTS.rate)
        expect(resolveInputs(null)).toEqual({ ...DEFAULTS })
    })
})

describe("compute matches the reference", () => {
    it.each(GOLDEN.cases.map((c) => [c.name, c] as const))("%s", (_name, c) => {
        expect(toReferenceShape(compute(c.state))).toEqual(c.result)
    })
})

describe("derived display values", () => {
    // These come from the reference's render(); checked against its formulas
    // applied to the golden output.
    it.each(
        GOLDEN.cases
            .filter((c) => c.result.payOk)
            .map((c) => [c.name, c] as const),
    )("%s", (_name, c) => {
        const p = compute(c.state).payback!
        const ref = c.result as unknown as {
            cum: number[]
            payback: number
            H: number
            horizon: number
            naive: number
            hours: number
        }
        const yearly = Array.from(
            { length: ref.horizon },
            (_, i) => ref.cum[(i + 1) * 12 - 1],
        )
        expect(p.yearly).toEqual(yearly)
        expect(p.reductionPct).toBe(
            ref.naive > 0 ? Math.round((1 - ref.hours / ref.naive) * 100) : 0,
        )
        expect(p.paybackYear).toBe(
            ref.payback > 0 ? Math.ceil(ref.payback / 12) : null,
        )
        expect(p.paybackStatus).toBe(
            ref.payback > 0 && ref.payback <= ref.H
                ? "within-horizon"
                : ref.payback > 0
                  ? "past-horizon"
                  : "none",
        )
    })
})

describe("key numbers at the defaults", () => {
    const { funnel, payback } = compute(resolveInputs())

    it("sizes the funnel", () => {
        expect(funnel).toMatchObject({
            total: 400,
            scope: 340,
            distinct: 170,
            variants: 170,
            wrappers: 43,
            careful: 127,
        })
    })

    it("pays back in month 14 with a 930K break-even", () => {
        expect(payback?.paybackMonth).toBe(14)
        expect(payback?.paybackStatus).toBe("within-horizon")
        expect(Math.round(payback!.migrationCost)).toBe(209500)
        expect(Math.round(payback!.net)).toBe(2790500)
        expect(Math.round(payback!.breakEven!)).toBe(930167)
        expect(payback?.reductionPct).toBe(78)
    })
})

describe("edge cases", () => {
    const run = (overrides: Partial<CalcInputs>) =>
        compute(resolveInputs(overrides))

    it("warns on zero workflows but still computes", () => {
        const r = run({ total: 0 })
        expect(r.errors).toEqual([])
        expect(r.warnings).toEqual([WARNINGS.noWorkflows])
        expect(r.payback?.migrationCost).toBe(0)
    })

    it("warns on zero renewal spend and never pays back", () => {
        const r = run({ today: 0, other: 0 })
        expect(r.warnings).toEqual([WARNINGS.noRenewal])
        expect(r.payback?.paybackMonth).toBeNull()
        expect(r.payback?.paybackStatus).toBe("none")
    })

    it("treats blank and null Kestra as no quote, and '0' as a quote", () => {
        for (const kestra of ["", null]) {
            const p = run({ kestra }).payback!
            expect(p.kestraBlank).toBe(true)
            expect(p.breakEven).not.toBeNull()
        }
        const quoted = run({ kestra: "0" }).payback!
        expect(quoted.kestraBlank).toBe(false)
        expect(quoted.breakEven).toBeNull()
    })

    it("stops at funnel errors without validating payback inputs", () => {
        const r = run({ total: 10.5, complex: 150 })
        expect(r.errors).toEqual([MESSAGES.total])
        expect(r.invalid).toEqual({ total: true })
        expect(r.funnel).toBeNull()
        expect(r.payback).toBeNull()
    })

    it("keeps the funnel when only payback inputs are invalid", () => {
        const r = run({ horizon: 0 })
        expect(r.errors).toEqual([MESSAGES.horizon])
        expect(r.funnel).not.toBeNull()
        expect(r.payback).toBeNull()
        expect(r.warnings).toEqual([])
    })
})
