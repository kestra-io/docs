import { describe, expect, it, vi } from "vitest"
import { loadOnce } from "~/utils/search/loaders"

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

