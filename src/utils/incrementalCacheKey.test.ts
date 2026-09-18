import { describe, expect, it, vi, beforeEach } from "vitest"
import {
    canonicalPayload,
    collectionContentDigest,
    collectionMetadataDigest,
    entryCacheKey,
    fileContentsDigest,
    hashString,
} from "~/utils/incrementalCacheKey"
import { DOCS_LATEST_OVERRIDE } from "~/utils/versionedDocs"

const { fetchMock, textFetchMock } = vi.hoisted(() => ({
    fetchMock: vi.fn(),
    textFetchMock: vi.fn(),
}))
vi.mock("~/utils/fetch", () => ({
    $fetchApiCached: fetchMock,
    $fetchApiTextCached: textFetchMock,
}))

beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockResolvedValue({ version: "2.9.0" })
    textFetchMock.mockReset()
    textFetchMock.mockResolvedValue("<svg />")
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

    it("returns undefined when a scope part is missing, rather than keying without it", () => {
        expect(entryCacheKey(collection[0], "scope", undefined)).toBeUndefined()
    })
})

describe("apiPayloadDigest", () => {
    const digest = async (...paths: string[]) => {
        const { apiPayloadDigest } = await import("./incrementalCacheKey")
        return apiPayloadDigest(...paths)
    }

    it("ignores the order the endpoints are listed in, and repeats", async () => {
        fetchMock.mockImplementation(async (path: string) => ({ path }))
        expect(await digest("/a", "/b")).toBe(await digest("/b", "/a", "/a"))
    })

    it("changes when a payload changes", async () => {
        fetchMock.mockResolvedValue({ total: 1 })
        const base = await digest("/plugins/subgroups")
        fetchMock.mockResolvedValue({ total: 2 })
        expect(await digest("/plugins/subgroups")).not.toBe(base)
    })

    it("returns undefined when a payload can't be read", async () => {
        fetchMock.mockRejectedValue(new Error("503"))
        expect(await digest("/plugins/subgroups")).toBeUndefined()
    })

    // /plugins/subgroups returns the same plugins in a different order per request.
    it("ignores the order a payload lists its entries in", async () => {
        fetchMock.mockResolvedValue({ plugins: [{ name: "a" }, { name: "b" }] })
        const base = await digest("/plugins/subgroups")
        fetchMock.mockResolvedValue({ plugins: [{ name: "b" }, { name: "a" }] })
        expect(await digest("/plugins/subgroups")).toBe(base)
    })
})

describe("canonicalPayload", () => {
    it("orders object keys and array elements", () => {
        expect(JSON.stringify(canonicalPayload({ b: 1, a: [3, 1, 2] }))).toBe(
            JSON.stringify({ a: [1, 2, 3], b: 1 }),
        )
    })

    it("orders nested arrays of objects", () => {
        const one = canonicalPayload([{ x: 2 }, { x: 1 }])
        const other = canonicalPayload([{ x: 1 }, { x: 2 }])
        expect(JSON.stringify(one)).toBe(JSON.stringify(other))
    })

    it("still separates different content", () => {
        expect(JSON.stringify(canonicalPayload([1, 2]))).not.toBe(
            JSON.stringify(canonicalPayload([1, 3])),
        )
    })

    it("leaves scalars and strings alone", () => {
        expect(canonicalPayload("<svg />")).toBe("<svg />")
        expect(canonicalPayload(null)).toBe(null)
    })
})

describe("pluginIconDigest", () => {
    const digest = async (...classes: string[]) => {
        const { pluginIconDigest } = await import("./incrementalCacheKey")
        return pluginIconDigest(...classes)
    }

    it("changes when an icon is redrawn", async () => {
        const base = await digest("io.kestra.plugin.core.log.Log")
        textFetchMock.mockResolvedValue("<svg><path /></svg>")
        expect(await digest("io.kestra.plugin.core.log.Log")).not.toBe(base)
    })

    it("reads each class from its own icon endpoint", async () => {
        await digest("io.kestra.plugin.core.log.Log")
        expect(textFetchMock).toHaveBeenCalledWith(
            "/plugins/icons/io.kestra.plugin.core.log.Log",
        )
    })

    it("returns undefined when an icon can't be read", async () => {
        textFetchMock.mockRejectedValue(new Error("404"))
        expect(await digest("io.kestra.plugin.core.log.Log")).toBeUndefined()
    })
})
