import { toString } from "mdast-util-to-string"
import { visit } from "unist-util-visit"

const NUMBERED = /^(\d+(?:\.\d+)+|\d+(?=\.))\.?\s/

/** `section-3-2-2` for a heading that starts with "3.2.2 ", else null. */
export function sectionId(text) {
    const match = NUMBERED.exec(text.trim())
    return match ? `section-${match[1].replaceAll(".", "-")}` : null
}

/**
 * Sets `section-…` ids on numbered headings of files whose frontmatter has
 * `sectionIds: true`, and wraps an h2's number in a visually hidden span.
 */
export default function remarkSectionIds() {
    return (tree, file) => {
        if (file.data?.astro?.frontmatter?.sectionIds !== true) return
        visit(tree, "heading", (node) => {
            const id = sectionId(toString(node))
            if (!id || node.data?.hProperties?.id) return
            node.data = {
                ...node.data,
                hProperties: { ...node.data?.hProperties, id },
            }
            const [first] = node.children
            const number =
                node.depth === 2 &&
                first?.type === "text" &&
                NUMBERED.exec(first.value)?.[0].trimEnd()
            if (!number) return
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
        })
    }
}
