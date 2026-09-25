// Generic "Get Started / Book a Demo" button pair shown inside /resources
// articles. Built as static HAST so it ships no hydration; clicks are tracked
// by the delegated listener in ResourceArticle.astro via `data-resource-cta`.

/**
 * @param {"mid" | "end"} placement
 */
export function resourceCtaChildren(placement) {
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
 */
export function resourceCtaElement(placement) {
    return {
        type: "element",
        tagName: "div",
        properties: resourceCtaProperties(placement),
        children: resourceCtaChildren(placement),
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
