import { describe, expect, it } from "vitest"

import { pickAwxHeadline, resolveAwxVariant } from "./awxVariant"
import keywords from "./g-awx-keywords.fixture.json"

/* The 61 keywords of the G_AWX Google Ads campaign, each with the ad group it
 * was bought in. Every one must land on that ad group's headline. */
describe("pickAwxHeadline", () => {
    it.each(keywords)(
        "routes “$keyword” to $adGroup",
        ({ keyword, adGroup }) => {
            expect(pickAwxHeadline(keyword)).toBe(adGroup)
        },
    )

    it("ignores case", () => {
        expect(pickAwxHeadline("AWX Alternative")).toBe("awx")
    })

    it("returns null for an unrelated term", () => {
        expect(pickAwxHeadline("terraform drift detection")).toBeNull()
    })
})

describe("resolveAwxVariant", () => {
    const suffix = "?utm_source=google&utm_medium=cpc&utm_campaign=g_awx"

    it("keeps the default page without G_AWX parameters", () => {
        expect(resolveAwxVariant("")).toBeNull()
        expect(
            resolveAwxVariant("?utm_source=linkedin&utm_campaign=infra_launch"),
        ).toBeNull()
    })

    it("keeps the default page for a plain Ansible search from another campaign", () => {
        expect(
            resolveAwxVariant("?utm_campaign=g_head&utm_term=ansible%20ui"),
        ).toBeNull()
    })

    it("picks the headline from utm_term", () => {
        expect(
            resolveAwxVariant(
                `${suffix}&utm_term=ansible%20tower%20alternative`,
            ),
        ).toBe("tower")
        expect(
            resolveAwxVariant(`${suffix}&utm_term=ansible+orchestration`),
        ).toBe("orchestrate")
    })

    it("falls back to the AWX headline when G_AWX sends no term", () => {
        expect(resolveAwxVariant(suffix)).toBe("awx")
        expect(resolveAwxVariant(`${suffix}&utm_term=something%20else`)).toBe(
            "awx",
        )
    })

    it("applies to an AWX search tagged by another campaign", () => {
        expect(
            resolveAwxVariant(
                "?utm_campaign=newsletter&utm_term=awx%20vs%20aap",
            ),
        ).toBe("compare")
    })
})
