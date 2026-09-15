import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }))
vi.mock("~/utils/fetch", () => ({ $fetchApiCached: fetchMock }))

const SECTIONS = [{ title: "Get Started with Kestra", pages: ["Tutorial"] }]

beforeEach(() => {
    fetchMock.mockReset()
    vi.resetModules()
    vi.useFakeTimers()
})

afterEach(() => {
    vi.useRealTimers()
})

describe("getDocSections", () => {
    it("fetches the version's own sections file and memoizes per version", async () => {
        fetchMock.mockResolvedValue(SECTIONS)
        const { getDocSections } = await import("./docSectionsFetch")

        expect(await getDocSections("1.0")).toEqual(SECTIONS)
        await getDocSections("1.0")
        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock).toHaveBeenCalledWith("/docs/docs/_sections.json/versions/1.0.0")

        await getDocSections("1.1")
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it("returns undefined for a version with no sections file, so the caller falls back", async () => {
        // Versions indexed before the indexer published this file answer with an
        // error rather than a 404.
        fetchMock.mockRejectedValue(new Error("500"))
        const { getDocSections } = await import("./docSectionsFetch")

        expect(await getDocSections("0.24")).toBeUndefined()
        expect(await getDocSections("0.24")).toBeUndefined()
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("treats an empty or non-array payload as absent", async () => {
        fetchMock.mockResolvedValueOnce([])
        const { getDocSections } = await import("./docSectionsFetch")
        expect(await getDocSections("1.0")).toBeUndefined()

        vi.advanceTimersByTime(11 * 60 * 1000)
        fetchMock.mockResolvedValueOnce({ nope: true })
        expect(await getDocSections("1.0")).toBeUndefined()
    })

    it("keeps stale sections on a later failure instead of dropping the sidebar grouping", async () => {
        fetchMock.mockResolvedValueOnce(SECTIONS)
        const { getDocSections } = await import("./docSectionsFetch")
        await getDocSections("1.0")

        vi.advanceTimersByTime(11 * 60 * 1000) // past the 10-minute TTL
        fetchMock.mockRejectedValueOnce(new Error("network down"))

        expect(await getDocSections("1.0")).toEqual(SECTIONS)
    })

    it("retries a failure sooner than a fresh success (short negative-cache TTL)", async () => {
        fetchMock.mockRejectedValueOnce(new Error("500"))
        const { getDocSections } = await import("./docSectionsFetch")
        expect(await getDocSections("1.0")).toBeUndefined()

        vi.advanceTimersByTime(61 * 1000) // past the 60s failure TTL, well under the 10-minute success TTL
        fetchMock.mockResolvedValueOnce(SECTIONS)

        expect(await getDocSections("1.0")).toEqual(SECTIONS)
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })
})
