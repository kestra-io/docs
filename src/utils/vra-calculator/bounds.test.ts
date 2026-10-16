import { describe, expect, it } from "vitest"
import { compute } from "./compute"
import { buildCsvFile } from "./csv"
import { MAX, resolveInputs } from "./defaults"
import { formatMoney } from "./format"
import { allocate, breakEven } from "./payback"
import { decodeShareState, encodeShareState } from "./share"
import type { CalcInputs, PaybackResult } from "./types"
import { MESSAGES, TOO_LARGE } from "./validate"

const run = (overrides: Partial<CalcInputs>) =>
    compute(resolveInputs(overrides))

const finite = (p: PaybackResult) =>
    [
        p.renewalCost,
        p.migrationCost,
        p.net,
        ...p.cumulative,
        ...p.yearly,
        p.breakEven ?? 0,
    ].every(Number.isFinite)

const BOUNDED = [
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
] as const

describe("upper bounds", () => {
    it.each(BOUNDED)("%s accepts its limit of %s", (key, max) => {
        const r = run({ [key]: max })
        expect(r.errors).toEqual([])
        expect(r.payback && finite(r.payback)).toBe(true)
    })

    it.each(BOUNDED)("%s rejects one past its limit", (key, max, message) => {
        const r = run({ [key]: max + 1 })
        expect(r.errors).toEqual([message])
        expect(r.invalid).toEqual({ [key]: true })
        expect(r.payback).toBeNull()
    })

    it.each(BOUNDED)(
        "%s rejects 1e308 and its string form",
        (key, _max, message) => {
            for (const value of [1e308, "1e308", Number.MAX_VALUE]) {
                const r = run({ [key]: value })
                expect(r.errors).toEqual([message])
                expect(r.payback).toBeNull()
            }
        },
    )

    it("keeps the reference message for a negative value, not both", () => {
        expect(run({ today: -1 }).errors).toEqual([MESSAGES.today])
        expect(run({ total: -1 }).errors).toEqual([MESSAGES.total])
    })

    it("treats Infinity and NaN strings as not numbers", () => {
        expect(run({ today: "Infinity" }).errors).toEqual([MESSAGES.today])
        expect(run({ rate: "NaN" }).errors).toEqual([MESSAGES.rate])
    })

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
        const p = r.payback!
        expect(finite(p)).toBe(true)
        expect(formatMoney(p.net, "EUR")).not.toMatch(/NaN|Infinity/)
        expect(buildCsvFile(inputs, new Date(0))).not.toMatch(/NaN|Infinity/)
    })
})

describe("share links with extreme values", () => {
    it("decode but fail validation instead of overflowing", () => {
        for (const value of [1e308, "1e308", -1e308]) {
            const decoded = decodeShareState(
                encodeShareState(resolveInputs({ today: value })),
            )
            const r = compute(resolveInputs(decoded))
            expect(r.payback).toBeNull()
            expect(r.errors.length).toBe(1)
        }
    })
})

describe("formatMoney", () => {
    it("shows a dash for values that are not finite", () => {
        expect(formatMoney(Infinity, "EUR")).toBe("—")
        expect(formatMoney(-Infinity, "USD")).toBe("—")
        expect(formatMoney(NaN, "GBP")).toBe("—")
    })
})

describe("zero and boundary inputs", () => {
    it("pays back the month after an immediate renewal when nothing needs migrating", () => {
        const p = run({ renew: 0, total: 0 }).payback!
        expect(p.migrationCost).toBe(0)
        expect(p.paybackMonth).toBe(1)
    })

    it("starts savings the month after renewal", () => {
        const p = run({ renew: 12 }).payback!
        expect(p.cumulative[11]).toBeLessThan(p.cumulative[12])
        expect(p.paybackMonth).toBeGreaterThan(12)
    })

    it("flags no renewal cost and no workflows as warnings, not errors", () => {
        const r = run({ today: 0, other: 0, total: 0 })
        expect(r.errors).toEqual([])
        expect(r.warnings.length).toBe(2)
        expect(finite(r.payback!)).toBe(true)
    })

    it("accepts the horizon and renewal bounds and rejects past them", () => {
        expect(run({ horizon: 1 }).errors).toEqual([])
        expect(run({ horizon: 10 }).errors).toEqual([])
        expect(run({ renew: 60 }).errors).toEqual([])
        expect(run({ horizon: 0 }).errors).toEqual([MESSAGES.horizon])
        expect(run({ renew: 61 }).errors).toEqual([MESSAGES.renew])
    })

    it("handles a renewal at the end of the horizon", () => {
        const p = run({ renew: 12, horizon: 1 }).payback!
        expect(finite(p)).toBe(true)
        expect(p.paybackStatus).not.toBe("within-horizon")
    })
})

describe("breakEven", () => {
    it("returns null, not 0, when the saving exactly covers the migration", () => {
        expect(
            breakEven(2, {
                avoided: 120,
                renewInMonths: 12,
                migrationCost: 120,
            }),
        ).toBeNull()
    })
})

describe("allocate invariants", () => {
    const cases: [number, number[]][] = [
        [2, [1, 1, 1]],
        [1, [1, 1]],
        [7, [0, 1, 0]],
        [100, [33, 33, 34]],
        [999, [1, 2, 3]],
        [MAX.workflows, [25, 60, 15]],
    ]

    it.each(cases)(
        "splits %s across %j into whole, non-negative parts",
        (total, weights) => {
            const out = allocate(total, weights)
            expect(out.reduce((a, b) => a + b, 0)).toBe(total)
            expect(out.every((n) => Number.isInteger(n) && n >= 0)).toBe(true)
        },
    )

    it("breaks equal remainders in weight order", () => {
        expect(allocate(2, [1, 1, 1])).toEqual([1, 1, 0])
    })

    it("returns zeros for a zero total or zero weights", () => {
        expect(allocate(0, [1, 2])).toEqual([0, 0])
        expect(allocate(5, [0, 0])).toEqual([0, 0])
    })
})
