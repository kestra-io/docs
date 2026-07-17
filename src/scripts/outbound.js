import posthog from "posthog-js"

// Delegated, passive listener on document so it survives Astro client-side
// navigations (astro:page-load re-renders the DOM; per-link handlers would not).
// Captures clicks on github.com links only. posthog.capture() is a no-op-safe
// queue if PostHog isn't initialized yet (e.g. before consent), so no guard needed.
document.addEventListener(
    "click",
    (e) => {
        // Early return first — this runs on every click on the page.
        const link = e.target.closest("a[href]")
        if (!link) return

        const url = link.href
        if (!/^https?:\/\//.test(url)) return

        try {
            const parsed = new URL(url)
            if (parsed.hostname !== "github.com") return
        } catch {
            return
        }

        posthog.capture("outbound_click", {
            url: url,
            link_text: link.innerText?.trim().slice(0, 100) || null,
            source_path: window.location.pathname,
            target: link.target || "_self",
        })
    },
    { capture: true, passive: true },
)
