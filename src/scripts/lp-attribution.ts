/**
 * Campaign attribution capture for the Google Ads landing pages (`/lp/*`).
 *
 * Google Ads appends the click id and UTMs to the *landing* URL only. A visitor
 * who lands, scrolls, opens the privacy policy and comes back would otherwise
 * submit the form with no campaign context at all, so the values are persisted
 * in sessionStorage on first sight and read back at submit time.
 *
 * First touch wins: a later page view inside the same session never overwrites
 * a value that is already stored (an empty param must not erase a real one).
 *
 * Click ids (gclid/gbraid/wbraid) are handled by `./gclid.ts`, which stores them
 * in localStorage with a 90-day TTL to match Google's conversion window. They
 * are mirrored here too, so the form has a single object to read and still works
 * if localStorage is unavailable.
 *
 * Same pattern as `gclid.ts`: this module self-registers its capture on import
 * and also exports the getter used by `LpDemoForm.vue`.
 */

const STORAGE_KEY = "ka_lp_attribution"

const UTM_PARAMS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_id",
] as const

const CLICK_ID_PARAMS = ["gclid", "gbraid", "wbraid"] as const

export type LpAttribution = Record<string, string>

const read = (): LpAttribution => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as LpAttribution) : {}
    } catch {
        return {}
    }
}

const capture = () => {
    if (typeof window === "undefined") return

    const stored = read()
    const params = new URLSearchParams(window.location.search)
    let changed = false

    const set = (key: string, value: string | null | undefined) => {
        if (!value || stored[key]) return
        stored[key] = value
        changed = true
    }

    for (const param of UTM_PARAMS) set(param, params.get(param))
    for (const param of CLICK_ID_PARAMS) set(param, params.get(param))

    // The variant the ad click *landed* on — first touch, like everything else
    // here. A visitor who lands on one variant and submits on another should
    // still be attributed to the page the campaign paid for; the form's own
    // events carry the submitting page separately.
    set("lp_variant", document.body?.dataset?.lpVariant)

    // Landing page + first referrer, useful when the ad URL is mistagged.
    set("lp_landing_path", window.location.pathname)
    set("lp_referrer", document.referrer || undefined)

    if (!changed) return

    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    } catch {
        /* sessionStorage unavailable (private mode, storage full) — ignore */
    }
}

export const getLpAttribution = (): LpAttribution => read()

/** UTM subset only, for analytics event properties. */
export const getLpUtmProperties = (): LpAttribution => {
    const stored = read()
    return Object.fromEntries(
        UTM_PARAMS.filter((key) => stored[key]).map((key) => [key, stored[key]]),
    )
}

if (typeof document !== "undefined") {
    // `astro:page-load` covers the initial load and every client-side
    // navigation. Also run immediately: this module is imported by the form
    // island, which may hydrate before the router emits its first event.
    document.addEventListener("astro:page-load", capture)
    if (document.readyState !== "loading") {
        capture()
    } else {
        document.addEventListener("DOMContentLoaded", capture, { once: true })
    }
}
