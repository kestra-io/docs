import { run as runCookieConsent } from "vanilla-cookieconsent"
import posthog from "posthog-js"
import identify from "~/utils/identify"
import { $fetchApi } from "~/utils/fetch"
import { GTM_ID } from "astro:env/client"

const isEurope =
    Intl.DateTimeFormat().resolvedOptions().timeZone.indexOf("Europe") === 0

// The site uses Astro's <ClientRouter /> in production, so navigating between
// pages is a client-side transition, not a full reload. These guards make sure
// the one-time bootstrap (consent modal, GTM/PostHog init) runs only once,
// while the page-view event is pushed on *every* navigation so GTM triggers
// (and conversion tags) fire on soft navigations too — not just the first load.
let analyticsEnabled = false
let marketingEnabled = false
let consentInitialized = false

const pushPageView = () => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
        event: "content-view",
        "content-name": window.location.pathname + window.location.search,
        "content-view-name": window.astroClientConfig?.slug,
    })
}

const enabledAnalytics = async () => {
    // Push a page-view on every navigation (including client-side transitions).
    if (analyticsEnabled) {
        pushPageView()
        return
    }
    analyticsEnabled = true

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
    })

    // Load GTM through Partytown so gtm.js and every gtag config it pulls in
    // run inside a web worker instead of the main thread. Partytown only
    // scans for `text/partytown` scripts at startup, so scripts appended
    // later (like this consent-gated one) must be announced with `ptupdate`.
    const s = document.createElement("script")
    s.async = true
    s.type = "text/partytown"
    s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
    document.head.appendChild(s)
    window.dispatchEvent(new CustomEvent("ptupdate"))

    const response = await $fetchApi<{
        posthog: { token: string }
        id: string
    }>("/config", {
        credentials: "include",
    })

    posthog.init(response.posthog.token, {
        api_host: window.location.origin + "/t/",
        ui_host: "https://eu.posthog.com",
        capture_pageview: false,
        capture_pageleave: true,
        autocapture: false,
        disable_session_recording: false,
    })

    posthog.register_for_session({
        from: "SITE",
    })

    if (!posthog.get_property("__alias")) {
        posthog.alias(response.id)
    }

    posthog.capture("$pageview")

    window.dataLayer.push({
        event: "identify",
        category: "sys",
        noninteraction: true,
        kuid: response.id,
    })

    pushPageView()

    localStorage.setItem("KUID", response.id)

    if (window?.location?.search) {
        const urlParams = new URLSearchParams(window.location.search)
        const ke = urlParams.get("ke")
        if (ke) {
            identify(ke)
        }
    }
}

const enabledMarketing = () => {
    if (marketingEnabled) {
        return
    }
    marketingEnabled = true

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
        event: "enable_marketing",
        category: "sys",
        noninteraction: true,
    })
}

// astro:page-load fires on the initial load *and* after every client-side
// navigation, so GTM/PostHog bootstrap on whichever page the visitor lands on
// first, and every subsequent page reports a page-view.
document.addEventListener("astro:page-load", () => {
    if (!isEurope) {
        enabledAnalytics()
        enabledMarketing()

        return
    }

    // Consent already handled on an earlier page — just report the page-view.
    if (consentInitialized) {
        if (analyticsEnabled) {
            enabledAnalytics()
        }

        return
    }

    consentInitialized = true
    document.documentElement.classList.add("cc--darkmode")

    runCookieConsent({
        mode: isEurope ? "opt-in" : "opt-out",
        manageScriptTags: true,
        disablePageInteraction: true,
        guiOptions: {
            consentModal: {
                layout: "box inline",
                flipButtons: true,
            },
        },
        autoClearCookies: false,
        onConsent: ({ cookie }) => {
            let consentCategories = cookie.categories
            if (consentCategories.includes("analytics")) {
                enabledAnalytics()
            }

            if (consentCategories.includes("marketing")) {
                enabledMarketing()
            }
        },
        categories: {
            analytics: {
                enabled: true,
                readOnly: false,
            },
            marketing: {
                enabled: true,
                readOnly: false,
            },
        },
        language: {
            default: "en",
            translations: {
                en: {
                    consentModal: {
                        title: "We use cookies",
                        description:
                            'Hi, this website uses analytics & marketing cookies to understand how you interact with it to continuously improve your user experience. <a aria-label="Cookie policy" class="cc-link" href="/cookie-policy">Read our cookie policy</a>',
                        acceptAllBtn: "Accept",
                        showPreferencesBtn: "Settings",
                    },
                    preferencesModal: {
                        title: "Cookie preferences",
                        savePreferencesBtn: "Save settings",
                        acceptAllBtn: "Accept all",
                        acceptNecessaryBtn: "Reject all",
                        sections: [
                            {
                                title: "Cookie usage",
                                description:
                                    "I use cookies to enhance your online experience. You can choose for each category to opt-in/out whenever you want.",
                            },
                            {
                                title: "Analytics cookies",
                                description:
                                    "These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you.",
                                linkedCategory: "analytics",
                            },
                            {
                                title: "Marketing cookies",
                                description:
                                    "These cookies tracks your activities on our site to allow commercials to eventually reach out.",
                                linkedCategory: "marketing",
                            },
                            {
                                title: "More information",
                                description:
                                    'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="mailto:hello@kestra.io">contact us</a>.',
                            },
                        ],
                    },
                },
            },
        },
    })
})
