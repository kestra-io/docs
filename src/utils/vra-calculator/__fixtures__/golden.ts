// Typed access to reference-golden.json: outputs recorded by running the
// reference calculator, unmodified, in a Node vm sandbox on 2026-09-28 (see
// `_source` and `_referenceSha256` in the JSON). Result objects keep the
// reference's own field names; compute.test.ts maps the port onto them.
import golden from "./reference-golden.json"
import type { CalcInputs } from "../types"

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
