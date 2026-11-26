import { describe, expect, it } from "vitest"
import { allSections } from "~/utils/search/all"

const row = (url: string, type: string, extra = {}) => ({
    url,
    type,
    title: url,
    ...extra,
})

describe("allSections", () => {
    it("keeps three rows per tab, in the given order, the first one carrying the header", () => {
        const rows = allSections([
            {
                type: "PLUGINS",
                label: "Plugins",
                results: [row("plugins/airflow", "PLUGINS")],
            },
            { type: "BLUEPRINTS", label: "Blueprints", results: [] },
            {
                type: "BLOGS",
                label: "Blog posts",
                results: ["a", "b", "c", "d"].map((id) =>
                    row(`blogs/${id}`, "BLOGS"),
                ),
            },
        ])
        expect(rows.map((r) => r.url)).toEqual([
            "plugins/airflow",
            "blogs/a",
            "blogs/b",
            "blogs/c",
        ])
        expect(rows.map((r) => r.section?.label)).toEqual([
            "Plugins",
            "Blog posts",
            undefined,
            undefined,
        ])
    })

    it("drops the docs section headers, the All section replaces them", () => {
        const [first] = allSections([
            {
                type: "DOCS",
                label: "Docs",
                results: [row("docs/a", "DOCS", { doc: { groupStart: true } })],
            },
        ])
        expect(first.doc?.groupStart).toBe(false)
    })
})
