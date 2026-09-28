import { computeFunnel } from "./funnel"
import { computePayback } from "./payback"
import type { CalcInputs, CalcResult } from "./types"
import { WARNINGS, validateFunnel, validatePayback } from "./validate"

/**
 * One state, both views. The funnel (3.2.2) needs only the four workflow
 * inputs; the payback (7.2) needs everything. As in the reference, payback
 * inputs are only validated once the funnel inputs are valid, and warnings
 * only appear when there are no errors.
 */
export function compute(inputs: CalcInputs): CalcResult {
    const funnelCheck = validateFunnel(inputs)
    if (!funnelCheck.values) {
        return {
            errors: funnelCheck.errors,
            warnings: [],
            invalid: funnelCheck.invalid,
            funnel: null,
            payback: null,
        }
    }
    const funnel = computeFunnel(funnelCheck.values)

    const paybackCheck = validatePayback(inputs)
    if (!paybackCheck.values) {
        return {
            errors: paybackCheck.errors,
            warnings: [],
            invalid: paybackCheck.invalid,
            funnel,
            payback: null,
        }
    }
    const payback = computePayback(funnel, paybackCheck.values)

    const warnings: string[] = []
    if (funnel.total === 0) warnings.push(WARNINGS.noWorkflows)
    if (payback.avoided === 0) warnings.push(WARNINGS.noRenewal)

    return { errors: [], warnings, invalid: {}, funnel, payback }
}
