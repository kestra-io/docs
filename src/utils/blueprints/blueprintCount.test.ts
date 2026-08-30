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

    it("returns the API total floored to the ten", async () => {
        fetchApiCachedMock.mockResolvedValue({ total: 698 })
        const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

        expect(await fetchTotalBlueprintsCount()).toBe("690")
        expect(fetchApiCachedMock).toHaveBeenCalledWith(
            "/blueprints/versions/latest?size=1&page=1",
        )
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

    it("propagates failures instead of returning a fake count, and retries on the next call", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {})
        fetchApiCachedMock
            .mockRejectedValueOnce(new Error("API down"))
            .mockResolvedValueOnce({ total: 152 })
        const fetchTotalBlueprintsCount = await freshFetchTotalBlueprintsCount()

        await expect(fetchTotalBlueprintsCount()).rejects.toThrow("API down")
        // The failed promise is not memoized: the next call retries and succeeds.
        await expect(fetchTotalBlueprintsCount()).resolves.toBe("150")
        expect(fetchApiCachedMock).toHaveBeenCalledTimes(2)
    })
})
