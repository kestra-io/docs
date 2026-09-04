import { describe, it, expect, vi, beforeEach } from "vitest"
import { replaceTotalPluginsPlaceholder } from "~/utils/plugins/pluginCount"

// The real ~/utils/fetch imports astro:env/client, which only exists inside an
// Astro build — mock the module (hoisted, so it applies to the import above too).
const { fetchApiCachedMock } = vi.hoisted(() => ({ fetchApiCachedMock: vi.fn() }))
vi.mock("~/utils/fetch", () => ({ $fetchApiCached: fetchApiCachedMock }))

describe("replaceTotalPluginsPlaceholder", () => {
    it("replaces the placeholder in a plain string", () => {
        expect(replaceTotalPluginsPlaceholder("{totalPlugins}+ plugins", "1900")).toBe(
            "1900+ plugins",
        )
    })

    it("replaces every occurrence within one string", () => {
        expect(
            replaceTotalPluginsPlaceholder(
                "{totalPlugins}+ plugins, and {totalPlugins}+ more",
                "1900",
            ),
        ).toBe("1900+ plugins, and 1900+ more")
    })

    it("recurses through nested objects and arrays", () => {
        const data = {
            title: "{totalPlugins}+ plugins, not just HTTP",
            features: [
                { kestra: "{totalPlugins}+ plugins", competitor: "400+ built-in" },
                "plain string without placeholder",
            ],
            kpis: { value: "{totalPlugins}+", depth: { deeper: ["{totalPlugins}"] } },
        }

        expect(replaceTotalPluginsPlaceholder(data, "1900")).toEqual({
            title: "1900+ plugins, not just HTTP",
            features: [
                { kestra: "1900+ plugins", competitor: "400+ built-in" },
                "plain string without placeholder",
            ],
            kpis: { value: "1900+", depth: { deeper: ["1900"] } },
        })
    })

    it("leaves non-string values untouched", () => {
        expect(replaceTotalPluginsPlaceholder(42, "1900")).toBe(42)
        expect(replaceTotalPluginsPlaceholder(true, "1900")).toBe(true)
        expect(replaceTotalPluginsPlaceholder(null, "1900")).toBe(null)
        expect(replaceTotalPluginsPlaceholder(undefined, "1900")).toBe(undefined)
    })

    it("does not mutate the input", () => {
        const data = { list: ["{totalPlugins}+"] }
        replaceTotalPluginsPlaceholder(data, "1900")
        expect(data.list[0]).toBe("{totalPlugins}+")
    })
})

describe("fetchTotalPluginsCount", () => {
    const subgroups = [
        {
            tasks: [{ cls: "a.A" }, { cls: "a.B" }],
            triggers: [{ cls: "a.C" }],
            categories: ["should be ignored"],
        },
        // Duplicate class across groups counts once.
        { tasks: [{ cls: "a.A" }, { cls: "b.D" }] },
    ]

    // The count is memoized at module level, so each test re-imports a fresh copy.
    async function freshFetchTotalPluginsCount() {
        vi.resetModules()
        const { fetchTotalPluginsCount } = await import("~/utils/plugins/pluginCount")
        return fetchTotalPluginsCount
    }

    beforeEach(() => {
        fetchApiCachedMock.mockReset()
    })

    it("counts distinct element classes floored to the hundred, in one request", async () => {
        fetchApiCachedMock.mockResolvedValue([
            { tasks: Array.from({ length: 234 }, (_, i) => ({ cls: `cls.${i}` })) },
        ])
        const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

        expect(await fetchTotalPluginsCount()).toBe("200")
        // A successful first attempt is not retried.
        expect(fetchApiCachedMock).toHaveBeenCalledTimes(1)
    })

    it("shares one request across concurrent and repeated callers", async () => {
        fetchApiCachedMock.mockResolvedValue(subgroups)
        const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

        const [first, second] = await Promise.all([
            fetchTotalPluginsCount(),
            fetchTotalPluginsCount(),
        ])
        const third = await fetchTotalPluginsCount()

        expect(first).toBe(second)
        expect(second).toBe(third)
        expect(fetchApiCachedMock).toHaveBeenCalledTimes(1)
    })

    it("retries a transient failure within one call and succeeds", async () => {
        vi.useFakeTimers()
        try {
            fetchApiCachedMock
                .mockRejectedValueOnce(new Error("blip"))
                .mockResolvedValueOnce([
                    { tasks: Array.from({ length: 150 }, (_, i) => ({ cls: `cls.${i}` })) },
                ])
            const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

            const promise = fetchTotalPluginsCount()
            await vi.runAllTimersAsync()

            await expect(promise).resolves.toBe("100")
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
                .mockResolvedValueOnce([
                    { tasks: Array.from({ length: 150 }, (_, i) => ({ cls: `cls.${i}` })) },
                ])
            const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

            const promise = fetchTotalPluginsCount()
            await vi.runAllTimersAsync()

            await expect(promise).resolves.toBe("100")
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
            const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

            const promise = fetchTotalPluginsCount()
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
                .mockResolvedValueOnce([
                    { tasks: Array.from({ length: 150 }, (_, i) => ({ cls: `cls.${i}` })) },
                ])
            const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

            const failing = fetchTotalPluginsCount()
            failing.catch(() => {})
            await vi.runAllTimersAsync()
            await expect(failing).rejects.toThrow("API down")
            expect(fetchApiCachedMock).toHaveBeenCalledTimes(3)

            const retried = fetchTotalPluginsCount()
            await vi.runAllTimersAsync()
            await expect(retried).resolves.toBe("100")
            expect(fetchApiCachedMock).toHaveBeenCalledTimes(4)
        } finally {
            vi.useRealTimers()
        }
    })
})
