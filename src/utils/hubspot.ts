import posthog from "posthog-js"
import identify from "~/utils/identify"
import { useGtm } from "@gtm-support/vue-gtm"

const HUBSPOT_PORTAL_ID = "27220195"
const PROXY_ENDPOINT = "/api/hubspot-submit"
const DIRECT_ENDPOINT = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}`
const PROXY_TIMEOUT_MS = 15_000
const DIRECT_TIMEOUT_MS = 10_000

type Delivery = "unknown" | "failed"

type Outcome<T> =
    | { kind: "accepted"; data: T }
    | { kind: "rejected"; status: number; statusText: string; data: unknown }
    | { kind: Delivery }

export class HubspotDeliveryError extends Error {
    constructor(readonly delivery: Delivery) {
        super(`HubSpot submission delivery ${delivery}`)
        this.name = "HubspotDeliveryError"
    }
}

async function post<T>(
    url: string,
    body: unknown,
    timeoutMs: number,
): Promise<Outcome<T>> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal,
        })
        const data = await response.json().catch(() => undefined)

        if (!data || typeof data !== "object") return { kind: "failed" }
        if (response.ok) return { kind: "accepted", data: data as T }
        if ((data as { submitted?: unknown }).submitted === null) {
            return { kind: "unknown" }
        }
        if (response.status >= 500) return { kind: "failed" }
        return {
            kind: "rejected",
            status: response.status,
            statusText: response.statusText,
            data,
        }
    } catch {
        return { kind: controller.signal.aborted ? "unknown" : "failed" }
    } finally {
        clearTimeout(timer)
    }
}

export async function submitHubspotForm<T = any>(
    formId: string,
    payload: {
        fields: unknown[]
        context?: Record<string, unknown>
    },
): Promise<T> {
    const viaProxy = await post<T>(
        PROXY_ENDPOINT,
        { formId, ...payload },
        PROXY_TIMEOUT_MS,
    )
    const outcome =
        viaProxy.kind === "failed"
            ? await post<T>(
                  `${DIRECT_ENDPOINT}/${formId}`,
                  payload,
                  DIRECT_TIMEOUT_MS,
              )
            : viaProxy

    if (outcome.kind === "accepted") return outcome.data
    if (outcome.kind === "rejected") {
        throw Object.assign(
            new Error(`HubSpot rejected the submission: ${outcome.status}`),
            {
                response: {
                    status: outcome.status,
                    statusText: outcome.statusText,
                    data: outcome.data,
                },
            },
        )
    }
    throw new HubspotDeliveryError(outcome.kind)
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