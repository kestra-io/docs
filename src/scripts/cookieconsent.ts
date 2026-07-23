import posthog from "posthog-js"
import identify from "~/utils/identify"
import { $fetchApi } from "~/utils/fetch"
import { GTM_ID } from "astro:env/client"
import { CONSENT_REGION_ATTR } from "~/middlewares/consentRegion"

// Set by the Worker on <html> from Cloudflare's edge geo data (not a
// cookie, so responses stay edge-cacheable); falls back to Intl timezone
// (always the case in local `astro dev`).
const regionAttr = document.documentElement.getAttribute(CONSENT_REGION_ATTR)
const isEurope =
    regionAttr === "eu" || regionAttr === "row"
        ? regionAttr === "eu"
        : Intl.DateTimeFormat().resolvedOptions().timeZone.indexOf("Europe") === 0

// Kicked off at module top-level (as early as this script itself runs) so
// the fetch is already in flight by the time astro:page-load needs it.
const bannerModule = isEurope ? import("./cookieBanner") : null

// Astro's <ClientRouter /> makes navigation a soft transition, so these
// guards keep one-time bootstrap idempotent across page loads.
let analyticsEnabled = false
let marketingEnabled = false
let consentInitialized = false
let gtmLoaded = false

// Thin wrapper so gtag() calls read like Google's canonical snippet.
export const gtag = (..._args: unknown[]) => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push(_args)
}

// GTM must load for everyone, signals denied by default in Europe, so
// Google gets cookieless pings for conversion modeling pre-consent.
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

export const pushPageView = () => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
        event: "content-view",
        "content-name": window.location.pathname + window.location.search,
        "content-view-name": window.astroClientConfig?.slug,
    })
}

export const enabledAnalytics = async () => {
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

export const enabledMarketing = () => {
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

// Fires on initial load and every client-side navigation, so bootstrap runs
// once and every page after that just reports a page-view.
document.addEventListener("astro:page-load", async () => {
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
            // No analytics consent: GTM stays loaded, so this only produces
            // a cookieless ping (conversion modeling).
            pushPageView()
        }

        return
    }

    consentInitialized = true

    // EU-only banner code, split into its own chunk so non-EU visitors
    // never fetch it. Reuses the promise kicked off above.
    const { initBanner } = await bannerModule!
    initBanner()
})
