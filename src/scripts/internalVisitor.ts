// Lets Kestra colleagues mark their own browser as internal, so their visits
// can be filtered out of PostHog. Opening any page with ?kestra_internal=1
// sets the flag, ?kestra_internal=0 clears it. The flag lives in localStorage,
// so it survives cookie resets and PostHog's own storage being cleared.
//
// The parameter is stripped from the address bar as soon as it is read, so a
// link copied afterwards never flags whoever it is shared with.

import posthog from "posthog-js"

const PARAM = "kestra_internal"
const STORAGE_KEY = "ka_internal"
const PROPERTY = "is_internal"

// Runs on every astro:page-load, before analytics is set up, so the flag is
// stored even for a visitor who has not consented to analytics yet.
export const readInternalFlagFromUrl = () => {
    try {
        if (!window.location.search) return

        const url = new URL(window.location.href)
        const value = url.searchParams.get(PARAM)
        if (value === null) return

        if (value === "0") {
            localStorage.removeItem(STORAGE_KEY)
        } else {
            localStorage.setItem(STORAGE_KEY, "1")
        }

        // Keep ClientRouter's history state, only drop the parameter.
        url.searchParams.delete(PARAM)
        history.replaceState(history.state, "", url.pathname + url.search + url.hash)
    } catch {
        /* localStorage or history unavailable — ignore */
    }
}

export const isInternalVisitor = () => {
    try {
        return localStorage.getItem(STORAGE_KEY) === "1"
    } catch {
        return false
    }
}

// Call once PostHog is initialized. Registers `is_internal` on every event and
// on the person, and only talks to PostHog when the flag actually changed, so
// soft navigations don't send a $set each time.
export const tagInternalVisitor = () => {
    const flagged = isInternalVisitor()
    const registered = posthog.get_property(PROPERTY) === true
    if (flagged === registered) return

    if (flagged) {
        posthog.register({ [PROPERTY]: true })
        posthog.setPersonProperties({ [PROPERTY]: true })
    } else {
        posthog.unregister(PROPERTY)
        posthog.setPersonProperties({ [PROPERTY]: false })
    }
}
