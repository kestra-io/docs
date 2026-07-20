import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CONSENT_REGION_COOKIE } from "~/middlewares/consentRegion"

// vanilla-cookieconsent's run() is mocked to capture the config so tests can
// invoke onConsent/onChange directly, as if the user interacted with the UI.
const runCookieConsent = vi.fn()
vi.mock("vanilla-cookieconsent", () => ({
    run: (config: unknown) => runCookieConsent(config),
}))

const posthogInit = vi.fn()
vi.mock("posthog-js", () => ({
    default: {
        init: (...args: unknown[]) => posthogInit(...args),
        register_for_session: vi.fn(),
        get_property: vi.fn(() => undefined),
        alias: vi.fn(),
        capture: vi.fn(),
    },
}))

vi.mock("~/utils/identify", () => ({ default: vi.fn() }))

const fetchApi = vi.fn(async (..._args: unknown[]) => ({ posthog: { token: "tok" }, id: "kuid-1" }))
vi.mock("~/utils/fetch", () => ({ $fetchApi: (...args: unknown[]) => fetchApi(...args) }))

vi.mock("astro:env/client", () => ({ GTM_ID: "GTM-TEST" }))

const SIGNALS = ["ad_storage", "ad_user_data", "ad_personalization", "analytics_storage"] as const

// The module only touches a small DOM surface (document.addEventListener,
// documentElement.classList, createElement("script"), head.appendChild), so
// a hand-rolled fake avoids pulling in a jsdom/happy-dom dependency just for
// this one test file.
type FakeScript = { async: boolean; src: string }
let listeners: Record<string, ((e: Event) => void)[]>
let headChildren: FakeScript[]

const installFakeDom = () => {
    listeners = {}
    headChildren = []

    const fakeDocument = {
        cookie: "",
        addEventListener: (type: string, cb: (e: Event) => void) => {
            listeners[type] = listeners[type] || []
            listeners[type].push(cb)
        },
        // Unlike real DOM dispatchEvent, this awaits listeners so tests can
        // deterministically wait for the async banner-init dynamic import.
        dispatchEvent: (event: Event) => Promise.all((listeners[event.type] || []).map((cb) => cb(event))),
        documentElement: { classList: { add: vi.fn() } },
        createElement: (tag: string) => {
            if (tag !== "script") throw new Error(`unexpected createElement(${tag})`)
            const script: FakeScript = { async: false, src: "" }
            return script
        },
        head: {
            appendChild: (el: FakeScript) => headChildren.push(el),
        },
    }

    vi.stubGlobal("document", fakeDocument)
    vi.stubGlobal("window", globalThis)
    vi.stubGlobal("localStorage", { setItem: vi.fn() })
    globalThis.location = { pathname: "/", search: "" } as Location
}

const gtmScriptTags = () => headChildren.filter((s) => s.src.includes("googletagmanager.com/gtm.js"))

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

const setRegionCookie = (value: "eu" | "row") => {
    document.cookie = `${CONSENT_REGION_COOKIE}=${value}`
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
    fetchApi.mockClear()
})

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

// No region cookie is set in these two describe blocks, so they also cover
// the Intl-timezone fallback path (the only path available in local `astro
// dev`, since the Node adapter never runs the Worker that sets the cookie).
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

    it("fires analytics and marketing immediately", () => {
        expect(posthogInit).toHaveBeenCalled()
        expect(window.dataLayer.some((e: any) => e?.event === "enable_marketing")).toBe(true)
    })
})

describe("cookieconsent — region cookie takes precedence over Intl timezone", () => {
    it("treats the visitor as Europe when the cookie says eu, even with a non-EU timezone", async () => {
        setTimezone("America/New_York")
        setRegionCookie("eu")
        await loadModule()
        await firePageLoad()

        const def = consentEntries().find((e) => e[1] === "default")
        expect(allSignalsAre(def?.[2], "denied")).toBe(true)
        expect(runCookieConsent).toHaveBeenCalled()
    })

    it("treats the visitor as non-Europe when the cookie says row, even with a European timezone", async () => {
        setTimezone("Europe/Paris")
        setRegionCookie("row")
        await loadModule()
        await firePageLoad()

        const def = consentEntries().find((e) => e[1] === "default")
        expect(allSignalsAre(def?.[2], "granted")).toBe(true)
        expect(runCookieConsent).not.toHaveBeenCalled()
    })
})
