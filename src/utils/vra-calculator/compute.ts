import {
    TOO_LARGE,
    WARNINGS,
    validateFunnel,
    validatePayback,
} from "./validate"
import type { CalcInputs, InputKey } from "./defaults"
import type { FunnelValues, PaybackValues } from "./validate"

export type Buckets = [wrappers: number, medium: number, complex: number]
export type FunnelResult = ReturnType<typeof computeFunnel>
export type PaybackResult = ReturnType<typeof computePayback>

export interface CalcResult {
    errors: string[]
    warnings: string[]
    invalid: Partial<Record<InputKey, true>>
    funnel: FunnelResult | null
    payback: PaybackResult | null
}

/** Floating-point noise around an exact break-even; nearer zero counts as zero. */
const ZERO_TOLERANCE = 1e-6
const PAYBACK_SEARCH_MONTHS = 180

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

/**
 * The shares apply in sequence: dormant off the export, near-duplicates off
 * what migrates, wrappers off the distinct flows left.
 */
export function computeFunnel({
    total,
    dormant,
    dupes,
    wrappers,
}: FunnelValues) {
    const scope = Math.round(total * (1 - dormant / 100))
    const variants = Math.round((scope * dupes) / 100)
    const distinct = scope - variants
    const wrapperCount = Math.round((distinct * wrappers) / 100)
    return {
        total,
        scope,
        variants,
        distinct,
        wrappers: wrapperCount,
        careful: distinct - wrapperCount,
        dupesPct: dupes,
        wrapPct: wrappers,
    }
}

/**
 * Splits `total` in proportion to `weights` as whole numbers, largest remainder
 * first, so near-duplicates follow their originals.
 */
export function allocate(total: number, weights: number[]): number[] {
    const weightSum = sum(weights)
    if (!weightSum || !total) return weights.map(() => 0)
    const raw = weights.map((w) => (total * w) / weightSum)
    const out = raw.map(Math.floor)
    const left = Math.round(total) - sum(out)
    const order = raw
        .map((v, i) => ({ i, f: v - out[i] }))
        .sort((a, b) => b.f - a.f)
    for (let j = 0; j < left; j++) out[order[j % weights.length].i]++
    return out
}

/**
 * The highest yearly Kestra price that still breaks even after `years`, or
 * null. The licence already paid is sunk; the saving is the renewal not signed.
 */
export function breakEven(
    years: number,
    cash: Record<"avoided" | "renewInMonths" | "migrationCost", number>,
): number | null {
    const months = years * 12
    if (months <= cash.renewInMonths) return null
    const kestra =
        ((cash.avoided * (months - cash.renewInMonths)) / 12 -
            cash.migrationCost) /
        years
    return kestra > 0 ? kestra : null
}

export function computePayback(funnel: FunnelResult, v: PaybackValues) {
    const complexCount = Math.round((funnel.careful * v.complex) / 100)
    const mediumCount = funnel.careful - complexCount
    const distinctByBucket: Buckets = [
        funnel.wrappers,
        mediumCount,
        complexCount,
    ]
    const variantsByBucket = allocate(
        funnel.variants,
        distinctByBucket,
    ) as Buckets
    const variantRate = [0, v.hv1, v.hv2]
    const bucketHours = (firstRate: number[]) =>
        distinctByBucket.map(
            (d, i) => d * firstRate[i] + variantsByBucket[i] * variantRate[i],
        ) as Buckets
    const hoursByBucket = bucketHours([0, v.hp1 * (1 - v.tool / 100), v.hp2])
    const hours = sum(hoursByBucket)

    const careful = mediumCount + complexCount
    const blendedFirstRate =
        careful > 0
            ? (mediumCount * v.hp1 + complexCount * v.hp2) / careful
            : v.hp1
    const naiveHours = funnel.total * blendedFirstRate
    const migrationCost = hours * v.rate

    const renewalCost = v.today * v.mult
    const avoided = renewalCost + v.other
    const start = v.renew
    const spread = Math.max(1, start)
    const kestraAnnual = v.kestra ?? 0
    const horizonMonths = v.horizon * 12

    // Month i + 1: savings start after the renewal, migration is spread up to it.
    let run = 0
    const cumulative = Array.from(
        { length: Math.max(horizonMonths, PAYBACK_SEARCH_MONTHS) },
        (_, i) => {
            run +=
                (i >= start ? avoided / 12 : 0) -
                kestraAnnual / 12 -
                (i < spread ? migrationCost / spread : 0)
            return Math.abs(run) < ZERO_TOLERANCE ? 0 : run
        },
    )
    const paybackMonth =
        cumulative.findIndex((p, i) => p >= 0 && i >= start) + 1 || null

    const cash = { avoided, renewInMonths: start, migrationCost }
    const breakEvenValue = v.kestraBlank ? breakEven(v.horizon, cash) : null
    const paybackStatus: "within-horizon" | "past-horizon" | "none" =
        paybackMonth === null
            ? "none"
            : paybackMonth <= horizonMonths
              ? "within-horizon"
              : "past-horizon"

    return {
        distinctByBucket,
        variantsByBucket,
        hoursByBucket,
        hours,
        manualHours: sum(bucketHours([0, v.hp1, v.hp2])),
        naiveHours,
        rate: v.rate,
        migrationCost,
        saved: (naiveHours - hours) * v.rate,
        avoided,
        renewalCost,
        otherCost: v.other,
        renewInMonths: v.renew,
        horizonYears: v.horizon,
        horizonMonths,
        kestraBlank: v.kestraBlank,
        kestraAnnual,
        cumulative,
        paybackMonth,
        paybackYear: paybackMonth && Math.ceil(paybackMonth / 12),
        paybackStatus,
        net: cumulative[horizonMonths - 1],
        yearly: Array.from(
            { length: v.horizon },
            (_, y) => cumulative[y * 12 + 11],
        ),
        breakEven: breakEvenValue,
        breakEvenAlt:
            v.kestraBlank && breakEvenValue === null
                ? breakEven(v.horizon + 2, cash)
                : null,
        toolPct: v.tool,
        complexPct: v.complex,
        reductionPct:
            naiveHours > 0 ? Math.round((1 - hours / naiveHours) * 100) : 0,
    }
}

/**
 * As in the reference, payback inputs are validated only once the funnel's
 * are valid, and warnings only appear when there are no errors.
 */
export function compute(inputs: CalcInputs): CalcResult {
    const fail = (
        { errors, invalid }: Pick<CalcResult, "errors" | "invalid">,
        funnel: FunnelResult | null = null,
    ): CalcResult => ({ errors, warnings: [], invalid, funnel, payback: null })

    const funnelCheck = validateFunnel(inputs)
    if (!funnelCheck.values) return fail(funnelCheck)
    const funnel = computeFunnel(funnelCheck.values)

    const paybackCheck = validatePayback(inputs)
    if (!paybackCheck.values) return fail(paybackCheck, funnel)
    const payback = computePayback(funnel, paybackCheck.values)
    const finite = Object.values(payback)
        .flat()
        .every((x) => typeof x !== "number" || Number.isFinite(x))
    if (!finite)
        return fail({ errors: [TOO_LARGE.result], invalid: {} }, funnel)

    const warnings: string[] = []
    if (funnel.total === 0) warnings.push(WARNINGS.noWorkflows)
    if (payback.avoided === 0) warnings.push(WARNINGS.noRenewal)
    return { errors: [], warnings, invalid: {}, funnel, payback }
}
