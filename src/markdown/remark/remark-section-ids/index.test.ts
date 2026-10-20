import type { Heading, Root } from "mdast"
import { describe, expect, it } from "vitest"
import remarkSectionIds, { sectionId } from "./index.mjs"

const heading = (depth: Heading["depth"], ...children: Heading["children"]) =>
    ({ type: "heading", depth, children }) as Heading
const text = (value: string) => ({ type: "text" as const, value })

function run(children: Heading[], frontmatter?: Record<string, unknown>) {
    const tree: Root = { type: "root", children }
    remarkSectionIds()(tree, { data: { astro: { frontmatter } } })
    return children.map((node) => node.data?.hProperties?.id)
}

describe("sectionId", () => {
    it.each([
        ["3.2.2 Rationalize", "section-3-2-2"],
        ["7. Build the business case", "section-7"],
        ["  7.2. Leading space, trailing dot", "section-7-2"],
        ["10.3 Two digits", "section-10-3"],
        ["Start here", null],
        ["2026 in review", null],
        ["3.2.2Rationalize", null],
    ])("%j -> %s", (input, expected) => {
        expect(sectionId(input)).toBe(expected)
    })
})

describe("remarkSectionIds", () => {
    it("sets ids on numbered headings, reading through inline markup", () => {
        const custom = heading(3, text("1.2 Keep me"))
        custom.data = { hProperties: { id: "custom" } }
        const ids = run(
            [
                heading(
                    4,
                    { type: "inlineCode", value: "5.2.1" },
                    text(" Code"),
                ),
                heading(
                    3,
                    { type: "link", url: "", children: [text("3.1")] },
                    text(" Estate"),
                ),
                heading(2, text("Start here")),
                custom,
            ],
            { sectionIds: true },
        )
        expect(ids).toEqual([
            "section-5-2-1",
            "section-3-1",
            undefined,
            "custom",
        ])
    })

    it("only runs when the frontmatter opts in with a literal true", () => {
        for (const frontmatter of [undefined, { sectionIds: "true" }]) {
            expect(run([heading(2, text("1. Install"))], frontmatter)).toEqual([
                undefined,
            ])
        }
    })

    it("wraps an h2's number once, keeping the full text", () => {
        const h2 = heading(2, text("7. Build the business case"))
        const h3 = heading(3, text("7.2 What leaving costs"))
        run([h2, h3], { sectionIds: true })
        run([h2, h3], { sectionIds: true })
        expect(h2.children).toEqual([
            {
                type: "sectionNumber",
                data: {
                    hName: "span",
                    hProperties: {
                        className: ["section-number", "visually-hidden"],
                    },
                },
                children: [text("7.")],
            },
            text(" Build the business case"),
        ])
        expect(h3.children).toEqual([text("7.2 What leaving costs")])
    })
})
