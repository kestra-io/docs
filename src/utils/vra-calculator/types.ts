// Types for the vRA to Kestra migration payback calculator engine. The
// behavioral source of truth is the product team's reference implementation;
// golden outputs captured from it live in __fixtures__/reference-golden.json.

export type Currency = "EUR" | "USD" | "GBP"

export type InputValue = number | string | null

export interface CalcInputs {
    total: InputValue
    dormant: InputValue
    dupes: InputValue
    wrappers: InputValue
    complex: InputValue
    tool: InputValue
    rate: InputValue
    cur: Currency
    today: InputValue
    mult: InputValue
    other: InputValue
    renew: InputValue
    kestra: InputValue
    horizon: InputValue
    hp1: InputValue
    hp2: InputValue
    hv1: InputValue
    hv2: InputValue
}

export type InputKey = keyof CalcInputs
export type NumericInputKey = Exclude<InputKey, "cur">

export type Buckets = [wrappers: number, medium: number, complex: number]

export interface FunnelResult {
    total: number
    scope: number
    variants: number
    distinct: number
    wrappers: number
    careful: number
    dupesPct: number
    wrapPct: number
}

export type PaybackStatus = "within-horizon" | "past-horizon" | "none"

export interface PaybackResult {
    distinctByBucket: Buckets
    variantsByBucket: Buckets
    hoursByBucket: Buckets
    hours: number
    manualHours: number
    naiveHours: number
    rate: number
    migrationCost: number
    saved: number
    avoided: number
    renewalCost: number
    otherCost: number
    renewInMonths: number
    horizonYears: number
    horizonMonths: number
    kestraBlank: boolean
    kestraAnnual: number
    cumulative: number[]
    paybackMonth: number | null
    paybackYear: number | null
    paybackStatus: PaybackStatus
    net: number
    yearly: number[]
    breakEven: number | null
    breakEvenAlt: number | null
    toolPct: number
    complexPct: number
    reductionPct: number
}

export interface CalcResult {
    errors: string[]
    warnings: string[]
    invalid: Partial<Record<InputKey, true>>
    funnel: FunnelResult | null
    payback: PaybackResult | null
}
