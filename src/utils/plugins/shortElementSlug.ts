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

    const suffix = `.${last}`.toLowerCase()
    const findUnder = (prefix: string) => {
        const lowerPrefix = prefix.toLowerCase()
        return pages.find(
            (page) =>
                page.toLowerCase().startsWith(lowerPrefix) && page.toLowerCase().endsWith(suffix),
        )
    }

    // Look under the requested subgroup first: bare names are not unique within a plugin
    // (io.kestra.plugin.ai.tool.A2aClient and io.kestra.plugin.ai.agent.A2aClient are two
    // different pages), so a plugin-wide search would 301 to the wrong element.
    const subgroupPath = `/plugins/${splitRouteSlug.slice(0, -1).join("/")}`
    const element = findUnder(`${subgroupPath}/`) ?? findUnder(`/plugins/${splitRouteSlug[0]}/`)
    if (element) return element

    return subgroupPath
}
