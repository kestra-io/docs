export function watchDarkSections() {
    const sections =
        document.querySelectorAll<HTMLElement>("[data-header-dark]")
    if (!sections.length || document.body.dataset.darkSectionsWatched)
        return
    document.body.dataset.darkSectionsWatched = "true"
    let frame = 0
    const update = () => {
        frame = 0
        const bar = document.getElementById("top-bar")
        if (!bar) return setTimeout(schedule, 100)
        const line = bar.getBoundingClientRect().bottom - 1
        const over = [...sections].some((section) => {
            const box = section.getBoundingClientRect()
            return box.top <= line + 4 && box.bottom > line
        })
        document.body.toggleAttribute("data-header-over-dark", over)
    }
    const schedule = () => {
        frame ||= requestAnimationFrame(update)
    }
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    document.addEventListener(
        "astro:before-swap",
        () => {
            window.removeEventListener("scroll", schedule)
            window.removeEventListener("resize", schedule)
            document.body.removeAttribute("data-header-over-dark")
            delete document.body.dataset.darkSectionsWatched
        },
        { once: true },
    )
    update()
}
