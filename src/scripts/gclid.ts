// Capture Google Ads click identifiers (gclid / gbraid / wbraid) from the
// landing URL and persist them so they can be attached to a HubSpot form
// submission later. This is what enables *offline conversion import* back into
// Google Ads: HubSpot uploads the conversion (e.g. a booked/qualified demo)
// against the original click via this id, which is the strongest signal we can
// give Smart Bidding.
//
// The value is stored in localStorage with a 90-day TTL (Google's default gclid
// conversion window). Capture only *reads* a URL param — the id is only ever
// sent when the user themselves submits a form.

const STORAGE_KEY = "ka_gclid"
const TTL_MS = 90 * 24 * 60 * 60 * 1000 // 90 days

type StoredClickId = {
    value: string
    field: string // which HubSpot field/param name the id maps to
    ts: number
}

// Order matters: gclid (search/display), then gbraid/wbraid (iOS app/web).
const CLICK_ID_PARAMS = ["gclid", "gbraid", "wbraid"] as const

const capture = () => {
    if (typeof window === "undefined" || !window.location.search) return

    const params = new URLSearchParams(window.location.search)
    for (const field of CLICK_ID_PARAMS) {
        const value = params.get(field)
        if (value) {
            const payload: StoredClickId = { value, field, ts: Date.now() }
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
            } catch {
                /* localStorage unavailable — ignore */
            }
            return
        }
    }
}

export const getStoredClickId = (): StoredClickId | null => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw) as StoredClickId
        if (!parsed?.value || Date.now() - parsed.ts > TTL_MS) {
            localStorage.removeItem(STORAGE_KEY)
            return null
        }
        return parsed
    } catch {
        return null
    }
}

// Runs on the initial load and after every client-side (ClientRouter)
// navigation, so a gclid on any entry URL is captured.
document.addEventListener("astro:page-load", capture)
