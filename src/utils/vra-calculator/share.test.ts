import { describe, expect, it } from "vitest"
import { GOLDEN } from "./__fixtures__/golden"
import { resolveInputs } from "./defaults"
import { MAX_SHARE_LENGTH, decodeShareState, encodeShareState } from "./share"

// Payloads encoded independently of the module under test.
const craft = (data: unknown) =>
    Buffer.from(JSON.stringify(data)).toString("base64url")

describe("share links", () => {
    it("decode a link made by the reference encoder", () => {
        expect(resolveInputs(decodeShareState(GOLDEN.share.encoded))).toEqual(
            GOLDEN.share.decoded,
        )
    })

    it("encode the reference's state to the reference's payload, unpadded base64url", () => {
        const reference = Buffer.from(
            decodeURIComponent(GOLDEN.share.encoded),
            "base64",
        ).toString("base64url")
        expect(encodeShareState(resolveInputs(GOLDEN.share.decoded))).toBe(
            reference,
        )
    })

    it("round-trip blanks, strings and non-ASCII text like Node's base64url", () => {
        const state = resolveInputs({
            total: "4 000 €",
            kestra: "",
            cur: "USD",
            mult: 3.5,
            horizon: null,
        })
        expect(encodeShareState(state)).toBe(craft(state))
        expect(decodeShareState(encodeShareState(state))).toEqual(state)
    })

    it("drop unknown keys, currencies and wrong types, but keep out-of-range numbers", () => {
        const decoded = decodeShareState(
            craft({
                total: 50,
                horizon: 99,
                cur: "JPY",
                evil: "<script>",
                rate: { x: 1 },
                dupes: [1],
                tool: true,
                today: "x".repeat(40),
            }),
        )
        expect(decoded).toEqual({ total: 50, horizon: 99 })
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
