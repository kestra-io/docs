import { describe, expect, it } from "vitest"
import {
    collectionContentDigest,
    collectionMetadataDigest,
    entryCacheKey,
    hashString,
} from "~/utils/incrementalCacheKey"

const entry = (id: string, digest: string, data: Record<string, unknown>) => ({
    id,
    filePath: `src/contents/docs/${id}.md`,
    digest,
    data,
})

const collection = [
    entry("a", "d1", { title: "A" }),
    entry("b", "d2", { title: "B" }),
]

describe("hashString", () => {
    it("is stable and order sensitive", () => {
        expect(hashString("kestra")).toBe(hashString("kestra"))
        expect(hashString("kestra")).not.toBe(hashString("kestar"))
    })
})

describe("collectionMetadataDigest", () => {
    it("ignores entry order", () => {
        expect(collectionMetadataDigest(collection)).toBe(
            collectionMetadataDigest([...collection].reverse()),
        )
    })

    it("changes when frontmatter, ids or membership change", () => {
        const base = collectionMetadataDigest(collection)
        expect(
            collectionMetadataDigest([collection[0], entry("b", "d2", { title: "B2" })]),
        ).not.toBe(base)
        expect(
            collectionMetadataDigest([...collection, entry("c", "d3", { title: "C" })]),
        ).not.toBe(base)
    })

    it("ignores body-only edits, which only invalidate their own page", () => {
        expect(
            collectionMetadataDigest([collection[0], entry("b", "d9", { title: "B" })]),
        ).toBe(collectionMetadataDigest(collection))
    })
})

describe("collectionContentDigest", () => {
    it("also catches body-only edits", () => {
        expect(
            collectionContentDigest([collection[0], entry("b", "d9", { title: "B" })]),
        ).not.toBe(collectionContentDigest(collection))
    })
})

describe("entryCacheKey", () => {
    it("combines the entry digest with the scope", () => {
        expect(entryCacheKey(collection[0], "scope")).toBe("d1|scope")
    })

    it("returns undefined without a digest, leaving the page uncached", () => {
        expect(entryCacheKey({ id: "a", data: {} }, "scope")).toBeUndefined()
    })
})
