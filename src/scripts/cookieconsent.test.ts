import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CONSENT_REGION_ATTR } from "~/middlewares/consentRegion"

// vanilla-cookieconsent's run() is mocked to capture the config so tests can
// invoke onConsent/onChange directly, as if the user interacted with the UI.
const runCookieConsent = vi.fn()
vi.mock("vanilla-cookieconsent", () => ({
    run: (config: unknown) => runCookieConsent(config),
}))

const posthogInit = vi.fn()
const posthogOptOut = vi.fn()
const posthogOptIn = vi.fn()
const posthogStopRecording = vi.fn()
const posthogStartRecording = vi.fn()
let posthogOptedOut = false
vi.mock("posthog-js", () => ({
    default: {
        init: (...args: unknown[]) => posthogInit(...args),
        register_for_session: vi.fn(),
        get_property: vi.fn(() => undefined),
        alias: vi.fn(),
        capture: vi.fn(),
        opt_out_capturing: (...args: unknown[]) => {
            posthogOptedOut = true
            posthogOptOut(...args)
        },
        opt_in_capturing: (...args: unknown[]) => {
            posthogOptedOut = false
            posthogOptIn(...args)
        },
        has_opted_out_capturing: () => posthogOptedOut,
        stopSessionRecording: (...args: unknown[]) => posthogStopRecording(...args),
        startSessionRecording: (...args: unknown[]) => posthogStartRecording(...args),
    },
}))

// The consent stylesheet is loaded on demand from the EU-only banner chunk.
vi.mock("~/assets/styles/cookieconsent.scss?url", () => ({ default: "/consent.css" }))

vi.mock("~/utils/identify", () => ({ default: vi.fn() }))

const fetchApi = vi.fn(async (..._args: unknown[]) => ({ posthog: { token: "tok" }, id: "kuid-1" }))
vi.mock("~/utils/fetch", () => ({ $fetchApi: (...args: unknown[]) => fetchApi(...args) }))

vi.mock("astro:env/client", () => ({ GTM_ID: "GTM-TEST" }))

const SIGNALS = ["ad_storage", "ad_user_data", "ad_personalization", "analytics_storage"] as const

// The module only touches a small DOM surface, so a hand-rolled fake avoids
// pulling in a jsdom/happy-dom dependency just for this one test file.
type FakeScript = { async: boolean; src: string }
// <link rel=stylesheet> for the on-demand consent stylesheet: loadConsentStyles
// awaits its load event, so the fake has to be able to fire one.
type FakeLink = { rel: string; href: string; addEventListener: (type: string, cb: () => void) => void }
type FakeElement = FakeScript | FakeLink
let listeners: Record<string, ((e: Event) => void)[]>
let headChildren: FakeElement[]
let htmlAttrs: Record<string, string>

const installFakeDom = () => {
    listeners = {}
    headChildren = []
    htmlAttrs = {}

    const fakeDocument = {
        addEventListener: (type: string, cb: (e: Event) => void) => {
            listeners[type] = listeners[type] || []
            listeners[type].push(cb)
        },
        // Unlike real DOM dispatchEvent, this awaits listeners so tests can
        // deterministically wait for the async banner-init dynamic import.
        dispatchEvent: (event: Event) => Promise.all((listeners[event.type] || []).map((cb) => cb(event))),
        documentElement: {
            classList: { add: vi.fn() },
            getAttribute: (name: string) => htmlAttrs[name] ?? null,
            setAttribute: (name: string, value: string) => {
                htmlAttrs[name] = value
            },
        },
        createElement: (tag: string) => {
            if (tag === "link") {
                const link: FakeLink = {
                    rel: "",
                    href: "",
                    // Resolve on the next microtask, so appendChild has run by
                    // the time the load handler fires (as in a real browser).
                    addEventListener: (type: string, cb: () => void) => {
                        if (type === "load") queueMicrotask(cb)
                    },
                }
                return link
            }
            if (tag !== "script") throw new Error(`unexpected createElement(${tag})`)
            const script: FakeScript = { async: false, src: "" }
            return script
        },
        head: {
            appendChild: (el: FakeElement) => headChildren.push(el),
        },
    }

    vi.stubGlobal("document", fakeDocument)
    vi.stubGlobal("window", globalThis)
    vi.stubGlobal("localStorage", { setItem: vi.fn() })
    vi.stubGlobal("navigator", { globalPrivacyControl: undefined })
    globalThis.location = { pathname: "/", search: "" } as Location
}

