import { describe, expect, it, vi } from "vitest"
import { cachedLoader, loadOnce } from "~/utils/search/loaders"

describe("loadOnce", () => {
    it("shares one request, and tries again after a failure", async () => {
        const load = vi
            .fn()
            .mockRejectedValueOnce(new Error("offline"))
            .mockResolvedValue("index")
        const loadIndex = loadOnce(load)
        await expect(loadIndex()).rejects.toThrow("offline")
        expect(await Promise.all([loadIndex(), loadIndex()])).toEqual([
            "index",
            "index",
        ])
        expect(load).toHaveBeenCalledTimes(2)
    })
})

describe("cachedLoader", () => {
    it("keeps the most recently used entries only", async () => {
        const pages = cachedLoader(async (key) => key.toUpperCase(), 2)
        await pages.load("a")
        await pages.load("b")
        await pages.load("a")
        await pages.load("c")
        expect(["a", "b", "c"].map(pages.isLoaded)).toEqual([true, false, true])
    })
})
