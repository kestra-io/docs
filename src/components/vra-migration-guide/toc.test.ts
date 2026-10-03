import { describe, expect, it } from "vitest"
import { buildTocTree, tocLinks } from "./toc"

const h = (depth: number, text: string, slug: string) => ({ depth, text, slug })

describe("tocLinks", () => {
    it("keeps h2, h3 and numbered h4, drops the rest", () => {
        const links = tocLinks([
            h(2, "Start here", "start-here"),
            h(2, "7. Build the business case", "section-7"),
            h(3, "7.1 What improves", "section-7-1"),
            h(
                4,
                "Start with the numbers you already have",
                "start-with-the-numbers",
            ),
            h(3, "3.2 The workflows", "section-3-2"),
            h(4, "3.2.2 Rationalize", "section-3-2-2"),
            h(5, "5.5.5.5 Too deep", "deep"),
        ])
        expect(links.map((l) => l.id)).toEqual([
            "start-here",
            "section-7",
            "section-7-1",
            "section-3-2",
            "section-3-2-2",
        ])
    })
})

describe("buildTocTree", () => {
    it("nests sections under chapters and subsections under sections", () => {
        const tree = buildTocTree([
            { depth: 2, text: "Start here", id: "start-here" },
            { depth: 2, text: "3. Assess", id: "section-3" },
            { depth: 3, text: "3.1 Estate", id: "section-3-1" },
            { depth: 4, text: "3.1.1 Parts", id: "section-3-1-1" },
            { depth: 3, text: "3.2 Workflows", id: "section-3-2" },
            { depth: 2, text: "Reference handouts", id: "reference-handouts" },
        ])
        expect(tree.map((n) => n.id)).toEqual([
            "start-here",
            "section-3",
            "reference-handouts",
        ])
        expect(tree[1].children.map((n) => n.id)).toEqual([
            "section-3-1",
            "section-3-2",
        ])
        expect(tree[1].children[0].children.map((n) => n.id)).toEqual([
            "section-3-1-1",
        ])
    })

    it("does not lose headings that skip a level", () => {
        const tree = buildTocTree([
            { depth: 3, text: "orphan section", id: "a" },
            { depth: 4, text: "orphan sub", id: "b" },
        ])
        expect(tree.map((n) => n.id)).toEqual(["a"])
        expect(tree[0].children.map((n) => n.id)).toEqual(["b"])
    })
})
