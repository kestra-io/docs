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
        visit(tree, "heading", (node) => {
            const id = sectionId(textOf(node))
            if (!id) return
            const data = node.data || (node.data = {})
            const properties = data.hProperties || (data.hProperties = {})
            if (properties.id) return
            properties.id = id
            if (node.depth === 2) wrapChapterNumber(node)
        })
    }
}