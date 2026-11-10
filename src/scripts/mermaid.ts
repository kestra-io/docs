let rendering: Promise<void> | null = null
let queued = false

async function renderDiagrams() {
    const diagrams = document.querySelectorAll<HTMLElement>(".mermaid:not([data-processed])")
    if (!diagrams.length) return

    // Keep the source so the diagram can be re-rendered when the theme changes.
    for (const diagram of diagrams) {
        diagram.dataset.source ??= diagram.textContent ?? ""
    }

    const { default: mermaid } = await import("mermaid")

    const dark = document.documentElement.classList.contains("dark")
    mermaid.initialize({
        startOnLoad: false,
        theme: dark ? "dark" : "default",
        securityLevel: "loose",
        // Mermaid 12 defaults to ELK (extra 1.4 MB chunk) and the "neo" look.
        layout: "dagre",
        look: "classic",
    })

    try {
        await mermaid.run({ querySelector: ".mermaid:not([data-processed])" })
    } catch (e) {
        console.error("[mermaid] render failed:", e)
    }
}

// One render at a time; a request made mid-render runs once it finishes.
function render(): Promise<void> {
    if (rendering) {
        queued = true
        return rendering
    }
    rendering = renderDiagrams().finally(() => {
        rendering = null
        if (queued) {
            queued = false
            render()
        }
    })
    return rendering
}

let renderedDark = document.documentElement.classList.contains("dark")
function rerenderOnThemeChange() {
    const dark = document.documentElement.classList.contains("dark")
    if (dark === renderedDark) return
    renderedDark = dark
    for (const diagram of document.querySelectorAll<HTMLElement>(".mermaid[data-processed]")) {
        diagram.textContent = diagram.dataset.source ?? ""
        delete diagram.dataset.processed
    }
    render()
}

new MutationObserver(rerenderOnThemeChange).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
})

document.addEventListener("astro:page-load", render)
// In dev, astro:page-load can fire before this module runs; render the first page now.
render()
