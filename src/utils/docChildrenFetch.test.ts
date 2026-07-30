import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }))
vi.mock("~/utils/fetch", () => ({ $fetchApiCached: fetchMock }))

const CHILDREN = { "docs/tutorial": { title: "Tutorial" } }

beforeEach(() => {
    fetchMock.mockReset()
    vi.resetModules()
    vi.useFakeTimers()
})

afterEach(() => {
    vi.useRealTimers()
})

describe("getDocChildren", () => {
    it("fetches and memoizes children per version on success", async () => {
        fetchMock.mockResolvedValue(CHILDREN)
        const { getDocChildren } = await import("./docChildrenFetch")

        expect(await getDocChildren("1.2")).toEqual(CHILDREN)
        await getDocChildren("1.2")
        expect(fetchMock).toHaveBeenCalledTimes(1)

        await getDocChildren("1.1")
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it("caches a cold-start failure so a sustained outage isn't refetched on every call", async () => {
        fetchMock.mockRejectedValue(new Error("network down"))
        const { getDocChildren } = await import("./docChildrenFetch")

        expect(await getDocChildren("1.2")).toEqual({})
        expect(await getDocChildren("1.2")).toEqual({})
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("keeps stale data on a later failure instead of dropping it", async () => {
        fetchMock.mockResolvedValueOnce(CHILDREN)
        const { getDocChildren } = await import("./docChildrenFetch")
        await getDocChildren("1.2")

        vi.advanceTimersByTime(11 * 60 * 1000) // past the 10-minute TTL
        fetchMock.mockRejectedValueOnce(new Error("network down"))

        expect(await getDocChildren("1.2")).toEqual(CHILDREN)
    })

    it("retries a failure sooner than a fresh success (short negative-cache TTL)", async () => {
        fetchMock.mockRejectedValueOnce(new Error("network down"))
        const { getDocChildren } = await import("./docChildrenFetch")
        expect(await getDocChildren("1.2")).toEqual({})

        vi.advanceTimersByTime(61 * 1000) // past the 60s failure TTL, well under the 10-minute success TTL
        fetchMock.mockResolvedValueOnce(CHILDREN)

        expect(await getDocChildren("1.2")).toEqual(CHILDREN)
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })
})
