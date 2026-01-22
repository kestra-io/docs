import { visit } from "unist-util-visit"
import { alert } from "./alert.mjs"
import { collapse } from "./collapse.mjs"
import { ChildCard } from "./ChildCard.mjs"
import { badge } from "./badge.mjs"
import { NextLink } from "./next-link.mjs"

const componentMap = {
    alert,
    collapse,
    ChildCard,
    badge,
    "next-link": NextLink,
}

export default function () {
    return function (tree, file) {
        visit(tree, function (node) {
            if (
                node.type == "containerDirective" ||
                node.type == "leafDirective" ||
                node.type === "textDirective"
            ) {
                if (!(node.name in componentMap)) return
                const data = node.data || (node.data = {})
                const attributes = node.attributes || {}

                componentMap[node.name](data, attributes, node, file)
            }
        })
    }
}