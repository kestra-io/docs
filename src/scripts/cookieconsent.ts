import * as CookieConsent from "vanilla-cookieconsent"
import posthog from "posthog-js"
import axios from "axios"
import identify from "~/utils/identify"
import { API_URL } from "astro:env/client"
import { GTM_ID } from "astro:env/client"

const isEurope = Intl.DateTimeFormat().resolvedOptions().timeZone.indexOf("Europe") === 0
const cookieConsent = CookieConsent

window.addEventListener("DOMContentLoaded", () => {
    const enabledAnalytics = async () => {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
            "gtm.start": new Date().getTime(),
            event: "gtm.js",
        })

        const s = document.createElement("script")
        s.async = true
        s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
        document.head.appendChild(s)

        const response = await axios.get(`${API_URL}/config`, {
            withCredentials: true,
        })

        posthog.init(response.data.posthog.token, {
            api_host: window.location.origin + "/t/",
            ui_host: "https://eu.posthog.com",
            capture_pageview: false,
            capture_pageleave: true,
            autocapture: false,
            disable_session_recording: true,
        })

        posthog.register_once({
            from: "SITE",
        })

        if (!posthog.get_property("__alias")) {
            posthog.alias(response.data.id)
        }

        posthog.capture("$pageview")

        window.dataLayer.push({
            event: "identify",
            category: "sys",
            noninteraction: true,
            kuid: response.data.id,
        })

        window.dataLayer.push({
            event: "content-view",
            "content-name": window.location.pathname + window.location.search,
            "content-view-name": window.astroClientConfig.slug,
        })

        localStorage.setItem("KUID", response.data.id)

        if (window?.location?.search) {
            const urlParams = new URLSearchParams(window.location.search)
            const ke = urlParams.get("ke")
            if (ke) {
                identify(ke)
            }
        }
    }

    const enabledMarketing = () => {
        window.dataLayer.push({
            event: "enable_marketing",
            category: "sys",
            noninteraction: true,
        })
    }

    if (!isEurope) {
        enabledAnalytics()
        enabledMarketing()

        return
    }

    document.documentElement.classList.add("cc--darkmode")

    cookieConsent.run({
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