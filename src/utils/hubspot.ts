import posthog from "posthog-js"
import identify from "~/utils/identify"
import { useGtm } from "@gtm-support/vue-gtm"
import { $fetch } from "~/utils/fetch"

const HUBSPOT_SUBMIT_ENDPOINT = "/api/hubspot-submit"

export function submitHubspotForm<T = any>(
    formId: string,
    payload: {
        fields: unknown[]
        context?: Record<string, unknown>
    },
): Promise<T> {
    return $fetch<T>(HUBSPOT_SUBMIT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, ...payload }),
    })
}

declare global {
    interface Window {
        hbspt: {
            forms: {
                create: (data: Record<string, any>) => void
            }
        }
        __hsUserToken: string
    }
}

export function hubspotFormCreate(eventType: string, data: Record<string, any>) {
    const gtm = useGtm()
    scriptLoad(() => {
        window.hbspt.forms.create({
            ...data,
            region: "eu1",
            portalId: "27220195",
            onFormReady: ($form: HTMLFormElement) => {
                if (data.css) {
                    const style = document.createElement("style");
                    if (data.styleId) style.id = data.styleId;
                    style.innerHTML = data.css;
                    $form.appendChild(style);
                }
                data.onFormReady?.($form);
            },
            onFormSubmit: ($form: HTMLFormElement) => {
                gtm?.trackEvent({ event: eventType, noninteraction: false });
                posthog.capture(eventType);
                const email = ($form.querySelector('[name="email"]') as HTMLInputElement)?.value;
                if (email) identify(email);
                data.onFormSubmit?.($form);
            },
        })
    })
}

function scriptLoad(callback: () => void) {
    if (typeof window !== "undefined") {
        if (window.hbspt) {
            callback()
        } else {
            const script = document.createElement("script")
            script.src = "https://js-eu1.hsforms.net/forms/embed/v2.js"
            script.setAttribute("defer", "")
            document.body.appendChild(script)
            script.addEventListener("load", () => {
                if (window.hbspt) {
                    callback()
                }
            })
        }
    }
}

export function getHubspotTracking() {
    if (window.__hsUserToken) {
        return window.__hsUserToken
    }

    const HS_COOKIE_NAME = "hubspotutk"

    let e = null
    if (document.cookie && "" !== document.cookie) {
        for (let n = document.cookie.split(";"), o = 0; o < n.length; o++) {
            let r = n[o].trim(),
                a = HS_COOKIE_NAME + "="

            if (r.substring(0, HS_COOKIE_NAME.length + 1) === a) {
                e = r.substring(HS_COOKIE_NAME.length + 1)
                break
            }
        }
    }

    return e
}