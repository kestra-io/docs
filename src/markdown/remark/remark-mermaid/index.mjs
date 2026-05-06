import { visit } from "unist-util-visit"

/**
 * Remark plugin that converts mermaid fenced code blocks into raw HTML
 * <div class="mermaid"> elements before astro-expressive-code processes them.
 *
 * Without this, expressive-code captures the code block first and renders it
 * as a syntax-highlighted snippet rather than a diagram.
 */
export default function remarkMermaid() {
    return function (tree) {
        visit(tree, "code", (node, index, parent) => {
            if (node.lang !== "mermaid") return
            parent.children.splice(index, 1, {
                type: "html",
                value: `<div class="mermaid">${node.value}</div>`,
            })
        })
    }
}
