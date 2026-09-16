/**
 * `/plugins/<plugin>/<subgroup>/<name>` where `<name>` is a bare class name
 * (no dot) is not a page: element pages end with the fully qualified class
 * name. The router used to render the subgroup page under that URL anyway,
 * self-canonical and with every element card linking to
 * `/plugins/<plugin>/<subgroup>/<name>/<fqcn>` — a duplicate page plus one
 * redirected link per element.
 *
 * Returns the canonical page to 301 to, or null when the URL is not of that
 * shape (or is itself a known page).
 */
export function resolveShortElementSlug(
    splitRouteSlug: string[],
    pathname: string,
    pageList: string[] | undefined,
): string | null {
    if (splitRouteSlug.length < 3) return null
    const last = splitRouteSlug[splitRouteSlug.length - 1]
    if (!last || last.includes(".")) return null

    const lower = pathname.toLowerCase()
    const pages = pageList ?? []
    if (pages.some((page) => page.toLowerCase() === lower)) return null

    const [pluginName] = splitRouteSlug
    const prefix = `/plugins/${pluginName}/`.toLowerCase()
    const suffix = `.${last}`.toLowerCase()
    const element = pages.find(
        (page) => page.toLowerCase().startsWith(prefix) && page.toLowerCase().endsWith(suffix),
    )
    if (element) return element

    return `/plugins/${splitRouteSlug.slice(0, -1).join("/")}`
}
