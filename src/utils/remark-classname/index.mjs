import { visit } from "unist-util-visit"

export default function () {
    return function (tree, _file) {
        visit(tree, function (node) {
            if (node.type !== "table") return
            // add classname 'table' to all table nodes
            const data = node.data || (node.data = {})

            if (!data.hProperties) data.hProperties = {}
            if (data.hProperties.className) {
                if (Array.isArray(data.hProperties.className)) {
                    data.hProperties.className.push("table", "table-dark")
                } else {
                    data.hProperties.className = [data.hProperties.className, "table", "table-dark"]
                }
            } else {
                data.hProperties.className = "table table-dark"
            }
        })
    }
}