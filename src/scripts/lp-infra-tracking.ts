import posthog from "posthog-js"

/* Clicks on /lp/automate-infra. Same fan-out as resource-cta-tracking.ts:
 * PostHog, GTM (dataLayer) and HubSpot behavioural events. Any element with
 * `data-event` inside the page is tracked; the call form's submit is not,
 * because Meeting.vue already sends `bookdemo_form`.
 *
 * Each event carries the page variant, so ads reports can split the G_AWX
 * visitors (lp_variant "awx", with the headline they saw) from everyone else. */

function context() {
    const root = document.documentElement
    const params = new URLSearchParams(location.search)
    return {
        lp_variant: root.dataset.lpVariant || "default",
        lp_headline: root.dataset.lpHeadline || null,
        utm_term: params.get("utm_term"),
    }
}

document.addEventListener(
    "click",
    ({ target }) => {
        if (!(target instanceof Element)) return
        const event = target.closest<HTMLElement>(".lp-page [data-event]")
            ?.dataset.event
        if (!event) return

        const properties = context()
        posthog.capture(event, properties)
        ;(window.dataLayer = window.dataLayer || []).push({
            event,
            ...properties,
            noninteraction: false,
        })
        ;(window._hsq = window._hsq || []).push([
            "trackCustomBehavioralEvent",
            { name: event },
        ])
    },
    { capture: true, passive: true },
)
