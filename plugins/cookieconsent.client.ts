import * as CookieConsent from "vanilla-cookieconsent";
import posthog from 'posthog-js'
import axios from "axios";

export default defineNuxtPlugin(nuxtApp => {
    const isEurope = Intl.DateTimeFormat().resolvedOptions().timeZone.indexOf("Europe") === 0;

    nuxtApp.hook('page:finish', () => {
        const {initialize} = useGtag()

        const enabledAnalytics = async () => {
            initialize();

            const response = await axios.get('https://api.kestra.io/v1/config', {withCredentials: true})

            posthog.init(
                response.data.posthog.token,
                {
                    api_host: response.data.posthog.apiHost,
                    ui_host: 'https://eu.posthog.com',
                    capture_pageview: false,
                    autocapture: false,
                    disable_session_recording: true
                }
            )

            posthog.register_once({
                'from': 'SITE',
            })

            if (!posthog.get_property("__alias")) {
                posthog.alias(response.data.id);
            }

            posthog.capture('$pageview');
        };


        const cookieConsent = CookieConsent;
        nuxtApp.provide("cookieConsent", cookieConsent);
        const enabledMarketing = () => {
            return cookieConsent.loadScript('https://js-eu1.hs-scripts.com/27220195.js',{defer: "defer"});
        };

        cookieConsent.run({
            mode: isEurope ? 'opt-in' : 'opt-out',
            manageScriptTags: true,
            disablePageInteraction: true,
            guiOptions: {
                consentModal: {
                    layout: 'box inline',
                    flipButtons: true
                }
            },
            autoClearCookies: false,
            onConsent: ({cookie}) => {
                let consentCategories = cookie.categories;
                if (consentCategories.includes('analytics')) {
                    enabledAnalytics();
                }

                if (consentCategories.includes('marketing')) {
                    enabledMarketing();
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
                }
            },
            language: {
                default: 'en',
                translations: {
                    en: {
                        consentModal: {
                            title: 'I use cookies',
                            description: 'Hi, this website uses analytics & marketing cookies to understand how you interact with it to continuously improve your user experience. <a aria-label="Cookie policy" class="cc-link" href="/cookie-policy">Read more</a>',
                            acceptAllBtn: 'Accept',
                            showPreferencesBtn: 'Settings'
                        },
                        preferencesModal: {
                            title: 'Cookie preferences',
                            savePreferencesBtn: 'Save settings',
                            acceptAllBtn: 'Accept all',
                            acceptNecessaryBtn: 'Reject all',
                            sections: [
                                {
                                    title: 'Cookie usage',
                                    description: 'I use cookies to enhance your online experience. You can choose for each category to opt-in/out whenever you want.'
                                },
                                {
                                    title: 'Analytics cookies',
                                    description: 'These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you.',
                                    linkedCategory: 'analytics',
                                },
                                {
                                    title: 'Marketing cookies',
                                    description: 'These cookies tracks your activities on our site to allow commercials to eventually reach out.',
                                    linkedCategory: 'marketing'
                                },
                                {
                                    title: 'More information',
                                    description: 'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="mailto:hello@kestra.io">contact us</a>.',
                                }
                            ]
                        }
                    }
                }
            }
        })
    })
})