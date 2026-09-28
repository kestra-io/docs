import { visit } from "unist-util-visit"

// Gives numbered headings stable `section-…` ids, for pages whose PDF or
// other documents deep-link into them: "3.2.2 Rationalize" becomes
// id="section-3-2-2" and "7. Build the business case" becomes "section-7".
// Heading text can change without breaking those links, as long as the
// number stays.
//
// Chapter headings (h2) also get their number wrapped in
// <span class="section-number">, so the page can show it apart from the
// title. The number stays in the heading's text, so the table of contents
// and screen readers still get "7. Build the business case".
//
// Opt-in per file with `sectionIds: true` in the frontmatter, so no other
// page's headings change. Headings without a leading number, or with an id
// already set, are left to rehypeHeadingIds.

// "3.2.2 " or "7. ", but not a bare "2026 ".
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
                hProperties: { className: ["section-number"] },
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
