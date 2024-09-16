import posthog from "posthog-js";

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
