import posthog from 'posthog-js'
const gtm = useGtm()

export default function(email) {
    gtm?.trackEvent({
        event: 'identify',
        category: 'sys',
        noninteraction: true,
        email: email
    })

    posthog.identify(
        posthog.get_distinct_id(),
        {email: email}
    );
}

