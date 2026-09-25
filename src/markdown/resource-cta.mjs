// Generic "Get Started / Book a Demo" button pair shown inside /resources
// articles. Built as static HAST so it ships no hydration; clicks are tracked
// by the delegated listener in ResourceArticle.astro via `data-resource-cta`.

// Tagline per resources section (front-matter `tag`): a question mid-article,
// a promise at the end, so the two blocks never repeat each other.
const TAGLINES = {
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

/**
 * @param {"mid" | "end"} placement
 * @param {string} [tag] front-matter `tag` of the resource
 */
export function resourceCtaTagline(placement, tag) {
    const lines = TAGLINES[placement]
    return lines[tag] ?? lines.default
}

/**
 * @param {"mid" | "end"} placement
 * @param {string} [tag]
 */
export function resourceCtaChildren(placement, tag) {
    return [
        {
            type: "element",
            tagName: "p",
            properties: { className: ["resource-cta-text"] },
            children: [
                {
                    type: "text",
                    value: resourceCtaTagline(placement, tag),
                },
            ],
        },
        {
            type: "element",
            tagName: "div",
            properties: { className: ["resource-cta-actions"] },
            children: resourceCtaButtons(placement),
        },
    ]
}

function resourceCtaButtons(placement) {
    return [
        link(
            "/get-started",
            "btn btn-primary",
            "Get Started",
            `resource_${placement}_cta_get_started_click`,
        ),
        link(
            "/demo",
            "btn btn-secondary",
            "Book a Demo",
            `resource_${placement}_cta_demo_click`,
        ),
    ]
}

/**
 * @param {"mid" | "end"} placement
 */
export function resourceCtaProperties(placement) {
    return {
        className: ["resource-cta", `resource-cta-${placement}`],
        dataResourceCta: placement,
    }
}

/**
 * @param {"mid" | "end"} placement
 * @param {string} [tag]
 */
export function resourceCtaElement(placement, tag) {
    return {
        type: "element",
        tagName: "div",
        properties: resourceCtaProperties(placement),
        children: resourceCtaChildren(placement, tag),
    }
}

function link(href, className, text, event) {
    return {
        type: "element",
        tagName: "a",
        properties: { href, className: className.split(" "), dataEvent: event },
        children: [{ type: "text", value: text }],
    }
}
