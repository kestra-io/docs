import { beforeEach, describe, expect, it, vi } from "vitest"

const fetchApiCachedOptional = vi.hoisted(() => vi.fn())

vi.mock("~/utils/fetch", () => ({
    $fetchApiCachedOptional: fetchApiCachedOptional,
}))

const {
    resolveBlueprintRenders,
    fetchToolBlueprintCount,
    buildBlueprintFlowUrl,
    buildBlueprintGraphUrl,
    buildToolBlueprintCountUrl,
} = await import("./orchestrationBlueprints")

describe("orchestrationBlueprints", () => {
    beforeEach(() => {
        fetchApiCachedOptional.mockReset()
    })

    describe("buildBlueprintFlowUrl", () => {
        it("builds correct flow URL", () => {
            expect(buildBlueprintFlowUrl("my-blueprint")).toBe(
                "/blueprints/my-blueprint/versions/latest",
            )
        })
    })

    describe("buildBlueprintGraphUrl", () => {
        it("builds correct graph URL", () => {
            expect(buildBlueprintGraphUrl("my-blueprint")).toBe(
                "/blueprints/my-blueprint/versions/latest/graph",
            )
        })
    })

    describe("buildToolBlueprintCountUrl", () => {
        it("builds correct count URL with encoding", () => {
            expect(buildToolBlueprintCountUrl("my tool")).toBe(
                "/blueprints/versions/latest?q=my%20tool&size=1",
            )
        })

        it("handles special characters", () => {
            expect(buildToolBlueprintCountUrl("tool&name")).toBe(
                "/blueprints/versions/latest?q=tool%26name&size=1",
            )
        })
    })

    describe("resolveBlueprintRenders", () => {
        it("returns items with render when both flow and graph succeed", async () => {
            fetchApiCachedOptional.mockImplementation(async (url: string) => {
                if (url.endsWith("/graph")) {
                    if (url.includes("bp1")) return { nodes: [], edges: [] }
                    return { nodes: [1], edges: [2] }
                }
                if (url.includes("bp1")) return { flow: "flow source 1" }
                return { flow: "flow source 2" }
            })

            const items = [
                { blueprintId: "bp1", name: "Item 1" },
                { blueprintId: "bp2", name: "Item 2" },
            ]

            const result = await resolveBlueprintRenders(items)

            expect(result).toEqual([
                {
                    blueprintId: "bp1",
                    name: "Item 1",
                    render: {
                        source: "flow source 1",
                        graph: { nodes: [], edges: [] },
                    },
                },
                {
                    blueprintId: "bp2",
                    name: "Item 2",
                    render: {
                        source: "flow source 2",
                        graph: { nodes: [1], edges: [2] },
                    },
                },
            ])
        })

        it("returns item without render when flow fetch fails", async () => {
            fetchApiCachedOptional.mockResolvedValue(null)

            const items = [{ blueprintId: "bp1", name: "Item 1" }]

            const result = await resolveBlueprintRenders(items)

            expect(result).toEqual([{ blueprintId: "bp1", name: "Item 1" }])
        })

        it("returns item with source only when graph fetch fails but flow succeeds", async () => {
            fetchApiCachedOptional.mockImplementation(async (url: string) => {
                if (url.endsWith("/graph")) return null
                return { flow: "flow source" }
            })

            const items = [{ blueprintId: "bp1", name: "Item 1" }]

            const result = await resolveBlueprintRenders(items)

            expect(result).toEqual([
                {
                    blueprintId: "bp1",
                    name: "Item 1",
                    render: { source: "flow source", graph: null },
                },
            ])
        })

        it("handles empty array", async () => {
            const result = await resolveBlueprintRenders([])
            expect(result).toEqual([])
        })
    })

    describe("fetchToolBlueprintCount", () => {
        it("returns total on success", async () => {
            fetchApiCachedOptional.mockResolvedValue({ total: 42 })

            const result = await fetchToolBlueprintCount("terraform")

            expect(result).toBe(42)
            expect(fetchApiCachedOptional).toHaveBeenCalledWith(
                "/blueprints/versions/latest?q=terraform&size=1",
            )
        })

        it("returns 0 when total is missing", async () => {
            fetchApiCachedOptional.mockResolvedValue({})

            const result = await fetchToolBlueprintCount("terraform")

            expect(result).toBe(0)
        })

        it("returns 0 when fetch returns null", async () => {
            fetchApiCachedOptional.mockResolvedValue(null)

            const result = await fetchToolBlueprintCount("terraform")

            expect(result).toBe(0)
        })

        it("encodes tool name in URL", async () => {
            fetchApiCachedOptional.mockResolvedValue({ total: 5 })

            await fetchToolBlueprintCount("my tool")

            expect(fetchApiCachedOptional).toHaveBeenCalledWith(
                "/blueprints/versions/latest?q=my%20tool&size=1",
            )
        })
    })
})