const gtmScriptTags = () =>
    headChildren.filter((el): el is FakeScript => "src" in el && el.src.includes("googletagmanager.com/gtm.js"))

const consentStylesheets = () => headChildren.filter((el): el is FakeLink => "href" in el)

const consentEntries = () =>
    (window.dataLayer as unknown as { 0: string; 1: string; 2: Record<string, string> }[]).filter(
        (e) => e && e[0] === "consent"
    )

const allSignalsAre = (params: Record<string, string> | undefined, value: string) =>
    !!params && SIGNALS.every((s) => params[s] === value)

const setTimezone = (timeZone: string) => {
    vi.spyOn(Intl, "DateTimeFormat").mockImplementation(
        () =>
            ({
                resolvedOptions: () => ({ timeZone }),
            }) as unknown as Intl.DateTimeFormat
    )
}

const loadModule = async () => {
    vi.resetModules()
    await import("./cookieconsent")
}

const setRegionAttr = (value: "eu" | "row") => {
    document.documentElement.setAttribute(CONSENT_REGION_ATTR, value)
}

const setGpc = (value: boolean) => {
    vi.stubGlobal("navigator", { globalPrivacyControl: value })
}

// Cast past the DOM lib's `boolean` return type — the fake actually returns
// a Promise (see dispatchEvent above).
const firePageLoad = () => document.dispatchEvent(new Event("astro:page-load")) as unknown as Promise<void>

beforeEach(() => {
    installFakeDom()
    window.dataLayer = []
    window.astroClientConfig = { slug: "home" }
    runCookieConsent.mockClear()
    posthogInit.mockClear()
    posthogOptOut.mockClear()
    posthogOptIn.mockClear()
    posthogStopRecording.mockClear()
    posthogStartRecording.mockClear()
    posthogOptedOut = false
    fetchApi.mockClear()
})

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

