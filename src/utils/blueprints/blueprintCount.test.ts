import { describe, it, expect, vi, beforeEach } from "vitest"

// The real ~/utils/fetch imports astro:env/client, which only exists inside an
// Astro build — mock the module (hoisted, so it applies to imports too).
const { fetchApiCachedMock } = vi.hoisted(() => ({ fetchApiCachedMock: vi.fn() }))
vi.mock("~/utils/fetch", () => ({ $fetchApiCached: fetchApiCachedMock }))

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
        fetchApiCachedMock.mockReset()
    })

    it("returns the API total floored to the ten, in one request", async () => {
        fetchApiCachedMock.mockResolvedValue({ total: 698 })
        const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

        expect(await fetchTotalBlueprintsCount()).toBe("690")
        expect(fetchApiCachedMock).toHaveBeenCalledWith(
            "/blueprints/versions/latest?size=1&page=1",
        )
        // A successful first attempt is not retried.
        expect(fetchApiCachedMock).toHaveBeenCalledTimes(1)
    })

    it("treats a missing total as zero", async () => {
        fetchApiCachedMock.mockResolvedValue({})
        const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

        expect(await fetchTotalBlueprintsCount()).toBe("0")
    })

    it("shares one request across concurrent and repeated callers", async () => {
        fetchApiCachedMock.mockResolvedValue({ total: 690 })
        const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

        const [first, second] = await Promise.all([
            fetchTotalBlueprintsCount(),
            fetchTotalBlueprintsCount(),
        ])
        const third = await fetchTotalBlueprintsCount()

        expect(first).toBe(second)
        expect(second).toBe(third)
        expect(fetchApiCachedMock).toHaveBeenCalledTimes(1)
    })

    it("retries a transient failure within one call and succeeds", async () => {
        vi.useFakeTimers()
        try {
            fetchApiCachedMock
                .mockRejectedValueOnce(new Error("blip"))
                .mockResolvedValueOnce({ total: 152 })
            const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

            const promise = fetchTotalBlueprintsCount()
            await vi.runAllTimersAsync()

            await expect(promise).resolves.toBe("150")
            expect(fetchApiCachedMock).toHaveBeenCalledTimes(2)
        } finally {
            vi.useRealTimers()
        }
    })

    it("survives two failures and succeeds on the final attempt", async () => {
        vi.useFakeTimers()
        try {
            fetchApiCachedMock
                .mockRejectedValueOnce(new Error("blip 1"))
                .mockRejectedValueOnce(new Error("blip 2"))
                .mockResolvedValueOnce({ total: 152 })
            const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

            const promise = fetchTotalBlueprintsCount()
            await vi.runAllTimersAsync()

            await expect(promise).resolves.toBe("150")
            expect(fetchApiCachedMock).toHaveBeenCalledTimes(3)
        } finally {
            vi.useRealTimers()
        }
    })

    it("backs off between attempts and throws once all attempts fail", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {})
        vi.useFakeTimers()
        try {
            fetchApiCachedMock.mockRejectedValue(new Error("API down"))
            const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

            const promise = fetchTotalBlueprintsCount()
            promise.catch(() => {}) // observed below; avoid an unhandled rejection

            await vi.advanceTimersByTimeAsync(0)
            expect(fetchApiCachedMock).toHaveBeenCalledTimes(1)
            // Second attempt only after the first 500ms backoff...
            await vi.advanceTimersByTimeAsync(499)
            expect(fetchApiCachedMock).toHaveBeenCalledTimes(1)
            await vi.advanceTimersByTimeAsync(1)
            expect(fetchApiCachedMock).toHaveBeenCalledTimes(2)
            // ...and the third after a longer 1000ms backoff.
            await vi.advanceTimersByTimeAsync(1000)
            expect(fetchApiCachedMock).toHaveBeenCalledTimes(3)

            await expect(promise).rejects.toThrow("API down")
        } finally {
            vi.useRealTimers()
        }
    })

    it("does not memoize an exhausted failure: the next call starts fresh and can succeed", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {})
        vi.useFakeTimers()
        try {
            fetchApiCachedMock
                .mockRejectedValueOnce(new Error("API down"))
                .mockRejectedValueOnce(new Error("API down"))
                .mockRejectedValueOnce(new Error("API down"))
                .mockResolvedValueOnce({ total: 152 })
            const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

            const failing = fetchTotalBlueprintsCount()
            failing.catch(() => {})
            await vi.runAllTimersAsync()
            await expect(failing).rejects.toThrow("API down")
            expect(fetchApiCachedMock).toHaveBeenCalledTimes(3)

            const retried = fetchTotalBlueprintsCount()
            await vi.runAllTimersAsync()
            await expect(retried).resolves.toBe("150")
            expect(fetchApiCachedMock).toHaveBeenCalledTimes(4)
        } finally {
            vi.useRealTimers()
        }
    })
})
