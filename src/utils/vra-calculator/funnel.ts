import type { FunnelResult } from "./types"
import type { FunnelValues } from "./validate"

/**
 * Section 3.2.2. The percentages apply in sequence: dormant comes off the
 * export, near-duplicates are a share of what migrates, and wrappers are a
 * share of the distinct flows left.
 */
export function computeFunnel({
    total,
    dormant,
    dupes,
    wrappers,
}: FunnelValues): FunnelResult {
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