// No region attribute is set in these two describe blocks, so they also
// cover the Intl-timezone fallback path (the only one available in dev).
describe("cookieconsent — Europe", () => {
    beforeEach(async () => {
        setTimezone("Europe/Paris")
        await loadModule()
        await firePageLoad()
    })

    it("sets all four consent signals to denied before any interaction, with wait_for_update", () => {
        const def = consentEntries().find((e) => e[1] === "default")
        expect(def).toBeDefined()
        expect(allSignalsAre(def?.[2], "denied")).toBe(true)
        expect(def?.[2].wait_for_update).toBe(500)
    })

    // GTM only treats a dataLayer entry as a gtag command when it is an
    // Arguments object; a real Array indexes the same but never registers.
    // Asserting the type here, not just def[0]/def[1]/def[2], is what stops a
    // regression to `push([...])` from silently disabling Consent Mode.
    it("pushes consent commands as an Arguments object, not an array", () => {
        const def = consentEntries().find((e) => e[1] === "default")
        expect(Object.prototype.toString.call(def)).toBe("[object Arguments]")
        expect(Array.isArray(def)).toBe(false)
    })

    it("loads the GTM script tag before any consent decision", () => {
        expect(gtmScriptTags()).toHaveLength(1)
        expect(gtmScriptTags()[0].src).toContain("id=GTM-TEST")
    })

    it("pushes consent default before the gtm.js event, so Consent Mode is set before tags fire", () => {
        const iDefault = window.dataLayer.findIndex((e: any) => e && e[0] === "consent" && e[1] === "default")
        const iGtm = window.dataLayer.findIndex((e: any) => e && e.event === "gtm.js")
        expect(iDefault).toBeGreaterThanOrEqual(0)
        expect(iGtm).toBeGreaterThanOrEqual(0)
        expect(iDefault).toBeLessThan(iGtm)
    })

    it("updates all four signals to granted when the user accepts all categories", async () => {
        const { onConsent } = runCookieConsent.mock.calls[0][0]
        await onConsent({ cookie: { categories: ["analytics", "marketing"] } })
        const upd = consentEntries()
            .filter((e) => e[1] === "update")
            .pop()
        expect(allSignalsAre(upd?.[2], "granted")).toBe(true)
        expect(posthogInit).toHaveBeenCalled()
        expect(window.dataLayer.some((e: any) => e?.event === "enable_marketing")).toBe(true)
    })

    it("keeps all four signals denied and still reports a cookieless page-view when the user declines", async () => {
        const { onConsent } = runCookieConsent.mock.calls[0][0]
        await onConsent({ cookie: { categories: [] } })
        const upd = consentEntries()
            .filter((e) => e[1] === "update")
            .pop()
        expect(allSignalsAre(upd?.[2], "denied")).toBe(true)
        expect(posthogInit).not.toHaveBeenCalled()
        expect(window.dataLayer.some((e: any) => e?.event === "enable_marketing")).toBe(false)
        expect(window.dataLayer.some((e: any) => e?.event === "content-view")).toBe(true)
    })

    it("transitions signals back to denied when consent is revoked via the Settings modal (onChange)", async () => {
        const { onConsent, onChange } = runCookieConsent.mock.calls[0][0]
        await onConsent({ cookie: { categories: ["analytics", "marketing"] } })
        await onChange({ cookie: { categories: [] } })
        const upd = consentEntries()
            .filter((e) => e[1] === "update")
            .pop()
        expect(allSignalsAre(upd?.[2], "denied")).toBe(true)
    })

    // The gtag signals going denied is not enough: analytics.js captures a
    // $pageview on every astro:page-load independently of this module, so a
    // visitor who withdraws consent would keep sending identified pageviews
    // and session recordings for the rest of the visit.
    it("stops PostHog capture and session recording when consent is revoked (onChange)", async () => {
        const { onConsent, onChange } = runCookieConsent.mock.calls[0][0]
        await onConsent({ cookie: { categories: ["analytics", "marketing"] } })
        expect(posthogInit).toHaveBeenCalled()

        await onChange({ cookie: { categories: [] } })
        expect(posthogStopRecording).toHaveBeenCalled()
        expect(posthogOptOut).toHaveBeenCalled()
    })

    // opt_out_capturing() persists, so re-granting has to opt back in
    // explicitly or PostHog stays silent for the rest of the visit and beyond.
    it("opts PostHog back in when consent is re-granted after a revoke", async () => {
        const { onConsent, onChange } = runCookieConsent.mock.calls[0][0]
        await onConsent({ cookie: { categories: ["analytics"] } })
        await onChange({ cookie: { categories: [] } })
        await onChange({ cookie: { categories: ["analytics"] } })

        expect(posthogOptIn).toHaveBeenCalledWith({ captureEventName: false })
        expect(posthogStartRecording).toHaveBeenCalled()
    })

    it("never touches PostHog on revoke if analytics was never granted", async () => {
        const { onConsent, onChange } = runCookieConsent.mock.calls[0][0]
        await onConsent({ cookie: { categories: [] } })
        await onChange({ cookie: { categories: [] } })
        expect(posthogOptOut).not.toHaveBeenCalled()
        expect(posthogStopRecording).not.toHaveBeenCalled()
    })

    // #5672 took the 27 KB of consent CSS out of the render-blocking bundle;
    // it must stay on-demand, and EU-only.
    it("loads the consent stylesheet on demand, once, before the banner runs", () => {
        expect(consentStylesheets()).toHaveLength(1)
        expect(consentStylesheets()[0].href).toBe("/consent.css")
        expect(runCookieConsent).toHaveBeenCalled()
    })

    it("only loads GTM once across repeated astro:page-load events (soft navigation)", async () => {
        const before = gtmScriptTags().length
        await firePageLoad()
        await firePageLoad()
        expect(gtmScriptTags()).toHaveLength(before)
        expect(before).toBe(1)
    })
})

