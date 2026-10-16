import { describe, expect, it } from "vitest"
import { GOLDEN } from "./__fixtures__/golden"
import { DEFAULTS, resolveInputs } from "./defaults"
import { MAX_SHARE_LENGTH, decodeShareState, encodeShareState } from "./share"

describe("share links", () => {
    it("decode a link made by the reference encoder to the reference's decoded state", () => {
        expect(resolveInputs(decodeShareState(GOLDEN.share.encoded))).toEqual(
            GOLDEN.share.decoded,
        )
    })

    it("round-trip the full state, blanks and strings included", () => {
        const state = resolveInputs({
            total: "1234",
            kestra: "",
            cur: "USD",
            mult: 3.5,
            horizon: null,
        })
        const encoded = encodeShareState(state)
        expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/)
        expect(decodeShareState(encoded)).toEqual(state)
    })

    it("carry the same JSON payload as the reference", () => {
        const state = resolveInputs(GOLDEN.share.decoded)
        const reference = decodeURIComponent(GOLDEN.share.encoded).replace(
            /=+$/,
            "",
        )
        const ours = encodeShareState(state)
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        expect(ours).toBe(reference)
    })

    it("round-trip non-ASCII text", () => {
        const state = resolveInputs({ total: "4 000 €" })
        expect(decodeShareState(encodeShareState(state))?.total).toBe("4 000 €")
    })

    // Hand-crafted payloads, encoded independently of the module under test.
    const craft = (data: unknown) =>
        Buffer.from(JSON.stringify(data)).toString("base64url")

    it("drop unknown keys, unknown currencies and wrong-typed values", () => {
        const decoded = decodeShareState(
            craft({
                total: 50,
                cur: "JPY",
                evil: "<script>",
                rate: { x: 1 },
                dupes: [1],
                tool: true,
                today: "x".repeat(40),
            }),
        )
        expect(decoded).toEqual({ total: 50 })
        expect(resolveInputs(decoded).cur).toBe(DEFAULTS.cur)
    })

    it("keep out-of-range numbers so validation can flag them", () => {
        expect(decodeShareState(craft({ horizon: 99 }))).toEqual({
            horizon: 99,
        })
    })

    it("agree with Node's base64url on arbitrary payloads", () => {
        const state = resolveInputs({ total: 7, cur: "GBP", kestra: "12000" })
        expect(encodeShareState(state)).toBe(craft(state))
    })

    it.each([
        ["empty", ""],
        ["null", null],
        ["not base64", "***"],
        ["base64 of non-JSON", Buffer.from("hello").toString("base64url")],
        ["JSON array", craft([1, 2])],
        ["JSON number", craft(42)],
        [
            "invalid UTF-8",
            Buffer.from([0xff, 0xfe, 0xfd]).toString("base64url"),
        ],
        ["too long", "A".repeat(MAX_SHARE_LENGTH + 1)],
    ])("return null for %s", (_label, param) => {
        expect(decodeShareState(param)).toBeNull()
    })
})
