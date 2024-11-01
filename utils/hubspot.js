import posthog from "posthog-js";
import identify from "./identify";

export function hubspotFormCreate(eventType, data) {
    scriptLoad(() => {
        const formData = {
            ...data, ...{
                region: "eu1",
                portalId: "27220195",
                onFormSubmit: function ($form) {
                    if (window.dataLayer) {
                        window.dataLayer.push({'event': eventType});
                    }
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