describe("cookieconsent — non-Europe", () => {
    beforeEach(async () => {
        setTimezone("America/New_York")
        await loadModule()
        await firePageLoad()
    })

    it("defaults all four signals to granted, without wait_for_update", () => {
        const def = consentEntries().find((e) => e[1] === "default")
        expect(def).toBeDefined()
        expect(allSignalsAre(def?.[2], "granted")).toBe(true)
        expect(def?.[2].wait_for_update).toBeUndefined()
    })

    it("does not show the consent banner", () => {
        expect(runCookieConsent).not.toHaveBeenCalled()
    })

    // The banner chunk is never imported here, so its stylesheet is never
    // fetched either — the whole point of keeping both EU-only.
    it("never fetches the consent stylesheet", () => {
        expect(consentStylesheets()).toHaveLength(0)
    })

    it("fires analytics and marketing immediately", () => {
        expect(posthogInit).toHaveBeenCalled()
        expect(window.dataLayer.some((e: any) => e?.event === "enable_marketing")).toBe(true)
    })
})

describe("cookieconsent — region attribute takes precedence over Intl timezone", () => {
    it("treats the visitor as Europe when the attribute says eu, even with a non-EU timezone", async () => {
        setTimezone("America/New_York")
        setRegionAttr("eu")
        await loadModule()
        await firePageLoad()

        const def = consentEntries().find((e) => e[1] === "default")
        expect(allSignalsAre(def?.[2], "denied")).toBe(true)
        expect(runCookieConsent).toHaveBeenCalled()
    })

    it("treats the visitor as non-Europe when the attribute says row, even with a European timezone", async () => {
        setTimezone("Europe/Paris")
        setRegionAttr("row")
        await loadModule()
        await firePageLoad()

        const def = consentEntries().find((e) => e[1] === "default")
        expect(allSignalsAre(def?.[2], "granted")).toBe(true)
        expect(runCookieConsent).not.toHaveBeenCalled()
    })
})

describe("cookieconsent — Global Privacy Control (non-Europe)", () => {
    it("denies ad signals but keeps analytics_storage granted, with no banner", async () => {
        setTimezone("America/New_York")
        setGpc(true)
        await loadModule()
        await firePageLoad()

        const def = consentEntries().find((e) => e[1] === "default")
        expect(def?.[2].ad_storage).toBe("denied")
        expect(def?.[2].ad_user_data).toBe("denied")
        expect(def?.[2].ad_personalization).toBe("denied")
        expect(def?.[2].analytics_storage).toBe("granted")
        expect(def?.[2].wait_for_update).toBeUndefined()
        expect(runCookieConsent).not.toHaveBeenCalled()
    })

    it("still runs analytics but never pushes enable_marketing", async () => {
        setTimezone("America/New_York")
        setGpc(true)
        await loadModule()
        await firePageLoad()

        expect(posthogInit).toHaveBeenCalled()
        expect(window.dataLayer.some((e: any) => e?.event === "enable_marketing")).toBe(false)
    })

    it("doesn't change behavior when unsignaled (default)", async () => {
        setTimezone("America/New_York")
        setGpc(false)
        await loadModule()
        await firePageLoad()

        expect(window.dataLayer.some((e: any) => e?.event === "enable_marketing")).toBe(true)
    })
})

describe("cookieconsent — Global Privacy Control (Europe)", () => {
    it("doesn't change the already-fully-denied EU defaults or skip the banner", async () => {
        setTimezone("Europe/Paris")
        setGpc(true)
        await loadModule()
        await firePageLoad()

        const def = consentEntries().find((e) => e[1] === "default")
        expect(allSignalsAre(def?.[2], "denied")).toBe(true)
        expect(runCookieConsent).toHaveBeenCalled()
    })

    it("keeps ad signals denied and never fires enable_marketing, even if the user accepts marketing", async () => {
        setTimezone("Europe/Paris")
        setGpc(true)
        await loadModule()
        await firePageLoad()

        const { onConsent } = runCookieConsent.mock.calls[0][0]
        await onConsent({ cookie: { categories: ["analytics", "marketing"] } })

        const upd = consentEntries()
            .filter((e) => e[1] === "update")
            .pop()
        expect(upd?.[2].ad_storage).toBe("denied")
        expect(upd?.[2].ad_user_data).toBe("denied")
        expect(upd?.[2].ad_personalization).toBe("denied")
        expect(upd?.[2].analytics_storage).toBe("granted")
        expect(window.dataLayer.some((e: any) => e?.event === "enable_marketing")).toBe(false)
    })
})
