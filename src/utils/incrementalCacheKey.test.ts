import { describe, expect, it, vi, beforeEach } from "vitest"
import {
    collectionContentDigest,
    collectionMetadataDigest,
    entryCacheKey,
    fileContentsDigest,
    hashString,
} from "~/utils/incrementalCacheKey"
import { DOCS_LATEST_OVERRIDE } from "~/utils/versionedDocs"

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }))
vi.mock("~/utils/fetch", () => ({ $fetchApiCached: fetchMock }))

beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockResolvedValue({ version: "2.9.0" })
    vi.resetModules()
})

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

describe("fileContentsDigest", () => {
    it("ignores key order", () => {
        expect(fileContentsDigest({ a: "1", b: "2" })).toBe(
            fileContentsDigest({ b: "2", a: "1" }),
        )
    })

    it("changes when a file's content changes, is added or removed", () => {
        const base = fileContentsDigest({ a: "1", b: "2" })
        expect(fileContentsDigest({ a: "1", b: "2 changed" })).not.toBe(base)
        expect(fileContentsDigest({ a: "1", b: "2", c: "3" })).not.toBe(base)
        expect(fileContentsDigest({ a: "1" })).not.toBe(base)
    })

    it("doesn't collide a path/content split across different files", () => {
        expect(fileContentsDigest({ a: "b:c" })).not.toBe(fileContentsDigest({ "a:b": "c" }))
    })
})

describe("layoutDigest", () => {
    it("combines the docs version with a digest of the shared stylesheets", async () => {
        const { layoutDigest } = await import("./incrementalCacheKey")
        const [prefix, hex] = (await layoutDigest()).split("|")
        expect(prefix).toBe(`l${DOCS_LATEST_OVERRIDE}`)
        expect(hex).toMatch(/^[0-9a-f]{16}$/)
    })

    it("globs scss partials outside src/assets/styles too, since those also escape the module graph", async () => {
        const { scssModules } = await import("./incrementalCacheKey")
        expect(
            Object.keys(scssModules).some((path) => path.endsWith("blueprints/_blueprintCard.scss")),
        ).toBe(true)
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
