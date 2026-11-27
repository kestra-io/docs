import { describe, expect, it } from "vitest"
import { allResults } from "~/utils/search/all"

const row = (url: string, type: string, title: string, extra = {}) => ({
    url,
    type,
    title,
    ...extra,
})

describe("allResults", () => {
    it("puts exact titles first, then title matches, then the rest", () => {
        const rows = allResults(
            [
                {
                    kind: "Plugin",
                    results: [
                        row("plugins/a", "PLUGINS", "Kafka Connect"),
                        row("plugins/b", "PLUGINS", "Messaging"),
                    ],
                },
                {
                    kind: "Docs",
                    results: [row("docs/a", "DOCS", "Kafka")],
                },
            ],
            "kafka",
        )
        expect(rows.map((r) => r.url)).toEqual([
            "docs/a",
            "plugins/a",
            "plugins/b",
        ])
    })

    it("lets the tabs take turns at the same level, each in its own order", () => {
        const rows = allResults(
            [
                {
                    kind: "Plugin",
                    results: ["a", "b", "c"].map((id) =>
                        row(`plugins/${id}`, "PLUGINS", `Airflow ${id}`),
                    ),
                },
                {
                    kind: "Blog post",
                    results: ["a", "b"].map((id) =>
                        row(`blogs/${id}`, "BLOGS", `Airflow ${id}`),
                    ),
                },
            ],
            "airflow",
        )
        expect(rows.map((r) => r.url)).toEqual([
            "plugins/a",
            "blogs/a",
            "plugins/b",
            "blogs/b",
            "plugins/c",
        ])
        expect(rows.map((r) => r.kind)).toEqual([
            "Plugin",
            "Blog post",
            "Plugin",
            "Blog post",
            "Plugin",
        ])
    })

    it("matches docs on their full title and drops their section headers", () => {
        const [first] = allResults(
            [
                {
                    kind: "Blueprint",
                    results: [
                        row(
                            "blueprints/a",
                            "BLUEPRINTS",
                            "Secrets management with Vault",
                        ),
                    ],
                },
                {
                    kind: "Docs",
                    results: [
                        row("docs/a", "DOCS", "Secrets", {
                            doc: {
                                fullTitle: "Secrets management",
                                groupStart: true,
                            },
                        }),
                    ],
                },
            ],
            "secrets management",
        )
        expect(first.url).toBe("docs/a")
        expect(first.doc?.groupStart).toBe(false)
    })
})
