import { visit } from "unist-util-visit"

const NUMBERED = /^(\d+(?:\.\d+)+|\d+(?=\.))\.?\s/

function textOf(node) {
    if (node.type === "text" || node.type === "inlineCode") return node.value
    return (node.children ?? []).map(textOf).join("")
}

export function sectionId(text) {
    const match = NUMBERED.exec(text.trim())
    return match ? "section-" + match[1].split(".").join("-") : null
}

function wrapChapterNumber(node) {
    const first = node.children?.[0]
    if (first?.type !== "text") return
    const match = NUMBERED.exec(first.value)
    if (!match) return
    const number = match[0].trimEnd()
    node.children.splice(
        0,
        1,
        {
            type: "sectionNumber",
            data: {
                hName: "span",
                hProperties: {
                    className: ["section-number", "visually-hidden"],
                },
            },
            children: [{ type: "text", value: number }],
        },
        { type: "text", value: first.value.slice(number.length) },
    )
}

export default function remarkSectionIds() {
    return function (tree, file) {
        if (file.data?.astro?.frontmatter?.sectionIds !== true) return
        // Two headings with the same number would otherwise share an id;
        // the second gets a `-2` suffix, as rehype-slug does for slugs.
        const seen = new Map()
        visit(tree, "heading", (node) => {
            const base = sectionId(textOf(node))
            if (!base) return
            const data = node.data || (node.data = {})
            const properties = data.hProperties || (data.hProperties = {})
            if (properties.id) return
            const count = (seen.get(base) ?? 0) + 1
            seen.set(base, count)
            const id = count === 1 ? base : `${base}-${count}`
            properties.id = id
            if (node.depth === 2) wrapChapterNumber(node)
        })
    }
}