import posthog from "posthog-js"
import { useGtm } from "@gtm-support/vue-gtm"

export default function (email) {
    const gtm = useGtm()
    gtm?.trackEvent({
        event: "identify",
        category: "sys",
        noninteraction: true,
        email: email,
    })

    posthog.identify(posthog.get_distinct_id(), { email: email })

    if (window.signals) {
        window.signals.identify({ email: email })
    }

    let _hsq = (window._hsq = window._hsq || [])
    _hsq.push(["identify", { email: email }])
}