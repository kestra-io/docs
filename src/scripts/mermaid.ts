document.addEventListener("astro:page-load", async () => {
    const diagrams = document.querySelectorAll<HTMLElement>(".mermaid:not([data-processed])")
    if (!diagrams.length) return

    const { default: mermaid } = await import("mermaid")

    const dark = document.documentElement.classList.contains("dark")
    mermaid.initialize({
        startOnLoad: false,
        theme: dark ? "dark" : "default",
        securityLevel: "loose",
    })

    try {
        await mermaid.run({ querySelector: ".mermaid:not([data-processed])" })
    } catch (e) {
        console.error("[mermaid] render failed:", e)
    }
})
