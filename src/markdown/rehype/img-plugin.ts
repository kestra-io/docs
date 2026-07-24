import { visit } from "unist-util-visit"

export default function imgPlugin() {
    return (tree: any) => {
        visit(tree, "element", (node) => {
            if (node.tagName === "img") {
                const existing = node.properties.className
                node.properties.className = [
                    "zoom",
                    ...(Array.isArray(existing)
                        ? existing
                        : existing
                          ? [existing]
                          : []),
                ]
            }
        })
    }
}