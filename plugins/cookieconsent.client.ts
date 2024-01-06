import 'vanilla-cookieconsent'
import posthog from 'posthog-js'

export default defineNuxtPlugin(nuxtApp => {
    let isProd = process.env.NODE_ENV === "production" || true;

    if (isProd) {
        posthog.init(
            'phc_8lNe3YuQj9gyJcCJOGy4RwMCUFzHQ7siGPr8aeodhxR',
            {
                api_host: '/api/events',
                ui_host: 'https://eu.posthog.com',
            }
        )
    }

    nuxtApp.hook('page:finish', () => {
        const {grantConsent} = useGtag()

        const enabledAnalytics = () => {
            grantConsent();
            posthog.capture('$pageview');
        };

        const isEurope = Intl.DateTimeFormat().resolvedOptions().timeZone.indexOf("Europe") === 0;

        const cookieConsent = window.initCookieConsent()

        if (!isEurope && isProd) {
            enabledAnalytics();
            cookieConsent.loadScript('https://js-eu1.hs-scripts.com/27220195.js');

            return;
        }

        // @ts-ignore
        cookieConsent.run({
            autorun: true,
            current_lang: 'en',
            autoclear_cookies: false,
            gui_options: {
                consent_modal: {
                    swap_buttons: true
                }
            },
            page_scripts: true,
            force_consent: true,
            onAccept: () => {
                if (isProd) {
                    if (cookieConsent.allowedCategory('analytics')) {
                        enabledAnalytics();
                    }

                    if (cookieConsent.allowedCategory('marketing')) {
                        cookieConsent.loadScript('https://js-eu1.hs-scripts.com/27220195.js');
                    }
                }
            },

            languages: {
                en: {
                    consent_modal: {
                        title: 'I use cookies',
                        description: 'Hi, this website uses analytics & marketing cookies to understand how you interact with it to continuously improve your user experience. <a aria-label="Cookie policy" class="cc-link" href="/cookie-policy">Read more</a>',
                        primary_btn: {
                            text: 'Accept',
                            role: 'accept_all'              // 'accept_selected' or 'accept_all'
                        },
                        secondary_btn: {
                            text: 'Settings',
                            role: 'settings'                // 'settings' or 'accept_necessary'
                        },
                    },
                    settings_modal: {
                        title: 'Cookie preferences',
                        save_settings_btn: 'Save settings',
                        accept_all_btn: 'Accept all',
                        reject_all_btn: 'Reject all',
                        blocks: [
                            {
                                title: 'Cookie usage',
                                description: 'I use cookies to enhance your online experience. You can choose for each category to opt-in/out whenever you want.'
                            },
                            {
                                title: 'Analytics cookies',
                                description: 'These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you.',
                                toggle: {
                                    value: 'analytics',
                                    enabled: true,
                                    readonly: false
                                }
                            },
                            {
                                title: 'Marketing cookies',
                                description: 'These cookies tracks your activities on our site to allow commercials to eventually reach out.',
                                toggle: {
                                    value: 'marketing',
                                    enabled: true,
                                    readonly: false
                                }
                            },
                            {
                                title: 'More information',
                                description: 'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="mailto:hello@kestra.io">contact us</a>.',
                            }
                        ]
                    }
                }
            }
        })
    })
})