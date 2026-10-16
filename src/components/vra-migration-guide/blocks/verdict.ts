// The four verdicts of the estate framework (section 3.1.1), shared by the
// Verdict chip and the markdown endpoint.
export type VerdictKind = "replace" | "integrate" | "keep" | "retire"

export const VERDICT_LABELS: Record<VerdictKind, string> = {
    replace: "Replace",
    integrate: "Integrate",
    keep: "Keep",
    retire: "Retire",
}
