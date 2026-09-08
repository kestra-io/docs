import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

// ~/utils/fetch imports astro:env/client, which only exists inside an Astro
// build; mock that virtual module and stub global fetch so the real
// $fetchApiCachedWithRetry path (including its backoff) is what runs here.
vi.mock("astro:env/client", () => ({ API_URL: "https://api.test" }))
const fetchMock = vi.fn()
vi.stubGlobal("fetch", fetchMock)

function jsonResponse(data: unknown) {
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "content-type": "application/json" },
    })
}

describe("fetchTotalBlueprintsCount", () => {
    // The count is memoized at module level, so each test re-imports a fresh copy.
    async function freshFetchTotalBlueprintsCount() {
        vi.resetModules()
        const { fetchTotalBlueprintsCount } = await import(
            "~/utils/blueprints/blueprintCount"
        )
        return fetchTotalBlueprintsCount
    }

    beforeEach(() => {
        fetchMock.mockReset()
        // internalFetch logs every failed attempt; keep expected failures quiet.
        vi.spyOn(console, "error").mockImplementation(() => {})
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("returns the API total floored to the ten, in one request", async () => {
        fetchMock.mockResolvedValue(jsonResponse({ total: 698 }))
        const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

        expect(await fetchTotalBlueprintsCount()).toBe("690")
        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.test/blueprints/versions/latest?size=1&page=1",
            expect.anything(),
        )
        // A successful first attempt is not retried.
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("treats a missing total as zero", async () => {
        fetchMock.mockResolvedValue(jsonResponse({}))
        const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

        expect(await fetchTotalBlueprintsCount()).toBe("0")
    })

    it("shares one request across concurrent and repeated callers", async () => {
        fetchMock.mockResolvedValue(jsonResponse({ total: 690 }))
        const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

        const [first, second] = await Promise.all([
            fetchTotalBlueprintsCount(),
            fetchTotalBlueprintsCount(),
        ])
        const third = await fetchTotalBlueprintsCount()

        expect(first).toBe(second)
        expect(second).toBe(third)
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("retries a transient failure within one call and succeeds", async () => {
        vi.useFakeTimers()
        try {
            fetchMock
                .mockRejectedValueOnce(new Error("blip"))
                .mockResolvedValueOnce(jsonResponse({ total: 152 }))
            const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

            const promise = fetchTotalBlueprintsCount()
            await vi.runAllTimersAsync()

            await expect(promise).resolves.toBe("150")
            expect(fetchMock).toHaveBeenCalledTimes(2)
        } finally {
            vi.useRealTimers()
        }
    })

    it("survives two failures and succeeds on the final attempt", async () => {
        vi.useFakeTimers()
        try {
            fetchMock
                .mockRejectedValueOnce(new Error("blip 1"))
                .mockRejectedValueOnce(new Error("blip 2"))
                .mockResolvedValueOnce(jsonResponse({ total: 152 }))
            const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

            const promise = fetchTotalBlueprintsCount()
            await vi.runAllTimersAsync()

            await expect(promise).resolves.toBe("150")
            expect(fetchMock).toHaveBeenCalledTimes(3)
        } finally {
            vi.useRealTimers()
        }
    })

    it("backs off between attempts and throws once all attempts fail", async () => {
        vi.useFakeTimers()
        try {
            fetchMock.mockRejectedValue(new Error("API down"))
            const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

            const promise = fetchTotalBlueprintsCount()
            promise.catch(() => {}) // observed below; avoid an unhandled rejection

            await vi.advanceTimersByTimeAsync(0)
            expect(fetchMock).toHaveBeenCalledTimes(1)
            // Second attempt only after the first 500ms backoff...
            await vi.advanceTimersByTimeAsync(499)
            expect(fetchMock).toHaveBeenCalledTimes(1)
            await vi.advanceTimersByTimeAsync(1)
            expect(fetchMock).toHaveBeenCalledTimes(2)
            // ...and the third after a longer 1000ms backoff.
            await vi.advanceTimersByTimeAsync(1000)
            expect(fetchMock).toHaveBeenCalledTimes(3)

            await expect(promise).rejects.toThrow("API down")
        } finally {
            vi.useRealTimers()
        }
    })

    it("does not memoize an exhausted failure: the next call starts fresh and can succeed", async () => {
        vi.useFakeTimers()
        try {
            fetchMock
                .mockRejectedValueOnce(new Error("API down"))
                .mockRejectedValueOnce(new Error("API down"))
                .mockRejectedValueOnce(new Error("API down"))
                .mockResolvedValueOnce(jsonResponse({ total: 152 }))
            const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

            const failing = fetchTotalBlueprintsCount()
            failing.catch(() => {})
            await vi.runAllTimersAsync()
            await expect(failing).rejects.toThrow("API down")
            expect(fetchMock).toHaveBeenCalledTimes(3)

            const retried = fetchTotalBlueprintsCount()
            await vi.runAllTimersAsync()
            await expect(retried).resolves.toBe("150")
            expect(fetchMock).toHaveBeenCalledTimes(4)
        } finally {
            vi.useRealTimers()
        }
    })
})
