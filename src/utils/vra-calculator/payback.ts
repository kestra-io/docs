import { PAYBACK_SEARCH_MONTHS } from "./defaults"
import type {
    Buckets,
    FunnelResult,
    PaybackResult,
    PaybackStatus,
} from "./types"
import type { PaybackValues } from "./validate"

/**
 * Splits `total` across buckets in proportion to `weights`, as whole numbers
 * that add up to `total` (largest remainder first). Near-duplicates follow
 * their originals this way.
 */
export function allocate(total: number, weights: number[]): number[] {
    const sum = weights.reduce((a, b) => a + b, 0)
    if (!sum || !total) return weights.map(() => 0)
    const raw = weights.map((w) => (total * w) / sum)
    const out = raw.map(Math.floor)
    const left = Math.round(total) - out.reduce((a, b) => a + b, 0)
    const order = raw
        .map((v, i) => ({ i, f: v - out[i] }))
        .sort((a, b) => b.f - a.f)
    for (let j = 0; j < left; j++) out[order[j % weights.length].i]++
    return out
}

/**
 * The most Kestra could cost a year and still break even after `years`, or
 * null when there is no such price. The licence already paid is sunk; the
 * saving is the renewal not signed.
 */
export function breakEven(
    years: number,
    {
        avoided,
        renewInMonths,
        migrationCost,
    }: { avoided: number; renewInMonths: number; migrationCost: number },
): number | null {
    const months = years * 12
    if (months <= renewInMonths) return null
    const kestra =
        ((avoided * (months - renewInMonths)) / 12 - migrationCost) / years
    return kestra > 0 ? kestra : null
}

export function computePayback(
    funnel: FunnelResult,
    v: PaybackValues,
): PaybackResult {
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
    const toolFactor = 1 - v.tool / 100
    const firstRate = [0, v.hp1, v.hp2]
    const variantRate = [0, v.hv1, v.hv2]
    const firstRateWithTool = [0, v.hp1 * toolFactor, v.hp2]

    let hours = 0
    let manualHours = 0
    const hoursByBucket: Buckets = [0, 0, 0]
    for (let i = 0; i < 3; i++) {
        const h =
            distinctByBucket[i] * firstRateWithTool[i] +
            variantsByBucket[i] * variantRate[i]
        hoursByBucket[i] = h
        hours += h
        manualHours +=
            distinctByBucket[i] * firstRate[i] +
            variantsByBucket[i] * variantRate[i]
    }

    const blendedFirstRate =
        mediumCount + complexCount > 0
            ? (mediumCount * v.hp1 + complexCount * v.hp2) /
              (mediumCount + complexCount)
            : v.hp1
    const naiveHours = funnel.total * blendedFirstRate
    const migrationCost = hours * v.rate

    const renewalCost = v.today * v.mult
    const avoided = renewalCost + v.other
    const start = v.renew
    const spread = Math.max(1, start)
    const kestraAnnual = v.kestra === null ? 0 : v.kestra
    const horizonMonths = v.horizon * 12
    const searchMonths = Math.max(horizonMonths, PAYBACK_SEARCH_MONTHS)

    const cumulative: number[] = []
    let run = 0
    let paybackMonth: number | null = null
    for (let m = 1; m <= searchMonths; m++) {
        run +=
            (m > start ? avoided / 12 : 0) -
            kestraAnnual / 12 -
            (m <= spread ? migrationCost / spread : 0)
        cumulative.push(run)
        if (paybackMonth === null && run >= 0 && m > start) paybackMonth = m
    }

    const cash = { avoided, renewInMonths: start, migrationCost }
    const breakEvenValue = v.kestraBlank ? breakEven(v.horizon, cash) : null
    const breakEvenAlt =
        v.kestraBlank && breakEvenValue === null
            ? breakEven(v.horizon + 2, cash)
            : null

    const yearly: number[] = []
    for (let y = 1; y <= v.horizon; y++) yearly.push(cumulative[y * 12 - 1])

    const paybackStatus: PaybackStatus =
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
        manualHours,
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
        paybackYear:
            paybackMonth === null ? null : Math.ceil(paybackMonth / 12),
        paybackStatus,
        net: cumulative[horizonMonths - 1],
        yearly,
        breakEven: breakEvenValue,
        breakEvenAlt,
        toolPct: v.tool,
        complexPct: v.complex,
        reductionPct:
            naiveHours > 0 ? Math.round((1 - hours / naiveHours) * 100) : 0,
    }
}
