/**
 * Compare two semver-ish version strings ("1.3.20", "1.10.2") for descending sort.
 *
 * Sorting plugin/Kestra releases by date is wrong for repos with parallel release lines: e.g. a
 * recent 1.1.x patch would otherwise sort above an older-but-higher 1.3.x, so the dropdown would
 * list versions out of numeric order. Numeric per-segment comparison fixes that, and treats a
 * missing/non-numeric segment as 0 (so "1.3" and "1.3.0" compare equal).
 */
export function compareVersionsDesc(a: string, b: string): number {
    const partsA = a.split(".").map((n) => parseInt(n, 10) || 0)
    const partsB = b.split(".").map((n) => parseInt(n, 10) || 0)
    const len = Math.max(partsA.length, partsB.length)
    for (let i = 0; i < len; i++) {
        const diff = (partsB[i] ?? 0) - (partsA[i] ?? 0)
        if (diff !== 0) return diff
    }
    return 0
}

/**
 * True for a release version, false for a pre-release ("2.0.0-rc9", "0.5.0-BETA").
 *
 * The version lists we build feed both the dropdown and "what is latest?", and pre-releases must be
 * in neither: compareVersionsDesc parses "0-rc9" as 0, so "2.0.0-rc9" ties with "2.0.0" and a stable
 * sort can leave the RC first, marking the real release archived.
 */
export function isStableVersion(version: string): boolean {
    return !version.includes("-")
}
