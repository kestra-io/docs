import { describe, expect, it } from "vitest"
import remarkSectionIds, { sectionId } from "./index.mjs"

type Node = {
    type: string
    value?: string
    depth?: number
    children?: Node[]
    data?: { hProperties?: Record<string, unknown> }
}

const heading = (depth: number, ...children: Node[]): Node => ({
    type: "heading",
    depth,
    children,
})
const text = (value: string): Node => ({ type: "text", value })

function run(tree: Node, frontmatter: Record<string, unknown> | undefined) {
    const transform = remarkSectionIds() as (tree: Node, file: unknown) => void
    transform(tree, { data: { astro: { frontmatter } } })
    return tree
}

const idOf = (node: Node | undefined) => node?.data?.hProperties?.id

describe("sectionId", () => {
    it.each([
        ["3.2.2 Rationalize", "section-3-2-2"],
        ["7.2 What leaving costs, and when it pays back", "section-7-2"],
        ["8.1 Run a proof of concept with us", "section-8-1"],
        ["7. Build the business case", "section-7"],
        ["  1.1 Leading space", "section-1-1"],
        ["7.2. Trailing dot", "section-7-2"],
        ["10.3 Two digits", "section-10-3"],
        ["Start here", null],
        ["2026 in review", null],
        ["3.2.2Rationalize", null],
        ["v3.2 notes", null],
    ])("%j -> %s", (input, expected) => {
        expect(sectionId(input)).toBe(expected)
    })
})

describe("remarkSectionIds", () => {
    it("sets ids on numbered headings when the file opts in", () => {
        const tree: Node = {
            type: "root",
            children: [
                heading(2, text("3. Stage 1 - Assess")),
                heading(4, text("3.2.2 "), {
                    type: "strong",
                    children: [text("Rationalize")],
                }),
                heading(2, text("Start here")),
            ],
        }
        run(tree, { sectionIds: true })
        expect(tree.children!.map(idOf)).toEqual([
            "section-3",
            "section-3-2-2",
            undefined,
        ])
    })

    it("leaves every other file untouched", () => {
        const tree: Node = {
            type: "root",
            children: [heading(2, text("1. Install"))],
        }
        run(tree, undefined)
        run(tree, { title: "x" })
        expect(idOf(tree.children![0])).toBeUndefined()
    })

    it("keeps an id that is already set", () => {
        const node = heading(3, text("1.2 Keep me"))
        node.data = { hProperties: { id: "custom" } }
        run({ type: "root", children: [node] }, { sectionIds: true })
        expect(idOf(node)).toBe("custom")
    })

    it("only opts in on a literal true", () => {
        for (const sectionIds of ["true", "false", 1, "yes"]) {
            const node = heading(2, text("7. Build the business case"))
            run({ type: "root", children: [node] }, { sectionIds })
            expect(idOf(node)).toBeUndefined()
            expect(node.children).toEqual([text("7. Build the business case")])
        }
    })

    it("reads the number through links and inline code", () => {
        const linked = heading(
            3,
            { type: "link", children: [text("3.1")] },
            text(" Estate"),
        )
        const coded = heading(
            4,
            { type: "inlineCode", value: "5.2.1" },
            text(" Code"),
        )
        run({ type: "root", children: [linked, coded] }, { sectionIds: true })
        expect([idOf(linked), idOf(coded)]).toEqual([
            "section-3-1",
            "section-5-2-1",
        ])
    })

    it("gives the same result when run twice", () => {
        const tree: Node = {
            type: "root",
            children: [heading(2, text("7. Build the business case"))],
        }
        run(tree, { sectionIds: true })
        const once = JSON.stringify(tree)
        run(tree, { sectionIds: true })
        expect(JSON.stringify(tree)).toBe(once)
    })
})

describe("chapter numbers", () => {
    const numberSpan = (value: string) => ({
        type: "sectionNumber",
        data: {
            hName: "span",
            hProperties: {
                className: ["section-number", "visually-hidden"],
            },
        },
        children: [text(value)],
    })

    it("wraps an h2's number so it can be shown apart from the title", () => {
        const node = heading(2, text("7. Build the business case"))
        run({ type: "root", children: [node] }, { sectionIds: true })
        expect(idOf(node)).toBe("section-7")
        expect(node.children).toEqual([
            numberSpan("7."),
            text(" Build the business case"),
        ])
    })

    it("keeps the full text, number included, for the TOC", () => {
        const node = heading(2, text("3. Stage 1 - Assess"))
        run({ type: "root", children: [node] }, { sectionIds: true })
        const flat = (n: Node): string =>
            n.value ?? (n.children ?? []).map(flat).join("")
        expect(flat(node)).toBe("3. Stage 1 - Assess")
    })

    it("leaves section and subsection numbers inline", () => {
        const h3 = heading(3, text("7.2 What leaving costs"))
        const h4 = heading(4, text("3.2.2 Rationalize"))
        run({ type: "root", children: [h3, h4] }, { sectionIds: true })
        expect(h3.children).toEqual([text("7.2 What leaving costs")])
        expect(h4.children).toEqual([text("3.2.2 Rationalize")])
    })

    it("does not rewrite an h2 whose number is inside other markup", () => {
        const node = heading(
            2,
            { type: "strong", children: [text("7.")] },
            text(" Title"),
        )
        run({ type: "root", children: [node] }, { sectionIds: true })
        expect(idOf(node)).toBe("section-7")
        expect(node.children?.[0].type).toBe("strong")
    })
})
