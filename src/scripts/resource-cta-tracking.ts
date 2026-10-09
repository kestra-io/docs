import posthog from "posthog-js"

// Delegated so it survives Astro client-side navigations. Same fan-out as
// ResourceCtaPair: PostHog, GTM and HubSpot behavioural events.
document.addEventListener(
    "click",
    (e) => {
        const link = (e.target as Element | null)?.closest<HTMLElement>(
            "[data-resource-cta] a[data-event]",
        )
        const event = link?.dataset.event
        if (!event) return

        posthog.capture(event)
        ;(window.dataLayer = window.dataLayer || []).push({
            event,
            noninteraction: false,
        })
        ;(window._hsq = window._hsq || []).push([
            "trackCustomBehavioralEvent",
            { name: event },
        ])
    },
    { capture: true, passive: true },
)
