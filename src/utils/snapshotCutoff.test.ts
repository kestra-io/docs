import { describe, expect, it, vi, beforeEach } from "vitest"

const load = async (SNAPSHOT_CUTOFF?: string) => {
    vi.resetModules()
    vi.doMock("astro:env/server", () => ({ SNAPSHOT_CUTOFF }))
    return await import("./snapshotCutoff")
}

const entry = (iso: string) => ({ data: { date: new Date(iso) } })
const byDate = (e: { data: { date: Date } }) => e.data.date

beforeEach(() => vi.resetModules())

describe("beforeCutoff", () => {
    it("returns the same array when no cutoff is set", async () => {
        const { beforeCutoff } = await load()
        const entries = [entry("2030-01-01"), entry("2020-01-01")]

        expect(beforeCutoff(entries, byDate)).toBe(entries)
    })

    it("drops entries dated after the cutoff and keeps the boundary", async () => {
        const { beforeCutoff } = await load("2026-01-01")
        const kept = [entry("2025-12-31"), entry("2026-01-01T00:00:00.000Z")]
        const dropped = entry("2026-01-02")

        expect(beforeCutoff([...kept, dropped], byDate)).toEqual(kept)
    })

    it("rejects an unparsable cutoff instead of silently ignoring it", async () => {
        await expect(load("not-a-date")).rejects.toThrow("SNAPSHOT_CUTOFF")
    })
})
