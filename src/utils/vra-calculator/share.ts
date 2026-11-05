import { INPUT_KEYS } from "./defaults"
import { isCurrency } from "./format"
import type { CalcInputs, InputKey } from "./defaults"

const BASE64URL =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

export const MAX_SHARE_LENGTH = 2048
const MAX_STRING_VALUE = 32

/**
 * Every input as unpadded base64url JSON, which needs no percent-encoding in a
 * URL. Built from a bit string because the engine may not use btoa or TextEncoder.
 */
export function encodeShareState(inputs: CalcInputs): string {
    const json = JSON.stringify(
        Object.fromEntries(INPUT_KEYS.map((key) => [key, inputs[key]])),
    )
    // Each %XX escape is one UTF-8 byte; every other character is ASCII.
    const bits = encodeURIComponent(json).replace(/%(..)|./g, (c, hex) =>
        (hex ? parseInt(hex, 16) : c.charCodeAt(0))
            .toString(2)
            .padStart(8, "0"),
    )
    return bits.replace(
        /.{1,6}/g,
        (b) => BASE64URL[parseInt(b.padEnd(6, "0"), 2)],
    )
}

const isShareValue = (key: string, value: unknown) =>
    key === "cur"
        ? isCurrency(value)
        : value === null ||
          Number.isFinite(value) ||
          (typeof value === "string" && value.length <= MAX_STRING_VALUE)

/**
 * Also reads the reference's percent-encoded, padded base64. Unknown keys and
 * bad types are dropped; out-of-range numbers are kept for validation to flag.
 */
export function decodeShareState(
    param: string | null | undefined,
): Partial<CalcInputs> | null {
    if (!param || param.length > MAX_SHARE_LENGTH) return null
    try {
        const text = (param.includes("%") ? decodeURIComponent(param) : param)
            .replace(/=+$/, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
        if (text.length % 4 === 1 || /[^\w-]/.test(text)) return null
        const bits = [...text]
            .map((c) => BASE64URL.indexOf(c).toString(2).padStart(6, "0"))
            .join("")
        const escaped = (bits.match(/.{8}/g) ?? [])
            .map((b) => "%" + parseInt(b, 2).toString(16).padStart(2, "0"))
            .join("")
        const data: unknown = JSON.parse(decodeURIComponent(escaped))
        if (!data || typeof data !== "object" || Array.isArray(data))
            return null
        return Object.fromEntries(
            Object.entries(data).filter(
                ([key, value]) =>
                    INPUT_KEYS.includes(key as InputKey) &&
                    isShareValue(key, value),
            ),
        )
    } catch {
        return null
    }
}
