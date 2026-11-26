import { describe, expect, it } from "vitest"
import { fullTextUrls, withFullTextMatches } from "~/utils/search/fullText"

const all = [
    { id: "airflow-eol" },
    { id: "release-0-19" },
    { id: "series-a" },
    { id: "fr/smile" },
]

describe("withFullTextMatches", () => {
    it("keeps the in-browser matches first and adds the server-only ones after, once each", () => {
        const urls = [
            "blogs/airflow-eol",
            "blogs/series-a",
            "blogs/fr/smile",
            "blogs/series-a",
        ]
        expect(
            withFullTextMatches([all[0]], all, urls, "blogs/").map((p) => p.id),
        ).toEqual(["airflow-eol", "series-a", "fr/smile"])
    })

    it("skips server results the index does not know", () => {
        expect(
            withFullTextMatches(
                [],
                all,
                ["docs/old-page", "docs/release-0-19"],
                "docs/",
            ).map((p) => p.id),
        ).toEqual(["release-0-19"])
    })
})

describe("fullTextUrls", () => {
    it("keeps the server results of one type", () => {
        const results = [
            { url: "docs/a", type: "DOCS" },
            { url: "blogs/b", type: "BLOGS" },
        ]
        expect(fullTextUrls(results, "BLOGS")).toEqual(["blogs/b"])
    })
})
