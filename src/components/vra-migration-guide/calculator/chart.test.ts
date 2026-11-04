import { describe, expect, it } from "vitest"
import {
    MAX,
    compute,
    resolveInputs,
    type PaybackResult,
} from "~/utils/vra-calculator"
import { paybackChart } from "./presentation"

describe("paybackChart edge cases", () => {
    const base = compute(resolveInputs()).payback!
    const chart = (overrides: Partial<PaybackResult>) =>
        paybackChart({ ...base, ...overrides })

    it("draws a flat line for an all-zero series", () => {
        const c = chart({
            cumulative: new Array(36).fill(0),
            paybackMonth: null,
        })
        expect(c.line).not.toMatch(/NaN|Infinity/)
        expect(c.point).toBeNull()
    })

    it("draws a negative-only series inside the box", () => {
        const c = chart({
            cumulative: Array.from({ length: 36 }, (_, i) => -(i + 1) * 1000),
            paybackMonth: null,
        })
        expect(c.line).not.toMatch(/NaN|Infinity/)
        expect(c.zeroY).toBe(0)
    })

    it("marks a payback exactly at the horizon", () => {
        const c = chart({ paybackMonth: 36 })
        expect(c.point?.x).toBe(100)
    })

    it("leaves out a payback past the horizon", () => {
        expect(chart({ paybackMonth: 37 }).point).toBeNull()
    })
})

describe("paybackChart at the input limits", () => {
    it("never puts NaN or Infinity in the path", () => {
        const p = compute(
            resolveInputs({
                total: MAX.workflows,
                rate: MAX.rate,
                hp1: MAX.hours,
                hp2: MAX.hours,
                today: MAX.amount,
                mult: MAX.multiple,
                other: MAX.amount,
                kestra: MAX.amount,
                horizon: 10,
            }),
        ).payback!
        const c = paybackChart(p)
        expect(`${c.line} ${c.area} ${c.zeroY}`).not.toMatch(/NaN|Infinity/)
    })

    it("puts the renewal marker at the edge when it falls on the horizon", () => {
        const p = compute(resolveInputs({ renew: 12, horizon: 1 })).payback!
        expect(paybackChart(p).renewalX).toBe(100)
    })
})
