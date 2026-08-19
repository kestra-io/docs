import { run as runCookieConsent } from "vanilla-cookieconsent"
import { gtag, enabledAnalytics, enabledMarketing, pushPageView, gpcSignaled } from "./cookieconsent"

// GPC is a ceiling the banner can't relax — accepting "marketing" here
// never grants ad signals (or fires enable_marketing) once GPC opted out.
const marketingGranted = (categories: string[]) => !gpcSignaled && categories.includes("marketing")

// Only called for EU visitors (see cookieconsent.ts), so mode is always opt-in.
const updateConsentSignals = (categories: string[]) => {
    const analytics = categories.includes("analytics") ? "granted" : "denied"
    const ads = marketingGranted(categories) ? "granted" : "denied"
    gtag("consent", "update", {
        analytics_storage: analytics,
        ad_storage: ads,
        ad_user_data: ads,
        ad_personalization: ads,
    })
}

export const initBanner = () => {
    document.documentElement.classList.add("cc--darkmode")

    runCookieConsent({
        mode: "opt-in",
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
                // gets a cookieless ping for conversion modeling.
                pushPageView()
            }

            if (marketingGranted(consentCategories)) {
                enabledMarketing()
            }
        },
        // Fires on a Settings-modal change, including a revoke, which must
        // flip signals back to denied.
        onChange: ({ cookie }) => {
            let consentCategories = cookie.categories
            updateConsentSignals(consentCategories)

            if (consentCategories.includes("analytics")) {
                enabledAnalytics()
            }

            if (marketingGranted(consentCategories)) {
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
}
