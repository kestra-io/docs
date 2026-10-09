import type { CalcInputs, InputKey, InputValue, NumericInputKey } from "./types"

export const MESSAGES = Object.freeze({
    total: "Enter the number of vRO workflows as a whole number.",
    dormant: "The share not executed has to be between 0 and 100 percent.",
    dupes: "The near-duplicate share has to be between 0 and 99 percent.",
    wrappers: "The wrapper share has to be between 0 and 100 percent.",
    complex: "The complex share has to be between 0 and 100 percent.",
    tool: "The migration tool share has to be between 0 and 100 percent.",
    rate: "Enter a blended hourly rate of zero or more.",
    hours: "Effort hours have to be zero or more.",
    today: "Enter your annual vRA and vRO spend, zero or more.",
    mult: "The renewal multiple has to be zero or more.",
    other: "Other annual costs have to be zero or more.",
    renew: "Months until the renewal has to be a whole number from 0 to 60.",
    horizon:
        "The planning horizon has to be a whole number of years from 1 to 10.",
    kestra: "The Kestra figure has to be zero or more.",
})

export const WARNINGS = Object.freeze({
    noWorkflows: "Enter a workflow count to size the migration.",
    noRenewal:
        "With no renewal cost entered, there is nothing for the migration to pay back against.",
})

/**
 * The reference's `val()`: blank (`""`, `null`, `undefined`) and anything that
 * is not a finite number become null.
 */
export function toNumber(value: InputValue | undefined): number | null {
    if (value === "" || value === null || value === undefined) return null
    const n = Number(value)
    return Number.isFinite(n) ? n : null
}

export function isBlank(value: InputValue | undefined): boolean {
    return value === "" || value === null || value === undefined
}

const isWhole = (n: number) => Math.floor(n) === n

export interface FunnelValues {
    total: number
    dormant: number
    dupes: number
    wrappers: number
}

export interface PaybackValues {
    complex: number
    tool: number
    rate: number
    hp1: number
    hp2: number
    hv1: number
    hv2: number
    today: number
    mult: number
    other: number
    renew: number
    horizon: number
    kestraBlank: boolean
    /** null when blank */
    kestra: number | null
}

export interface Validation<T> {
    errors: string[]
    invalid: Partial<Record<InputKey, true>>
    values: T | null
}

function collector() {
    const errors: string[] = []
    const invalid: Partial<Record<InputKey, true>> = {}
    const need = (key: InputKey, message: string, ok: boolean) => {
        if (!ok) {
            errors.push(message)
            invalid[key] = true
        }
    }
    return { errors, invalid, need }
}

export function validateFunnel(inputs: CalcInputs): Validation<FunnelValues> {
    const { errors, invalid, need } = collector()
    const total = toNumber(inputs.total)
    const dormant = toNumber(inputs.dormant)
    const dupes = toNumber(inputs.dupes)
    const wrappers = toNumber(inputs.wrappers)

    need(
        "total",
        MESSAGES.total,
        total !== null && total >= 0 && isWhole(total),
    )
    need(
        "dormant",
        MESSAGES.dormant,
        dormant !== null && dormant >= 0 && dormant <= 100,
    )
    need("dupes", MESSAGES.dupes, dupes !== null && dupes >= 0 && dupes < 100)
    need(
        "wrappers",
        MESSAGES.wrappers,
        wrappers !== null && wrappers >= 0 && wrappers <= 100,
    )

    if (errors.length) return { errors, invalid, values: null }
    return {
        errors,
        invalid,
        values: {
            total: total as number,
            dormant: dormant as number,
            dupes: dupes as number,
            wrappers: wrappers as number,
        },
    }
}

export function validatePayback(inputs: CalcInputs): Validation<PaybackValues> {
    const { errors, invalid, need } = collector()

    const complex = toNumber(inputs.complex)
    const tool = toNumber(inputs.tool)
    const rate = toNumber(inputs.rate)
    need(
        "complex",
        MESSAGES.complex,
        complex !== null && complex >= 0 && complex <= 100,
    )
    need("tool", MESSAGES.tool, tool !== null && tool >= 0 && tool <= 100)
    need("rate", MESSAGES.rate, rate !== null && rate >= 0)

    // One message per invalid hour field, as in the reference.
    const hourKeys: NumericInputKey[] = ["hp1", "hp2", "hv1", "hv2"]
    const hours = hourKeys.map((key) => {
        const n = toNumber(inputs[key])
        need(key, MESSAGES.hours, n !== null && n >= 0)
        return n
    })

    const today = toNumber(inputs.today)
    const mult = toNumber(inputs.mult)
    const other = toNumber(inputs.other)
    const renew = toNumber(inputs.renew)
    const horizon = toNumber(inputs.horizon)
    const kestraBlank = isBlank(inputs.kestra)
    const kestra = kestraBlank ? null : toNumber(inputs.kestra)

    need("today", MESSAGES.today, today !== null && today >= 0)
    need("mult", MESSAGES.mult, mult !== null && mult >= 0)
    need("other", MESSAGES.other, other !== null && other >= 0)
    need(
        "renew",
        MESSAGES.renew,
        renew !== null && renew >= 0 && renew <= 60 && isWhole(renew),
    )
    need(
        "horizon",
        MESSAGES.horizon,
        horizon !== null && horizon >= 1 && horizon <= 10 && isWhole(horizon),
    )
    if (!kestraBlank)
        need("kestra", MESSAGES.kestra, kestra !== null && kestra >= 0)

    if (errors.length) return { errors, invalid, values: null }
    const [hp1, hp2, hv1, hv2] = hours as number[]
    return {
        errors,
        invalid,
        values: {
            complex: complex as number,
            tool: tool as number,
            rate: rate as number,
            hp1,
            hp2,
            hv1,
            hv2,
            today: today as number,
            mult: mult as number,
            other: other as number,
            renew: renew as number,
            horizon: horizon as number,
            kestraBlank,
            kestra,
        },
    }
}
