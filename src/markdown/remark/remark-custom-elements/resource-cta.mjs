// Content files of the resources collection, the only pages with CTAs.
export const RESOURCE_PATH = /[\\/]src[\\/]contents[\\/]resources[\\/]/

// `::resource-cta` pins the mid-article CTA to this spot. It only leaves a
// marker: rehype/resource-cta.ts fills it in and skips the automatic one.
export function resourceCta(data, _attributes, node, file) {
    if (
        node.type !== "leafDirective" ||
        !RESOURCE_PATH.test(file?.path ?? "")
    ) {
        throw new Error(
            "resource-cta directive is only supported as `::resource-cta` on /resources pages",
        )
    }
    data.hName = "div"
    data.hProperties = { dataResourceCta: "mid" }
    node.children = []
}
