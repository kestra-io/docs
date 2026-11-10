const STORAGE_KEY = "theme"
const DARK_MQ = "(prefers-color-scheme: dark)"

type Theme = "light" | "dark" | "system"

function getStoredTheme(): Theme {
    return (localStorage.getItem(STORAGE_KEY) as Theme) ?? "system"
}

function isDark(theme: Theme): boolean {
    return theme === "dark" || (theme === "system" && matchMedia(DARK_MQ).matches)
}

function applyTheme(theme: Theme = getStoredTheme(), doc: Document = document) {
    // A page can pin its theme (Layout's forceTheme), e.g. a campaign page
    // whose palette is fixed.
    const forced = doc.documentElement.dataset.forceTheme as Theme | undefined
    const dark = forced ? forced === "dark" : isDark(theme)

    doc.documentElement.classList.toggle("dark", dark)
    doc.documentElement.classList.toggle("light", !dark)

    doc.querySelectorAll<HTMLButtonElement>(".theme-switcher button").forEach((btn) => {
        btn.classList.toggle("active", btn.id === `theme-${theme}`)
    })
}

document.addEventListener("click", (e) => {
    const btn = (e.target as Element).closest<HTMLButtonElement>(".theme-switcher button")
    if (!btn) return

    const theme = btn.id.replace("theme-", "") as Theme

    if (theme === "system") {
        localStorage.removeItem(STORAGE_KEY)
    } else {
        localStorage.setItem(STORAGE_KEY, theme)
    }

    applyTheme(theme)
})

matchMedia(DARK_MQ).addEventListener("change", () => {
    if (getStoredTheme() === "system") applyTheme()
})

document.addEventListener("astro:before-swap", (e: any) => applyTheme(getStoredTheme(), e.newDocument))
document.addEventListener("astro:page-load", () => applyTheme())

applyTheme()
