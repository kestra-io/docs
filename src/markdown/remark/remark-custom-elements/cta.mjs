import {
    resourceCtaChildren,
    resourceCtaProperties,
} from "../../resource-cta.mjs"

// `::cta` pins the resources mid-article CTA to a specific spot and disables
// the automatic placement done by rehype/resource-cta.ts.
export function cta(data, _attributes, node, _file) {
    data.hName = "div"
    data.hProperties = resourceCtaProperties("mid")
    data.hChildren = resourceCtaChildren("mid")
    node.children = []
}
