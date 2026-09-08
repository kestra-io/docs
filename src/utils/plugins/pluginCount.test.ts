import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
    calculateTotalPlugins,
    formatPluginCount,
    replaceTotalPluginsPlaceholder,
} from "~/utils/plugins/pluginCount"

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

function subgroupsWith(classes: number) {
    return jsonResponse([
        { tasks: Array.from({ length: classes }, (_, i) => ({ cls: `cls.${i}` })) },
    ])
}

describe("calculateTotalPlugins", () => {
    it("counts distinct element classes across groups and ignores non-element keys", () => {
        expect(
            calculateTotalPlugins([
                {
                    tasks: [{ cls: "a.A" }, { cls: "a.B" }],
                    triggers: [{ cls: "a.C" }],
                    categories: ["should be ignored"],
                },
                // Duplicate class across groups counts once.
                { tasks: [{ cls: "a.A" }, { cls: "b.D" }] },
            ] as never),
        ).toBe(4)
    })
})

describe("formatPluginCount", () => {
    it("floors to the hundred and adds a thousands separator, without a plus", () => {
        expect(formatPluginCount(1949)).toBe("1,900")
        expect(formatPluginCount(234)).toBe("200")
        expect(formatPluginCount(99)).toBe("0")
    })
})

describe("replaceTotalPluginsPlaceholder", () => {
    it("replaces the placeholder in a plain string", () => {
        expect(replaceTotalPluginsPlaceholder("{totalPlugins}+ plugins", "1,900")).toBe(
            "1,900+ plugins",
        )
    })

    it("replaces every occurrence within one string", () => {
        expect(
            replaceTotalPluginsPlaceholder(
                "{totalPlugins}+ plugins, and {totalPlugins}+ more",
                "1,900",
            ),
        ).toBe("1,900+ plugins, and 1,900+ more")
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

        expect(replaceTotalPluginsPlaceholder(data, "1,900")).toEqual({
            title: "1,900+ plugins, not just HTTP",
            features: [
                { kestra: "1,900+ plugins", competitor: "400+ built-in" },
                "plain string without placeholder",
            ],
            kpis: { value: "1,900+", depth: { deeper: ["1,900"] } },
        })
    })

    it("leaves non-string values untouched", () => {
        expect(replaceTotalPluginsPlaceholder(42, "1,900")).toBe(42)
        expect(replaceTotalPluginsPlaceholder(true, "1,900")).toBe(true)
        expect(replaceTotalPluginsPlaceholder(null, "1,900")).toBe(null)
        expect(replaceTotalPluginsPlaceholder(undefined, "1,900")).toBe(undefined)
    })

    it("passes class instances such as Date through instead of flattening them to {}", () => {
        const publishedAt = new Date("2026-01-15T00:00:00Z")
        const result = replaceTotalPluginsPlaceholder(
            { publishedAt, title: "{totalPlugins}+ plugins" },
            "1,900",
        )

        expect(result.publishedAt).toBe(publishedAt)
        expect(result.publishedAt).toBeInstanceOf(Date)
        expect(result.title).toBe("1,900+ plugins")
    })

    it("does not mutate the input", () => {
        const data = { list: ["{totalPlugins}+"] }
        replaceTotalPluginsPlaceholder(data, "1,900")
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
        fetchMock.mockReset()
        // internalFetch logs every failed attempt; keep expected failures quiet.
        vi.spyOn(console, "error").mockImplementation(() => {})
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("counts distinct element classes floored to the hundred, in one request", async () => {
        fetchMock.mockResolvedValue(subgroupsWith(234))
        const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

        expect(await fetchTotalPluginsCount()).toBe("200")
        expect(fetchMock).toHaveBeenCalledWith(
            "https://api.test/plugins/subgroups",
            expect.anything(),
        )
        // A successful first attempt is not retried.
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("formats the rounded total with a thousands separator and no trailing plus", async () => {
        fetchMock.mockResolvedValue(subgroupsWith(1949))
        const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

        expect(await fetchTotalPluginsCount()).toBe("1,900")
    })

    it("shares one request across concurrent and repeated callers", async () => {
        fetchMock.mockResolvedValue(jsonResponse(subgroups))
        const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

        const [first, second] = await Promise.all([
            fetchTotalPluginsCount(),
            fetchTotalPluginsCount(),
        ])
        const third = await fetchTotalPluginsCount()

        expect(first).toBe(second)
        expect(second).toBe(third)
        expect(fetchMock).toHaveBeenCalledTimes(1)
    })

    it("retries a transient failure within one call and succeeds", async () => {
        vi.useFakeTimers()
        try {
            fetchMock
                .mockRejectedValueOnce(new Error("blip"))
                .mockResolvedValueOnce(subgroupsWith(150))
            const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

            const promise = fetchTotalPluginsCount()
            await vi.runAllTimersAsync()

            await expect(promise).resolves.toBe("100")
            expect(fetchMock).toHaveBeenCalledTimes(2)
        } finally {
            vi.useRealTimers()
        }
    })

    it("retries an HTTP error response like a network failure", async () => {
        vi.useFakeTimers()
        try {
            fetchMock
                .mockResolvedValueOnce(new Response("upstream down", { status: 502 }))
                .mockResolvedValueOnce(subgroupsWith(150))
            const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

            const promise = fetchTotalPluginsCount()
            await vi.runAllTimersAsync()

            await expect(promise).resolves.toBe("100")
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
                .mockResolvedValueOnce(subgroupsWith(150))
            const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

            const promise = fetchTotalPluginsCount()
            await vi.runAllTimersAsync()

            await expect(promise).resolves.toBe("100")
            expect(fetchMock).toHaveBeenCalledTimes(3)
        } finally {
            vi.useRealTimers()
        }
    })

    it("backs off between attempts and throws once all attempts fail", async () => {
        vi.useFakeTimers()
        try {
            fetchMock.mockRejectedValue(new Error("API down"))
            const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

            const promise = fetchTotalPluginsCount()
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
                .mockResolvedValueOnce(subgroupsWith(150))
            const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

            const failing = fetchTotalPluginsCount()
            failing.catch(() => {})
            await vi.runAllTimersAsync()
            await expect(failing).rejects.toThrow("API down")
            expect(fetchMock).toHaveBeenCalledTimes(3)

            const retried = fetchTotalPluginsCount()
            await vi.runAllTimersAsync()
            await expect(retried).resolves.toBe("100")
            expect(fetchMock).toHaveBeenCalledTimes(4)
        } finally {
            vi.useRealTimers()
        }
    })
})
