import type { Element, ElementContent, Root } from "hast"
import type { VFile } from "vfile"
import { SKIP, visit } from "unist-util-visit"
import type { ResourceTag } from "../../components/resources/tags"
import { RESOURCE_PATH } from "../remark/remark-custom-elements/resource-cta.mjs"

type Placement = "mid" | "end"

// Pages with fewer h2s are too short for a mid-article CTA.
export const MIN_H2_FOR_MID_CTA = 4

// Tagline per resources section (front-matter `tag`): a question mid-article,
// a statement at the end, so the two blocks never repeat each other. Tags
// without an entry get `default`.
const TAGLINES: Record<
    Placement,
    Partial<Record<ResourceTag, string>> & { default: string }
> = {
    mid: {
        data: "Ready to orchestrate your data pipelines?",
        infrastructure: "Ready to orchestrate your infrastructure?",
        ai: "Ready to run your AI workflows in production?",
        business: "Ready to automate your business processes?",
        default: "Ready to orchestrate everything from one place?",
    },
    end: {
        data: "Your data pipelines, orchestrated end to end.",
        infrastructure:
            "Terraform, Ansible and Kubernetes, orchestrated from one place.",
        ai: "Your AI agents and pipelines, orchestrated and observable.",
        business: "Your cross-team processes, automated without glue code.",
        default:
            "Data, infrastructure, AI and business, orchestrated from one place.",
    },
}

const element = (
    tagName: string,
    properties: Element["properties"],
    children: ElementContent[],
): Element => ({ type: "element", tagName, properties, children })

const text = (value: string): ElementContent => ({ type: "text", value })

// Tracked by the delegated click listener in ResourceArticle.astro.
const button = (
    placement: Placement,
    href: string,
    variant: string,
    label: string,
    action: string,
) =>
    element(
        "a",
        {
            href,
            className: ["btn", variant],
            dataEvent: `resource_${placement}_cta_${action}_click`,
        },
        [text(label)],
    )

/** Turn `node` into the Get Started / Book a Demo pair, as static HTML. */
function fillCta(node: Element, placement: Placement, tag?: ResourceTag) {
    const taglines = TAGLINES[placement]
    node.tagName = "div"
    node.properties = {
        className: ["resource-cta", `resource-cta-${placement}`],
        dataResourceCta: placement,
    }
    node.children = [
        element("p", { className: ["resource-cta-text"] }, [
            text((tag && taglines[tag]) ?? taglines.default),
        ]),
        element("div", { className: ["resource-cta-actions"] }, [
            button(
                placement,
                "/get-started",
                "btn-primary",
                "Get Started",
                "get_started",
            ),
            button(placement, "/demo", "btn-secondary", "Book a Demo", "demo"),
        ]),
    ]
    return node
}

const newCta = (placement: Placement, tag?: ResourceTag) =>
    fillCta(element("div", {}, []), placement, tag)

/**
 * Injects the Get Started / Book a Demo pair into /resources articles:
 * - mid-article, where the author put `::resource-cta`, otherwise right before
 *   the h2 at index ceil(nbH2 / 2), so it always sits on a section boundary
 * - at the end of the body, unless front-matter `cta:` renders the
 *   gated-asset block (ResourceCtaPair) instead
 */
export default function rehypeResourceCta() {
    return (tree: Root, file: VFile) => {
        if (!RESOURCE_PATH.test(file.path ?? "")) return

        const frontmatter = file.data.astro?.frontmatter
        const tag = frontmatter?.tag as ResourceTag | undefined

        let pinned = false
        visit(tree, "element", (node) => {
            if (node.properties.dataResourceCta !== "mid") return
            fillCta(node, "mid", tag)
            pinned = true
            return SKIP
        })

        const h2Indexes = tree.children.flatMap((child, i) =>
            child.type === "element" && child.tagName === "h2" ? [i] : [],
        )
        if (!pinned && h2Indexes.length >= MIN_H2_FOR_MID_CTA) {
            const target = h2Indexes[Math.ceil(h2Indexes.length / 2)]
            tree.children.splice(target, 0, newCta("mid", tag))
        }

        if (!frontmatter?.cta) {
            tree.children.push(newCta("end", tag))
        }
    }
}
