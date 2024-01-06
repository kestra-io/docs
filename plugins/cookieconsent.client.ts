// noinspection TypeScriptValidateTypes

import 'vanilla-cookieconsent'

export default defineNuxtPlugin(nuxtApp => {
    let isProd = process.env.NODE_ENV === "production";

    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    posthog.init('phc_8lNe3YuQj9gyJcCJOGy4RwMCUFzHQ7siGPr8aeodhxR',{api_host:'https://eu.posthog.com'})

    nuxtApp.hook('page:finish', () => {
        const {grantConsent} = useGtag()

        const posthogLoad = () => {
            posthog.capture('$pageview');
        };

        const enabledAnalytics = () => {
            grantConsent();
            posthogLoad();
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