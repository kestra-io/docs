import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

const { fetchMock } = vi.hoisted(() => ({ fetchMock: vi.fn() }))
vi.mock("~/utils/fetch", () => ({ $fetchApiCached: fetchMock }))

beforeEach(() => {
    fetchMock.mockReset()
    vi.resetModules()
    vi.useFakeTimers()
})

afterEach(() => {
    vi.useRealTimers()
})

describe("getDocVersions", () => {
    it("fetches and memoizes versions on success", async () => {
        fetchMock.mockResolvedValue([{ version: "1.3.0" }, { version: "1.2.0" }])
        const { getDocVersions } = await import("./docVersionsFetch")

        const first = await getDocVersions()
        expect(first).toEqual([
            { label: "1.3", major: 1, minor: 3 },
            { label: "1.2", major: 1, minor: 2 },
        ])

        await getDocVersions()
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("caches a cold-start failure so a sustained outage isn't refetched on every call", async () => {
        fetchMock.mockRejectedValue(new Error("network down"))
        const { getDocVersions } = await import("./docVersionsFetch")

        expect(await getDocVersions()).toEqual([])
        expect(await getDocVersions()).toEqual([])
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("keeps stale data on a later failure instead of dropping it", async () => {
        fetchMock.mockResolvedValueOnce([{ version: "1.2.0" }])
        const { getDocVersions } = await import("./docVersionsFetch")
        await getDocVersions()

        vi.advanceTimersByTime(11 * 60 * 1000) // past the 10-minute TTL
        fetchMock.mockRejectedValueOnce(new Error("network down"))

        expect(await getDocVersions()).toEqual([{ label: "1.2", major: 1, minor: 2 }])
    })

    it("retries a failure sooner than a fresh success (short negative-cache TTL)", async () => {
        fetchMock.mockRejectedValueOnce(new Error("network down"))
        const { getDocVersions } = await import("./docVersionsFetch")
        expect(await getDocVersions()).toEqual([])

        vi.advanceTimersByTime(61 * 1000) // past the 60s failure TTL, well under the 10-minute success TTL
        fetchMock.mockResolvedValueOnce([{ version: "1.2.0" }])

        expect(await getDocVersions()).toEqual([{ label: "1.2", major: 1, minor: 2 }])
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })
})

describe("getDocVersionsResult", () => {
    it("reports ok on success", async () => {
        fetchMock.mockResolvedValue([{ version: "1.2.0" }])
        const { getDocVersionsResult } = await import("./docVersionsFetch")

        expect(await getDocVersionsResult()).toEqual({
            versions: [{ label: "1.2", major: 1, minor: 2 }],
            ok: true,
        })
    })

    it("reports not-ok with empty versions on a cold-start failure", async () => {
        fetchMock.mockRejectedValue(new Error("network down"))
        const { getDocVersionsResult } = await import("./docVersionsFetch")

        expect(await getDocVersionsResult()).toEqual({ versions: [], ok: false })
    })

    it("reports not-ok while serving stale data on a later failure", async () => {
        fetchMock.mockResolvedValueOnce([{ version: "1.2.0" }])
        const { getDocVersionsResult } = await import("./docVersionsFetch")
        await getDocVersionsResult()

        vi.advanceTimersByTime(11 * 60 * 1000)
        fetchMock.mockRejectedValueOnce(new Error("network down"))

        expect(await getDocVersionsResult()).toEqual({
            versions: [{ label: "1.2", major: 1, minor: 2 }],
            ok: false,
        })
    })
})
