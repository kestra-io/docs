import { describe, expect, it } from "vitest"
import { blogsSearchResults, type BlogEntry } from "~/utils/search/blogs"

const post = (
    id: string,
    date: string,
    extra: Partial<BlogEntry>,
): BlogEntry => ({
    id,
    title: id,
    description: "",
    date,
    category: "Solutions",
    authors: [
        {
            name: "Elliot Gunn",
            role: "Product Marketing Manager",
            avatar: "/egunn.png",
        },
    ],
    headings: [],
    minutes: 5,
    ...extra,
})

const posts = [
    post("eol", "2026-04-06T09:00:00.000Z", {
        title: "Airflow 2 End of Life",
        description: "A forced decision point",
    }),
    post("alternatives", "2026-01-18T09:00:00.000Z", {
        title: "Enterprise Orchestration Alternatives",
        description: "Thinking of migrating off Airflow?",
    }),
    post("platforms", "2026-04-10T09:00:00.000Z", {
        title: "Top Data Orchestration Platforms",
        headings: ["Apache Airflow"],
    }),
    post("upgrade", "2026-01-27T09:00:00.000Z", {
        title: "Airflow 3 vs Airflow 2",
        category: "Engineering",
    }),
    post("release", "2026-09-01T09:00:00.000Z", {
        title: "Kestra 2.0 is out",
        category: "News & Products Updates",
        authors: [{ name: "Anna Geller" }, { name: "Loïc Mathieu" }],
    }),
]

const ids = (query: string, fullTextUrls?: string[]) =>
    blogsSearchResults(posts, query, fullTextUrls).results.map((r) => r.blog.id)

describe("blogsSearchResults", () => {
    it("ranks title matches, then description, then headings, newest first in each", () => {
        expect(ids("airflow")).toEqual([
            "eol",
            "upgrade",
            "alternatives",
            "platforms",
        ])
    })

    it("matches unfinished words, every word required", () => {
        expect(ids("airfl")).toHaveLength(4)
        expect(ids("airflow end")).toEqual(["eol"])
    })

    it("finds posts by category and author", () => {
        expect(ids("engineering")).toEqual(["upgrade"])
        expect(ids("anna")).toEqual(["release"])
    })

    it("adds the posts only the full-text search found after the others", () => {
        expect(ids("airflow", ["blogs/release", "blogs/eol"])).toEqual([
            "eol",
            "upgrade",
            "alternatives",
            "platforms",
            "release",
        ])
    })

    it("lists the newest posts before anything is typed", () => {
        expect(ids(" ")[0]).toBe("release")
    })

    it("builds rows with the date, the first author and every author's name", () => {
        const [row] = blogsSearchResults(posts, "kestra 2.0").results
        expect(row).toMatchObject({
            url: "blogs/release",
            type: "BLOGS",
            title: "Kestra 2.0 is out",
        })
        expect(row.blog).toMatchObject({
            date: "Sep 1, 2026",
            author: { name: "Anna Geller" },
            authorNames: "Anna Geller, Loïc Mathieu",
        })
    })
})
