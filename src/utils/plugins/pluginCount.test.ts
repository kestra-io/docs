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

    it("counts distinct element classes floored to the hundred", async () => {
        fetchApiCachedMock.mockResolvedValue([
            { tasks: Array.from({ length: 234 }, (_, i) => ({ cls: `cls.${i}` })) },
        ])
        const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

        expect(await fetchTotalPluginsCount()).toBe("200")
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

    it("propagates failures instead of returning a fake count, and retries on the next call", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {})
        fetchApiCachedMock
            .mockRejectedValueOnce(new Error("API down"))
            .mockResolvedValueOnce([
                { tasks: Array.from({ length: 150 }, (_, i) => ({ cls: `cls.${i}` })) },
            ])
        const fetchTotalPluginsCount = await freshFetchTotalPluginsCount()

        await expect(fetchTotalPluginsCount()).rejects.toThrow("API down")
        // The failed promise is not memoized: the next call retries and succeeds.
        await expect(fetchTotalPluginsCount()).resolves.toBe("100")
        expect(fetchApiCachedMock).toHaveBeenCalledTimes(2)
    })
})
