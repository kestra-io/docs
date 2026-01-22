import posthog from "posthog-js"

document.addEventListener("astro:page-load", () => {
    let _hsq = (window._hsq = window._hsq || [])
    _hsq.push(["setPath", window.location.pathname + window.location.search])
    _hsq.push(["trackPageView"])

    if (window?.HubSpotConversations?.widget) {
        window.HubSpotConversations.widget.refresh()
    }
})

document.addEventListener("astro:page-load", () => {
    posthog.capture("$pageview")
})