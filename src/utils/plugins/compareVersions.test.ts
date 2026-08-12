import { describe, it, expect } from "vitest"
import { compareVersionsDesc } from "~/utils/plugins/compareVersions"

describe("compareVersionsDesc", () => {
    it("sorts descending by numeric semver, not lexically", () => {
        const sorted = ["1.3.2", "1.10.2", "1.3.20", "2.0.0"].toSorted(compareVersionsDesc)
        expect(sorted).toEqual(["2.0.0", "1.10.2", "1.3.20", "1.3.2"])
    })

    it("orders parallel release lines by number, not by where they interleave", () => {
        // the bug this fixes: a recent 1.1.x must not sort above an older-but-higher 1.3.x
        const sorted = ["1.1.20", "1.3.19", "1.0.44", "1.3.20"].toSorted(compareVersionsDesc)
        expect(sorted).toEqual(["1.3.20", "1.3.19", "1.1.20", "1.0.44"])
    })

    it("treats a missing trailing segment as 0 (1.3 == 1.3.0)", () => {
        expect(compareVersionsDesc("1.3", "1.3.0")).toBe(0)
    })

    it("returns 0 for equal versions", () => {
        expect(compareVersionsDesc("2.6.0", "2.6.0")).toBe(0)
    })
})
