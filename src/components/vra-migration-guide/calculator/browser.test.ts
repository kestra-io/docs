import { describe, expect, it } from "vitest"
import {
    copyText,
    getBrowserEnv,
    readShareParam,
    readStored,
    withShareParam,
    withoutShareParam,
    writeStored,
    type StorageLike,
} from "./browser"

const PAGE = "https://kestra.io/resources/migration/vra"

describe("share URLs", () => {
    it("adds ?kvc= and points the hash at the calculator", () => {
        expect(
            withShareParam(PAGE + "#section-3-1", "abc", "section-7-2"),
        ).toBe(PAGE + "?kvc=abc#section-7-2")
    })

    it("keeps other query parameters and replaces an existing kvc", () => {
        const url = withShareParam(PAGE + "?utm_source=x&kvc=old", "new")
        expect(url).toBe(PAGE + "?utm_source=x&kvc=new")
    })

    it("reads the parameter back, or null", () => {
        expect(readShareParam(PAGE + "?kvc=a_b-c#x")).toBe("a_b-c")
        expect(readShareParam(PAGE)).toBeNull()
        expect(readShareParam("not a url")).toBeNull()
    })

    it("removes only the parameter, keeping the rest and the hash", () => {
        expect(withoutShareParam(PAGE + "?a=1&kvc=abc#section-7-2")).toBe(
            PAGE + "?a=1#section-7-2",
        )
        expect(withoutShareParam(PAGE + "?kvc=abc")).toBe(PAGE)
    })
})

describe("storage helpers", () => {
    const throwing: StorageLike = {
        getItem: () => {
            throw new Error("blocked")
        },
        setItem: () => {
            throw new Error("quota")
        },
        removeItem: () => {
            throw new Error("blocked")
        },
    }

    it("swallow storage errors", () => {
        expect(readStored(throwing, "k")).toBeNull()
        expect(writeStored(throwing, "k", "v")).toBe(false)
        expect(writeStored(throwing, "k", null)).toBe(false)
    })

    it("treat missing storage as empty", () => {
        expect(readStored(null, "k")).toBeNull()
        expect(writeStored(null, "k", "v")).toBe(false)
    })
})

describe("getBrowserEnv", () => {
    it("is null without a window (SSR)", () => {
        expect(getBrowserEnv()).toBeNull()
    })
})

describe("copyText", () => {
    it("reports success when the clipboard accepts the text", async () => {
        const written: string[] = []
        const ok = await copyText("https://x", {
            writeText: async (text) => void written.push(text),
        })
        expect(ok).toBe(true)
        expect(written).toEqual(["https://x"])
    })

    it("reports failure when the clipboard rejects", async () => {
        const denied = { writeText: () => Promise.reject(new Error("denied")) }
        expect(await copyText("https://x", denied)).toBe(false)
    })

    it("reports failure when writeText throws synchronously", async () => {
        const broken = {
            writeText: () => {
                throw new Error("not allowed")
            },
        }
        expect(await copyText("https://x", broken)).toBe(false)
    })

    it("reports failure without a clipboard", async () => {
        expect(await copyText("https://x", null)).toBe(false)
        expect(await copyText("https://x", undefined)).toBe(false)
    })
})
