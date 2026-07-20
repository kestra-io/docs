import { run as runCookieConsent } from "vanilla-cookieconsent"
import posthog from "posthog-js"
import identify from "~/utils/identify"
import { $fetchApi } from "~/utils/fetch"
import { GTM_ID } from "astro:env/client"
import { CONSENT_REGION_COOKIE } from "~/middlewares/consentRegion"

// Prefer the region cookie set by the Worker (src/middlewares/consentRegion.ts)
// from Cloudflare's edge-resolved geo data — authoritative and not spoofable
// by the client's OS/browser timezone. Falls back to the Intl timezone check
// when the cookie is absent, which is always the case in local `astro dev`
// (the Node adapter never runs the Cloudflare Worker).
const readRegionCookie = (): "eu" | "row" | null => {
    const prefix = `${CONSENT_REGION_COOKIE}=`
    if (!document.cookie) return null
    for (const part of document.cookie.split(";")) {
        const entry = part.trim()
        if (entry.substring(0, prefix.length) === prefix) {
            const value = entry.substring(prefix.length)
            return value === "eu" || value === "row" ? value : null
        }
    }
    return null
}

const regionCookie = readRegionCookie()
const isEurope =
    regionCookie !== null
        ? regionCookie === "eu"
        : Intl.DateTimeFormat().resolvedOptions().timeZone.indexOf("Europe") === 0

// The site uses Astro's <ClientRouter /> in production, so navigating between
// pages is a client-side transition, not a full reload. These guards make sure
// the one-time bootstrap (consent modal, GTM/PostHog init) runs only once,
// while the page-view event is pushed on *every* navigation so GTM triggers
// (and conversion tags) fire on soft navigations too — not just the first load.
let analyticsEnabled = false
let marketingEnabled = false
let consentInitialized = false
let gtmLoaded = false

// Thin wrapper so gtag() calls read like Google's canonical snippet, while
// lazily initializing dataLayer and keeping typed arguments.
const gtag = (..._args: unknown[]) => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(_args)
}

// Consent Mode v2: GTM must be loaded for everyone — with all signals denied
// by default in Europe — so Google can receive anonymous, cookieless pings
// and run conversion modeling for users who decline. The `consent default`
// push has to reach the dataLayer *before* the gtm.js script tag is added.
const initConsentModeAndGtm = () => {
    if (gtmLoaded) {
        return
    }
    gtmLoaded = true

    gtag("consent", "default", {
        ad_storage: isEurope ? "denied" : "granted",
        ad_user_data: isEurope ? "denied" : "granted",
        ad_personalization: isEurope ? "denied" : "granted",
        analytics_storage: isEurope ? "denied" : "granted",
        // Give the consent banner time to restore a returning visitor's
        // choice before tags fire. Europe-only so non-EU tags aren't delayed.
        ...(isEurope ? { wait_for_update: 500 } : {}),
    })

    window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
    })

    const s = document.createElement("script")
    s.async = true
    s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
    document.head.appendChild(s)
}

// analytics category drives analytics_storage; marketing drives the three
// advertising signals. Called on every consent decision, including a revoke
// from the Settings modal, so signals can transition back to denied.
const updateConsentSignals = (categories: string[]) => {
    const analytics = categories.includes("analytics") ? "granted" : "denied"
    const ads = categories.includes("marketing") ? "granted" : "denied"
    gtag("consent", "update", {
        analytics_storage: analytics,
        ad_storage: ads,
        ad_user_data: ads,
        ad_personalization: ads,
    })
}

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
    initConsentModeAndGtm()

    if (!isEurope) {
        enabledAnalytics()
        enabledMarketing()

        return
    }

    // Consent already handled on an earlier page — just report the page-view.
    if (consentInitialized) {
        if (analyticsEnabled) {
            enabledAnalytics()
        } else {
            // No analytics consent: GTM is still loaded, so this page-view
            // only produces anonymous, cookieless pings (conversion modeling).
            pushPageView()
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
            updateConsentSignals(consentCategories)

            if (consentCategories.includes("analytics")) {
                enabledAnalytics()
            } else {
                // Declined analytics: still report the page-view so Google
                // receives a cookieless ping for conversion modeling.
                pushPageView()
            }

            if (consentCategories.includes("marketing")) {
                enabledMarketing()
            }
        },
        // Fires when the user changes preferences via the Settings modal —
        // in particular a revoke, which must flip signals back to denied.
        onChange: ({ cookie }) => {
            let consentCategories = cookie.categories
            updateConsentSignals(consentCategories)

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
