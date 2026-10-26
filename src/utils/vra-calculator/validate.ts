import { MAX } from "./defaults"
import type { CalcResult } from "./compute"
import type { CalcInputs, InputValue, NumericInputKey } from "./defaults"

export const MESSAGES = Object.freeze({
    total: "Enter the number of vRO workflows as a whole number.",
    dormant: "The share not executed has to be between 0 and 100 percent.",
    dupes: "The near-duplicate share has to be between 0 and 99 percent.",
    wrappers: "The wrapper share has to be between 0 and 100 percent.",
    complex: "The complex share has to be between 0 and 100 percent.",
    tool: "The Migration Assistant share has to be between 0 and 100 percent.",
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

const tooLarge = (what: string) =>
    `${what} is too large to estimate with. Check for extra digits.`

export const TOO_LARGE = Object.freeze({
    total: tooLarge("The number of vRO workflows"),
    rate: tooLarge("The blended hourly rate"),
    hours: tooLarge("An effort figure"),
    today: tooLarge("The annual vRA and vRO spend"),
    mult: tooLarge("The renewal multiple"),
    other: tooLarge("The other annual costs figure"),
    kestra: tooLarge("The Kestra figure"),
    result: "These numbers are too large to estimate with. Check for extra digits.",
})

export const WARNINGS = Object.freeze({
    noWorkflows: "Enter a workflow count to size the migration.",
    noRenewal:
        "With no renewal cost entered, there is nothing for the migration to pay back against.",
})

const DECIMAL = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i

function isBlank(value: InputValue | undefined): boolean {
    return value === "" || value === null || value === undefined
}

/** The reference's `val()`: blank or non-finite values become null. */
export function toNumber(value: InputValue | undefined): number | null {
    if (isBlank(value)) return null
    // Decimal only: `Number()` also accepts "0x1F" or "0b11" from a crafted link.
    if (typeof value === "string" && !DECIMAL.test(value.trim())) return null
    const n = Number(value)
    return Number.isFinite(n) ? n : null
}

const isPercent = (n: number) => n <= 100
const unbounded = () => true

/**
 * A field's range check and optional size cap, checked only once the range
 * passes. Every value must also be zero or more.
 */
type Rule = [
    message: string,
    ok: (n: number) => boolean,
    cap?: [max: number, message: string],
]

/** One message per invalid hour field, as in the reference. */
const HOURS: Rule = [MESSAGES.hours, unbounded, [MAX.hours, TOO_LARGE.hours]]

/** Key order is the reference's error order: four funnel fields, then payback. */
const RULES: Record<NumericInputKey, Rule> = {
    total: [MESSAGES.total, Number.isInteger, [MAX.workflows, TOO_LARGE.total]],
    dormant: [MESSAGES.dormant, isPercent],
    dupes: [MESSAGES.dupes, (n) => n < 100],
    wrappers: [MESSAGES.wrappers, isPercent],
    complex: [MESSAGES.complex, isPercent],
    tool: [MESSAGES.tool, isPercent],
    rate: [MESSAGES.rate, unbounded, [MAX.rate, TOO_LARGE.rate]],
    hp1: HOURS,
    hp2: HOURS,
    hv1: HOURS,
    hv2: HOURS,
    today: [MESSAGES.today, unbounded, [MAX.amount, TOO_LARGE.today]],
    mult: [MESSAGES.mult, unbounded, [MAX.multiple, TOO_LARGE.mult]],
    other: [MESSAGES.other, unbounded, [MAX.amount, TOO_LARGE.other]],
    renew: [MESSAGES.renew, (n) => n <= 60 && Number.isInteger(n)],
    horizon: [
        MESSAGES.horizon,
        (n) => n >= 1 && n <= 10 && Number.isInteger(n),
    ],
    kestra: [MESSAGES.kestra, unbounded, [MAX.amount, TOO_LARGE.kestra]],
}

const KEYS = Object.keys(RULES) as NumericInputKey[]

export type FunnelValues = Record<
    "total" | "dormant" | "dupes" | "wrappers",
    number
>

export type PaybackValues = Record<
    Exclude<NumericInputKey, keyof FunnelValues | "kestra">,
    number
> & {
    kestraBlank: boolean
    /** null when blank */
    kestra: number | null
}

interface Validation<T> extends Pick<CalcResult, "errors" | "invalid"> {
    values: T | null
}

function validate(
    inputs: CalcInputs,
    keys: NumericInputKey[],
): Validation<Partial<Record<NumericInputKey, number>>> {
    const errors: string[] = []
    const invalid: CalcResult["invalid"] = {}
    const values: Partial<Record<NumericInputKey, number>> = {}
    const fail = (key: NumericInputKey, message: string) => {
        errors.push(message)
        invalid[key] = true
    }
    for (const key of keys) {
        const [message, ok, cap] = RULES[key]
        const n = toNumber(inputs[key])
        if (n === null || n < 0 || !ok(n)) fail(key, message)
        else if (cap && n > cap[0]) fail(key, cap[1])
        else values[key] = n
    }
    return { errors, invalid, values: errors.length ? null : values }
}

export function validateFunnel(inputs: CalcInputs): Validation<FunnelValues> {
    return validate(inputs, KEYS.slice(0, 4)) as Validation<FunnelValues>
}

/** A blank Kestra figure is skipped rather than flagged: it means no quote yet. */
export function validatePayback(inputs: CalcInputs): Validation<PaybackValues> {
    const kestraBlank = isBlank(inputs.kestra)
    const { errors, invalid, values } = validate(
        inputs,
        KEYS.slice(4, kestraBlank ? -1 : undefined),
    )
    return {
        errors,
        invalid,
        values: values && {
            ...(values as PaybackValues),
            kestraBlank,
            kestra: values.kestra ?? null,
        },
    }
}
