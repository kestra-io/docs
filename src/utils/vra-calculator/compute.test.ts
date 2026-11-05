import { describe, expect, it } from "vitest"
import { GOLDEN } from "./__fixtures__/golden"
import { allocate, breakEven, compute } from "./compute"
import { buildCsvFile } from "./csv"
import { DEFAULTS, INPUT_KEYS, MAX, resolveInputs } from "./defaults"
import { decodeShareState, encodeShareState } from "./share"
import { MESSAGES, TOO_LARGE, WARNINGS } from "./validate"
import type { CalcResult } from "./compute"
import type { CalcInputs } from "./defaults"

/** Our field name for each of the reference's payback fields. */
const REFERENCE_PAYBACK = {
    P: "distinctByBucket",
    V: "variantsByBucket",
    hours: "hours",
    manual: "manualHours",
    naive: "naiveHours",
    byBucket: "hoursByBucket",
    rate: "rate",
    mig: "migrationCost",
    saved: "saved",
    avoid: "avoided",
    renewal: "renewalCost",
    otherCost: "otherCost",
    renew: "renewInMonths",
    horizon: "horizonYears",
    H: "horizonMonths",
    kBlank: "kestraBlank",
    k: "kestraAnnual",
    cum: "cumulative",
    net: "net",
    be: "breakEven",
    beAlt: "breakEvenAlt",
    tool: "toolPct",
    complexPct: "complexPct",
} as const

function toReferenceShape({ funnel, payback: p, ...r }: CalcResult) {
    return {
        err: r.errors,
        warn: r.warnings,
        bad: Object.fromEntries(Object.keys(r.invalid).map((k) => [k, 1])),
        funnelOk: funnel !== null,
        payOk: p !== null,
        ...funnel,
        ...(p &&
            Object.fromEntries([
                ...Object.entries(REFERENCE_PAYBACK).map(([ref, key]) => [
                    ref,
                    p[key],
                ]),
                ["payback", p.paybackMonth ?? -1],
            ])),
    }
}

const run = (overrides: Partial<CalcInputs>) =>
    compute(resolveInputs(overrides))

describe("golden fixture", () => {
    it("was recorded from the expected reference, with the same defaults", () => {
        // SHA-256 of the reference file the fixture was recorded from.
        expect(GOLDEN._referenceSha256).toBe(
            "dfed6ff94524eec28b40679bb37520c93a2b5b5f2476ba37eed77d2478f7f2d3",
        )
        expect({ ...DEFAULTS }).toEqual(GOLDEN.defaults)
        expect(INPUT_KEYS).toEqual(Object.keys(GOLDEN.defaults))
    })

    it.each(GOLDEN.cases.map((c) => [c.name, c] as const))(
        "compute matches %s",
        (_name, c) => {
            expect(toReferenceShape(compute(c.state))).toEqual(c.result)
        },
    )

    it.each(GOLDEN.alloc.map((a) => [a.total, a.w, a.out] as const))(
        "allocate splits %s across %j like the reference",
        (total, weights, expected) => {
            expect(allocate(total, [...weights])).toEqual(expected)
        },
    )
})

