import { describe, expect, it } from "vitest"
import { legacyAnchorTarget } from "./legacyAnchors"

const anchors = {
    encryption: "/docs/configuration/security-and-secrets#encryption",
    "kestra-url":
        "/docs/configuration/runtime-and-storage#optional-runtime-features",
}
const missing = () => false

describe("legacyAnchorTarget", () => {
    it("maps an old anchor to its new page", () => {
        expect(legacyAnchorTarget("#kestra-url", anchors, missing)).toBe(
            "/docs/configuration/runtime-and-storage#optional-runtime-features",
        )
    })

    // The exact link in released Kestra versions (ui/src/assets/docs/basic.md).
    it("reads the id before a query inside the hash and moves the query before the #", () => {
        expect(
            legacyAnchorTarget(
                "#encryption?utm_source=app&utm_medium=referral&utm_campaign=editor-flow-doc",
                anchors,
                missing,
            ),
        ).toBe(
            "/docs/configuration/security-and-secrets?utm_source=app&utm_medium=referral&utm_campaign=editor-flow-doc#encryption",
        )
    })

    it("leaves anchors that still exist on the page alone", () => {
        expect(
            legacyAnchorTarget("#encryption", anchors, () => true),
        ).toBeNull()
    })

    it("ignores unknown, empty and malformed anchors", () => {
        expect(legacyAnchorTarget("#start-here", anchors, missing)).toBeNull()
        expect(legacyAnchorTarget("", anchors, missing)).toBeNull()
        expect(
            legacyAnchorTarget("#?utm_source=app", anchors, missing),
        ).toBeNull()
        expect(legacyAnchorTarget("#%E0%A4%A", anchors, missing)).toBeNull()
        expect(legacyAnchorTarget("#toString", anchors, missing)).toBeNull()
    })
})
