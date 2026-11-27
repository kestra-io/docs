import { describe, expect, it } from "vitest"
import {
    fullTextMatches,
    fullTextSnippets,
    snippetParts,
    withFullTextMatches,
} from "~/utils/search/fullText"

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

describe("fullTextMatches", () => {
    it("keeps the server results of one type with their excerpts", () => {
        const results = [
            { url: "docs/a", type: "DOCS", highlights: ["a"] },
            { url: "blogs/b", type: "BLOGS", highlights: ["<mark>b</mark>"] },
        ]
        expect(fullTextMatches(results, "BLOGS")).toEqual([
            { url: "blogs/b", highlights: ["<mark>b</mark>"] },
        ])
    })
})

describe("snippetParts", () => {
    it("turns a server excerpt into plain text with the matches marked", () => {
        expect(
            snippetParts(
                '/inputs-2-0.png)\n<br />:::alert{type="info"}\n<br />The plural form `<mark>defaults</mark>` is used instead of `<mark>default</mark>`.',
            ),
        ).toEqual([
            { text: "The plural form ", mark: false },
            { text: "defaults", mark: true },
            { text: " is used instead of ", mark: false },
            { text: "default", mark: true },
            { text: ".", mark: false },
        ])
    })

    it("never keeps markup other than the marks", () => {
        const text = snippetParts(
            '<img src=x onerror="alert(1)"><mark>a</mark>',
        )
            .map((part) => part.text)
            .join("")
        expect(text).not.toContain("<")
    })
})

describe("fullTextSnippets", () => {
    it("keeps the first excerpt with a match for each page", () => {
        const snippets = fullTextSnippets(
            [
                {
                    url: "docs/tutorial/inputs",
                    highlights: ["no match", "set <mark>defaults</mark>"],
                },
            ],
            "docs/",
        )
        expect(snippets.get("tutorial/inputs")).toEqual([
            { text: "set ", mark: false },
            { text: "defaults", mark: true },
        ])
    })
})
