import posthog from "posthog-js";
import identify from "./identify";
const gtm = useGtm();

export function hubspotFormCreate(eventType, data) {
    scriptLoad(() => {
        const formData = {
            ...data, ...{
                region: "eu1",
                portalId: "27220195",
                onFormSubmit: function ($form) {
                    gtm?.trackEvent({
                        event: eventType,
                        noninteraction: false,
                    })

                    posthog.capture(eventType);

                    const email = $form.querySelector('[name="email"]')

                    if (email?.value) {
                        identify(email?.value);
                    }
                }
            }
        }

        window.hbspt.forms.create(formData);
    });
}

function scriptLoad(callback) {
    if (process.client) {
        if (window.hbspt) {
            callback();
        } else {
            const script = document.createElement("script");
            script.src = "https://js-eu1.hsforms.net/forms/embed/v2.js";
            script.setAttribute('defer','');
            document.body.appendChild(script);
            script.addEventListener("load", () => {
                if (window.hbspt) {
                    callback();
                }
            });
        }
    }
}

export function getHubspotTracking() {
    if (window.__hsUserToken) {
        return window.__hsUserToken;
    }

    const HS_COOKIE_NAME = "hubspotutk"

    let e = null;
    if (document.cookie && "" !== document.cookie) {
        for (let n = document.cookie.split(";"), o = 0; o < n.length; o++) {
            let r = n[o].trim(),
                a = HS_COOKIE_NAME + "=";

            if (r.substring(0, HS_COOKIE_NAME.length + 1) === a) {
                e = r.substring(HS_COOKIE_NAME.length + 1);
                break
            }
        }
    }

    return e
}

