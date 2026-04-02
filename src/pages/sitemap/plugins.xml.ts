export const prerender = false

import type { APIRoute } from "astro"
import { sitemapResponse, formatLastMod } from "~/utils/sitemap.ts"
import {
    isEntryAPluginElementPredicate,
    subGroupName,
    buildPluginMappings,
    filterPluginsWithoutDeprecated,
    type Plugin,
    type PluginElement,
} from "@kestra-io/ui-libs"
import { $fetchApiCached } from "~/utils/fetch.ts"
import { slugify } from "@kestra-io/ui-libs/src/utils/url.ts"

export const GET: APIRoute = async () => {
    const allPlugins = await $fetchApiCached<Plugin[]>(`/plugins/subgroups`)

    const mapping = buildPluginMappings(allPlugins)
    const subgroups = Object.values(mapping.clsToSubgroup)
    const allPages = filterPluginsWithoutDeprecated(allPlugins).flatMap((plugin) => {
        const pluginName = plugin.name
        const groupUrl = slugify(subGroupName(plugin))
        const urls = [`/plugins/${pluginName}`]

        if (subgroups.includes(groupUrl)) {
            urls.push(`/plugins/${pluginName}/${slugify(subGroupName(plugin))}`)
        }

        const pluginUpdated = (plugin as any).updatedAt ?? (plugin as any).updated ?? null

        const pluginUrls = urls.concat(
            Object.entries(plugin)
                .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
                .map(([_, value]) => value as PluginElement[])
                .flatMap((value) => {
                    return value.map((t: PluginElement) => {
                        const subgroup = mapping.clsToSubgroup[t.cls]
                        const url = `/plugins/${pluginName}${subgroup ? "/" + subgroup : ""}/${t.cls.toLocaleLowerCase()}`
                        return t.deprecated ? null : url
                    }).filter(url => url !== null)
                }),
        )

        // Attach plugin-level updatedAt to top-level plugin pages where possible
        return pluginUrls.map((u) => ({ loc: u as string, lastmod: formatLastMod(pluginUpdated) }))
    })
    // allPages now is array of objects or arrays; flatten and unique by loc
    const flat = ([] as any[]).concat(...allPages)
    const mapByLoc: Record<string, { loc: string; lastmod?: string | null }> = {}
    flat.forEach((p) => {
        const loc = typeof p === "string" ? p : p.loc
        const lastmod = typeof p === "string" ? null : p.lastmod
        mapByLoc[loc] = mapByLoc[loc] || { loc, lastmod }
    })

    const urls = Object.values(mapByLoc).map((e) => ({ loc: `https://kestra.io${e.loc}`, lastmod: e.lastmod }))

    return sitemapResponse(urls)
}