import golden from "./reference-golden.json"
import type { CalcInputs } from "../defaults"

export interface ReferenceResult {
    err: string[]
    warn: string[]
    bad: Record<string, number>
    funnelOk: boolean
    payOk: boolean
    [field: string]: unknown
}

export interface GoldenCase {
    name: string
    note: string
    state: CalcInputs
    result: ReferenceResult
    csv: string
}

/**
 * Outputs recorded from the unmodified reference calculator (see `_source`);
 * results keep its field names, which compute.test.ts maps onto the port.
 */
export const GOLDEN = golden as unknown as {
    _source: string
    _referenceSha256: string
    _csvGeneratedDate: string
    defaults: CalcInputs
    cases: GoldenCase[]
    money: { cur: string; n: number; s: string }[]
    alloc: { total: number; w: number[]; out: number[] }[]
    share: { encoded: string; decoded: CalcInputs }
}
