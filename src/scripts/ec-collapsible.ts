/**
 * Custom collapse toggle handler for expressive-code-collapsible.
 *
 * The expressive-code-collapsible plugin handles server-side rendering (HTML
 * structure, CSS classes, meta options) but its built-in JS had two issues:
 * 1. Preview height was hardcoded (line-count × fixed px), ignoring actual
 *    rendered line-height and padding — causing only ~12 lines to show instead of 20.
 * 2. Toggle handlers bound on DOMContentLoaded were lost after Astro View
 *    Transitions, so "See more / See less" clicks stopped working on navigation.
 *
 * This script replaces the plugin's JS by computing --ec-collapse-preview-height
 * from getComputedStyle at runtime and re-binding on astro:page-load.
 */
document.addEventListener("astro:page-load", () => {
    document.querySelectorAll<HTMLButtonElement>(".ec-collapse__toggle, .ec-collapse__header-toggle").forEach((btn) => {
        if (btn.dataset.init) return
        btn.dataset.init = "true"

        const frame = btn.closest<HTMLElement>(".ec-collapse")
        if (!frame) return

        if (!frame.dataset.heightInit) {
            frame.dataset.heightInit = "true"
            const lines = parseInt(frame.dataset.collapsePreviewLines || "20", 10)
            const lh = parseFloat(getComputedStyle(frame.querySelector("code")!).lineHeight) || 21.6
            const pre = frame.querySelector("pre")
            const pad = pre ? parseFloat(getComputedStyle(pre).paddingTop) + parseFloat(getComputedStyle(pre).paddingBottom) : 56
            frame.style.setProperty("--ec-collapse-preview-height", `${lines * lh + pad}px`)
        }

        // Patch expand button text to show total line count
        const expandSpan = btn.querySelector(".ec-collapse__text-expand")
        if (expandSpan) {
            const totalLines = frame.querySelectorAll(".ec-line").length
            if (totalLines > 0) {
                expandSpan.textContent = `See all ${totalLines} lines`
            }
        }

        btn.addEventListener("click", (e) => {
            e.preventDefault()
            const collapsed = frame.classList.toggle("ec-collapse--expanded", frame.classList.contains("ec-collapse--collapsed"))
            frame.classList.toggle("ec-collapse--collapsed", !collapsed)
            frame.querySelectorAll(".ec-collapse__toggle, .ec-collapse__header-toggle").forEach((b) => b.setAttribute("aria-expanded", String(collapsed)))
            if (!collapsed && frame.getBoundingClientRect().top < 0) frame.scrollIntoView({ behavior: "smooth", block: "start" })
        })
    })
})
