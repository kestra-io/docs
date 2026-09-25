import type { Element, Root } from "hast"
import type { VFile } from "vfile"
import { resourceCtaElement } from "../resource-cta.mjs"

// Pages with fewer h2s are too short for a mid-article CTA.
export const MIN_H2_FOR_MID_CTA = 4

const isResource = (file: VFile) =>
    /[\\/]src[\\/]contents[\\/]resources[\\/]/.test(file.path ?? "")

const hasManualMidCta = (node: Root | Element): boolean =>
    node.children.some(
        (child) =>
            child.type === "element" &&
            (child.properties?.dataResourceCta === "mid" ||
                hasManualMidCta(child)),
    )

/**
 * Injects the Get Started / Book a Demo pair into /resources articles:
 * - mid-article, right before the h2 at index ceil(nbH2 / 2), so it always
 *   sits on a section boundary; skipped when the author pinned one with `::cta`
 * - at the end of the body, unless front-matter `cta:` renders the
 *   gated-asset block (ResourceCtaPair) instead
 */
export default function rehypeResourceCta() {
    return (tree: Root, file: VFile) => {
        if (!isResource(file)) return

        const h2Indexes = tree.children.flatMap((child, i) =>
            child.type === "element" && child.tagName === "h2" ? [i] : [],
        )

        if (h2Indexes.length >= MIN_H2_FOR_MID_CTA && !hasManualMidCta(tree)) {
            const target = h2Indexes[Math.ceil(h2Indexes.length / 2)]
            tree.children.splice(target, 0, resourceCtaElement("mid"))
        }

        const frontmatter = (file.data.astro as any)?.frontmatter
        if (!frontmatter?.cta) {
            tree.children.push(resourceCtaElement("end"))
        }
    }
}
