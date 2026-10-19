import type { CalcInputs, InputKey } from "./types"

/**
 * Starting assumptions. Hour rates are manual conversion hours. Wrappers
 * migrate at no cost. The Migration Assistant share reduces medium
 * first-of-a-kind hours; complex work stays at the manual rate. The 55% share
 * is a placeholder with no measured source: the UI tells the visitor to
 * replace it with the share measured in their proof of concept.
 *
 * `cur` is the fallback only: the UI picks the visitor's currency with
 * `currencyFromLocale` before first render.
 */
export const DEFAULTS: Readonly<CalcInputs> = Object.freeze({
    total: 400,
    dormant: 15,
    dupes: 50,
    wrappers: 25,
    complex: 20,
    tool: 55,
    rate: 100,
    cur: "EUR",
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
})

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

export const PAYBACK_SEARCH_MONTHS = 180

export const STORAGE_KEY = "kestra-vra-calc-v1"

export const SHARE_PARAM = "kvc"

/**
 * Fills every key missing from `source` with its default, the way the
 * reference's `load()` does. Keys present in `source` are kept as they are,
 * including blank or invalid values, so validation can report them.
 */
export function resolveInputs(source?: Partial<CalcInputs> | null): CalcInputs {
    const out = {} as Record<InputKey, unknown>
    for (const key of INPUT_KEYS) {
        out[key] = source && key in source ? source[key] : DEFAULTS[key]
    }
    return out as unknown as CalcInputs
}