describe("validation", () => {
    it.each<[Partial<CalcInputs>, string[]]>([
        [{ total: "" }, [MESSAGES.total]],
        [{ total: -1 }, [MESSAGES.total]],
        [{ today: -1 }, [MESSAGES.today]],
        [{ today: "Infinity" }, [MESSAGES.today]],
        [{ rate: "NaN" }, [MESSAGES.rate]],
        [{ total: "0x1F" }, [MESSAGES.total]],
        [{ total: "0b11" }, [MESSAGES.total]],
        [{ rate: "0o17" }, [MESSAGES.rate]],
        [{ kestra: "abc" }, [MESSAGES.kestra]],
        [{ renew: 6.5 }, [MESSAGES.renew]],
        [{ horizon: 11 }, [MESSAGES.horizon]],
        [{ total: "1e3", today: "12.5", kestra: "0" }, []],
    ])("%j -> %j", (overrides, errors) => {
        expect(run(overrides).errors).toEqual(errors)
    })

    it.each([
        ["total", MAX.workflows, TOO_LARGE.total],
        ["rate", MAX.rate, TOO_LARGE.rate],
        ["hp1", MAX.hours, TOO_LARGE.hours],
        ["hp2", MAX.hours, TOO_LARGE.hours],
        ["hv1", MAX.hours, TOO_LARGE.hours],
        ["hv2", MAX.hours, TOO_LARGE.hours],
        ["today", MAX.amount, TOO_LARGE.today],
        ["mult", MAX.multiple, TOO_LARGE.mult],
        ["other", MAX.amount, TOO_LARGE.other],
        ["kestra", MAX.amount, TOO_LARGE.kestra],
    ] as const)(
        "%s accepts %s and rejects anything larger",
        (key, max, message) => {
            expect(run({ [key]: max }).errors).toEqual([])
            for (const value of [max + 1, 1e308, "1e308", Number.MAX_VALUE]) {
                const r = run({ [key]: value })
                expect(r.errors).toEqual([message])
                expect(r.invalid).toEqual({ [key]: true })
                expect(r.payback).toBeNull()
            }
        },
    )

    it("stays finite with every bounded field at its limit at once", () => {
        const inputs = resolveInputs({
            total: MAX.workflows,
            dormant: 0,
            dupes: 0,
            wrappers: 0,
            complex: 100,
            tool: 0,
            rate: MAX.rate,
            hp1: MAX.hours,
            hp2: MAX.hours,
            hv1: MAX.hours,
            hv2: MAX.hours,
            today: MAX.amount,
            mult: MAX.multiple,
            other: MAX.amount,
            kestra: MAX.amount,
            renew: 60,
            horizon: 10,
        })
        const r = compute(inputs)
        expect(r.errors).toEqual([])
        expect(r.payback!.cumulative.every(Number.isFinite)).toBe(true)
        expect(buildCsvFile(inputs, new Date(0))).not.toMatch(/NaN|Infinity/)
    })

    it("rejects extreme values that arrive through a share link", () => {
        for (const today of [1e308, "1e308", -1e308]) {
            const decoded = decodeShareState(
                encodeShareState(resolveInputs({ today })),
            )
            expect(compute(resolveInputs(decoded)).errors).toHaveLength(1)
        }
    })
})

describe("edge cases", () => {
    it("warns on zero workflows and on zero renewal spend, but still computes", () => {
        const noWorkflows = run({ total: 0 })
        expect(noWorkflows.warnings).toEqual([WARNINGS.noWorkflows])
        expect(noWorkflows.payback?.migrationCost).toBe(0)
        const noRenewal = run({ today: 0 })
        expect(noRenewal.warnings).toEqual([WARNINGS.noRenewal])
        expect(noRenewal.payback?.paybackStatus).toBe("none")
    })

    it("treats blank and null Kestra as no quote, and '0' as a quote", () => {
        for (const kestra of ["", null]) {
            expect(run({ kestra }).payback?.breakEven).not.toBeNull()
        }
        const quoted = run({ kestra: "0" }).payback!
        expect(quoted.kestraBlank).toBe(false)
        expect(quoted.breakEven).toBeNull()
    })

    it("pays back the month after an immediate renewal when nothing needs migrating", () => {
        expect(run({ renew: 0, total: 0 }).payback?.paybackMonth).toBe(1)
    })

    it("treats an exact break-even as paid back, not as float noise", () => {
        // The renewal avoided over the horizon equals the migration cost to
        // the cent; the 24-term monthly sum alone lands at -2e-11.
        const p = run({
            today: 209500,
            mult: 1,
            horizon: 2,
            kestra: 0,
        }).payback!
        expect(p.migrationCost).toBe(p.avoided)
        expect(p.net).toBe(0)
        expect(p.paybackMonth).toBe(24)
        expect(p.paybackStatus).toBe("within-horizon")
    })

    const cash = {
        avoided: 1_500_000,
        renewInMonths: 12,
        migrationCost: 209_500,
    }
    it.each([
        ["horizon ends at the renewal", 1, cash, null],
        [
            "saving only covers migration",
            2,
            { ...cash, avoided: 209_500 },
            null,
        ],
        ["saving left after migration", 3, cash, (3_000_000 - 209_500) / 3],
    ])("breakEven: %s", (_label, years, input, expected) => {
        expect(breakEven(years, input)).toBe(expected)
    })

    it.each([
        [2, [1, 1, 1]],
        [100, [33, 33, 34]],
        [999, [1, 2, 3]],
        [MAX.workflows, [25, 60, 15]],
    ])(
        "allocate splits %s across %j into whole parts that add up",
        (total, weights) => {
            const out = allocate(total, weights)
            expect(out.reduce((a, b) => a + b, 0)).toBe(total)
            expect(out.every((n) => Number.isInteger(n) && n >= 0)).toBe(true)
        },
    )
})
