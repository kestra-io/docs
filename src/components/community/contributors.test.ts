import { describe, expect, it } from "vitest"
import { rankContributors } from "~/components/community/contributors"

const contributor = (name: string, count?: number) => ({
    name,
    avatar: `https://avatars.githubusercontent.com/${name}`,
    count: count as number,
})

describe("rankContributors", () => {
    it("sorts by contribution count, highest first", () => {
        const ranked = rankContributors([
            contributor("low", 3),
            contributor("high", 30),
            contributor("mid", 12),
        ])
        expect(ranked.map((c) => c.name)).toEqual(["high", "mid", "low"])
    })

    it("hides GitHub App accounts", () => {
        const ranked = rankContributors([
            contributor("human", 5),
            contributor("dependabot[bot]", 500),
            contributor("robot-fan", 2),
        ])
        expect(ranked.map((c) => c.name)).toEqual(["human", "robot-fan"])
    })

    it("treats a missing count as zero and leaves the input untouched", () => {
        const input = [contributor("unknown"), contributor("one", 1)]
        const ranked = rankContributors(input)
        expect(ranked.map((c) => c.name)).toEqual(["one", "unknown"])
        expect(input.map((c) => c.name)).toEqual(["unknown", "one"])
    })
})
