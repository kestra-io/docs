import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { sectionId } from "~/markdown/remark/remark-section-ids/index.mjs"

// The PDF, the Google Doc and the page itself link into these ids, so a copy
// edit that renumbers or drops a heading has to fail here, not in production.
const LINKED_FROM_OUTSIDE = ["section-3-2-2", "section-7-2", "section-8-1"]

const source = readFileSync(
    fileURLToPath(
        new URL(
            "../../contents/resources/vra-migration-guide/index.mdx",
            import.meta.url,
        ),
    ),
    "utf8",
)

const headings = source
    .split("\n")
    .map((line) => /^(#{2,6})\s+(.*)$/.exec(line))
    .filter((m): m is RegExpExecArray => m !== null)
    .map((m) => ({ depth: m[1].length, text: m[2], id: sectionId(m[2]) }))

describe("vRA migration guide headings", () => {
    it("opts in to section ids", () => {
        expect(source).toMatch(/^sectionIds: true$/m)
    })

    it("has every id that other documents link to", () => {
        const ids = headings.map((h) => h.id)
        for (const id of LINKED_FROM_OUTSIDE) expect(ids).toContain(id)
    })

    it("never gives two headings the same section id", () => {
        const ids = headings.map((h) => h.id).filter(Boolean)
        expect(new Set(ids).size).toBe(ids.length)
    })

    it("numbers every chapter", () => {
        const chapters = headings.filter(
            (h) =>
                h.depth === 2 &&
                h.text !== "Start here" &&
                h.text !== "Reference handouts",
        )
        expect(chapters.map((h) => h.id)).toEqual(
            Array.from({ length: 8 }, (_, i) => `section-${i + 1}`),
        )
    })

    it("gives 3.1.2 to the target architectures, not the old 3.1.5", () => {
        const ids = headings.map((h) => h.id)
        expect(ids).toContain("section-3-1-2")
        expect(ids).not.toContain("section-3-1-5")
        expect(source).not.toMatch(/section-3-1-[35]\b/)
    })

    it("resolves every in-page anchor link to a heading or a known anchor", () => {
        const ids = new Set(headings.map((h) => h.id))
        // Not headings: the verdict legend and the part list in 3.1.1.
        const other = new Set(["verdicts", "parts"])
        expect(source).toContain('legendId="verdicts"')
        expect(source).toContain('id="parts"')
        // Handout cards and the FAQ render outside the MDX headings.
        const outside = new Set([
            "appendix-a",
            "appendix-b",
            "appendix-c",
            "faq",
        ])
        const links = [...source.matchAll(/(?:\]\(|href=")#([a-z0-9-]+)/g)].map(
            (m) => m[1],
        )
        for (const link of new Set(links)) {
            expect(
                ids.has(link) || other.has(link) || outside.has(link),
                link,
            ).toBe(true)
        }
    })
})
