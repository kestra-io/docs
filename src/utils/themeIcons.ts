/**
 * Theme-responsive icons. `/icons/<cls>.svg` is served in a neutral colour;
 * the browser swaps the `-white.svg` / `-black.svg` variant in to match the
 * `dark` class on `<html>`. TaskIcon.astro runs this once at module load for
 * the icons it server-rendered; components that stamp `<img
 * data-theme-responsive>` on the client afterwards call it again for the nodes
 * they added, or build the `src` with `themeIconSrc` up front so the neutral
 * file is never requested.
 */
const THEME_ICON_SELECTOR = "img[data-theme-responsive]"

const SUFFIX = /(-white|-black)?\.svg$/

/**
 * Split the `[cls]` param of `/icons/[cls].svg` into the plugin class and the
 * colour variant. Only the `-white` / `-black` suffixes this module produces
 * count as a variant: plugin groups can contain hyphens
 * (`io.kestra.plugin.ee.new-relic`), so splitting on the first `-` would
 * truncate the class and fetch the API's generic fallback icon.
 */
export function parseIconParam(param: string): {
    cls: string
    modifier?: "white" | "black"
} {
    const match = /^(.+)-(white|black)$/.exec(param)
    return match
        ? { cls: match[1], modifier: match[2] as "white" | "black" }
        : { cls: param }
}

export function isDarkTheme(): boolean {
    return document.documentElement.classList.contains("dark")
}

/** `/icons/x.svg`, `/icons/x-black.svg` -> `/icons/x-white.svg` in dark mode. */
export function themeIconSrc(src: string, dark = isDarkTheme()): string {
    return src.replace(SUFFIX, dark ? "-white.svg" : "-black.svg")
}

/** Re-point every theme-responsive icon under `root` at the current theme's variant. */
export function updateThemeIcons(root: ParentNode = document): void {
    const dark = isDarkTheme()
    root.querySelectorAll<HTMLImageElement>(THEME_ICON_SELECTOR).forEach(
        (icon) => {
            const src = icon.getAttribute("src")
            if (src) {
                icon.setAttribute("src", themeIconSrc(src, dark))
            }
        },
    )
}

let watching = false

/**
 * Keep the icons in sync with the theme toggle (class changes on `<html>`) and
 * with the ClientRouter, which swaps in fresh icons without re-running the
 * module that called this. Safe to call from several components: the
 * listeners are installed once per page.
 */
export function watchThemeIcons(): void {
    if (watching) return
    watching = true

    document.addEventListener("astro:page-load", () => updateThemeIcons())

    const observer = new MutationObserver((mutations) => {
        if (mutations.some((m) => m.attributeName === "class")) {
            updateThemeIcons()
        }
    })
    observer.observe(document.documentElement, { attributes: true })
}
