import { INPUT_KEYS } from "./defaults"
import { isCurrency } from "./currency"
import type { CalcInputs, InputKey } from "./types"

// Share links carry the calculator state as base64url-encoded JSON, the same
// payload as the reference (every input key, values as entered). base64url
// needs no percent-encoding in a query string. The decoder also accepts the
// reference's format (standard base64, percent-encoded) so both round-trip.
// Implemented with ECMAScript built-ins only, no btoa/atob or TextEncoder.

const ALPHABET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"

export const MAX_SHARE_LENGTH = 2048
const MAX_STRING_VALUE = 32

function utf8Bytes(text: string): number[] {
    const escaped = encodeURIComponent(text)
    const bytes: number[] = []
    for (let i = 0; i < escaped.length; i++) {
        if (escaped[i] === "%") {
            bytes.push(parseInt(escaped.slice(i + 1, i + 3), 16))
            i += 2
        } else {
            bytes.push(escaped.charCodeAt(i))
        }
    }
    return bytes
}

function utf8Text(bytes: number[]): string {
    return decodeURIComponent(
        bytes.map((b) => "%" + b.toString(16).padStart(2, "0")).join(""),
    )
}

function base64Encode(bytes: number[]): string {
    let out = ""
    for (let i = 0; i < bytes.length; i += 3) {
        const n =
            (bytes[i] << 16) | ((bytes[i + 1] ?? 0) << 8) | (bytes[i + 2] ?? 0)
        out += ALPHABET[(n >> 18) & 63] + ALPHABET[(n >> 12) & 63]
        out += i + 1 < bytes.length ? ALPHABET[(n >> 6) & 63] : "="
        out += i + 2 < bytes.length ? ALPHABET[n & 63] : "="
    }
    return out
}

function base64Decode(text: string): number[] | null {
    const clean = text.replace(/=+$/, "")
    if (clean.length % 4 === 1) return null
    const bytes: number[] = []
    let buffer = 0
    let bits = 0
    for (const char of clean) {
        const value = ALPHABET.indexOf(char)
        if (value < 0) return null
        buffer = (buffer << 6) | value
        bits += 6
        if (bits >= 8) {
            bits -= 8
            bytes.push((buffer >> bits) & 255)
        }
    }
    return bytes
}

/** Encodes the full input state for a `?kvc=` share link. */
export function encodeShareState(inputs: CalcInputs): string {
    const payload: Record<string, unknown> = {}
    for (const key of INPUT_KEYS) payload[key] = inputs[key]
    return base64Encode(utf8Bytes(JSON.stringify(payload)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "")
}

/**
 * Decodes a share parameter into the known input keys it carries, or null
 * when it cannot be read. Unknown keys, unknown currencies and values of the
 * wrong type are dropped; the caller fills the gaps with `resolveInputs`.
 * Out-of-range numbers are kept so validation can flag them.
 */
export function decodeShareState(
    param: string | null | undefined,
): Partial<CalcInputs> | null {
    if (!param || param.length > MAX_SHARE_LENGTH) return null
    try {
        const text = param.includes("%") ? decodeURIComponent(param) : param
        const bytes = base64Decode(text.replace(/-/g, "+").replace(/_/g, "/"))
        if (!bytes) return null
        const data: unknown = JSON.parse(utf8Text(bytes))
        if (!data || typeof data !== "object" || Array.isArray(data))
            return null

        const source = data as Record<string, unknown>
        const out: Partial<Record<InputKey, unknown>> = {}
        for (const key of INPUT_KEYS) {
            if (!(key in source)) continue
            const value = source[key]
            if (key === "cur") {
                if (isCurrency(value)) out.cur = value
            } else if (
                value === null ||
                (typeof value === "number" && Number.isFinite(value)) ||
                (typeof value === "string" && value.length <= MAX_STRING_VALUE)
            ) {
                out[key] = value
            }
        }
        return out as Partial<CalcInputs>
    } catch {
        return null
    }
}
