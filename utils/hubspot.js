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
