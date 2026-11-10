import { describe, expect, it } from "vitest"
import { prepareSearchResults } from "~/utils/searchResults"

const blog = (overrides: Record<string, unknown> = {}) => ({
    url: "blogs/hello-assets",
    type: "BLOGS",
    title: "Hello, Assets: Unifies Orchestration, Catalogs, and Lineage",
    highlights: [],
    ...overrides,
})

describe("prepareSearchResults", () => {
    // Regression: the BLOGS facet rendered "No results found" because the
    // index contained blogs/CLAUDE (a frontmatter-less file) with a null
    // title, and mapping over it threw before any result could render.
    it("drops entries with a null title instead of failing the whole list", () => {
        const results = prepareSearchResults(
            [
                blog(),
                { url: "blogs/CLAUDE", type: "BLOGS", title: null },
                blog({ url: "blogs/release-1-2", title: "Kestra 1.2" }),
            ],
            "assets",
        )

        expect(results.map((r) => r.url)).toEqual([
            "blogs/hello-assets",
            "blogs/release-1-2",
        ])
    })

    it("drops entries missing the url or type the UI renders", () => {
        const results = prepareSearchResults(
            [blog({ url: undefined }), blog({ type: undefined }), blog()],
            "assets",
        )

        expect(results).toHaveLength(1)
    })

    it("marks the matched part of the title, case-insensitively", () => {
        const [result] = prepareSearchResults([blog()], "ASSETS")

        expect(result.highlightTitle).toBe(
            "Hello, <mark>Assets</mark>: Unifies Orchestration, Catalogs, and Lineage",
        )
    })

    it("leaves titles without a match unhighlighted", () => {
        const [result] = prepareSearchResults([blog()], "terraform")

        expect(result.highlightTitle).toBeUndefined()
    })

    it("skips highlighting for an empty or blank search value", () => {
        expect(prepareSearchResults([blog()], "")[0].highlightTitle)
            .toBeUndefined()
        expect(prepareSearchResults([blog()], "   ")[0].highlightTitle)
            .toBeUndefined()
        expect(prepareSearchResults([blog()], undefined)[0].highlightTitle)
            .toBeUndefined()
    })

    it("returns an empty list for a missing or non-array response", () => {
        expect(prepareSearchResults(undefined, "assets")).toEqual([])
        expect(prepareSearchResults(null, "assets")).toEqual([])
        expect(prepareSearchResults({ results: [] }, "assets")).toEqual([])
    })
})
