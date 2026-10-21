import type { Currency } from "./format"

export type InputValue = number | string | null

const VALUES = {
    total: 400,
    dormant: 15,
    dupes: 50,
    wrappers: 25,
    complex: 20,
    tool: 55,
    rate: 100,
    cur: "EUR" as Currency,
    today: 500000,
    mult: 3,
    other: 0,
    renew: 12,
    kestra: "",
    horizon: 3,
    hp1: 20,
    hp2: 40,
    hv1: 1,
    hv2: 3,
}

export type InputKey = keyof typeof VALUES
export type NumericInputKey = Exclude<InputKey, "cur">
export type CalcInputs = Record<NumericInputKey, InputValue> & { cur: Currency }

/**
 * The 55% tool share is an unmeasured placeholder the UI asks visitors to
 * replace. `cur` is a fallback until `currencyFromLocale` runs.
 */
export const DEFAULTS: Readonly<CalcInputs> = Object.freeze(VALUES)

export const INPUT_KEYS = Object.keys(DEFAULTS) as InputKey[]

export const RENEWAL_MULTIPLE_PRESETS = [2, 3, 5] as const

export const TOOL_SHARE_RANGE = Object.freeze({ min: 0, max: 90, step: 5 })

export const MAX = Object.freeze({
    workflows: 1_000_000,
    amount: 10_000_000_000,
    multiple: 100,
    rate: 100_000,
    hours: 10_000,
})

export const STORAGE_KEY = "kestra-vra-calc-v1"

export const SHARE_PARAM = "kvc"

/**
 * Fills missing keys with defaults, like the reference's `load()`. Present keys
 * are kept as-is, blank or invalid, so validation can report them.
 */
export function resolveInputs(source?: Partial<CalcInputs> | null): CalcInputs {
    return { ...DEFAULTS, ...source }
}
