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

        return urls.concat(
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
        ).map((url) => ({
            loc: `https://kestra.io${url}`,
            lastmod: formatLastMod(pluginUpdated),
        }))
    })

    // Remove duplicates (can happen when a plugin is in multiple subgroups)
    // and get the most recent lastmod for each URL if there are duplicates
    const uniquePages = new Map<string, { loc: string; lastmod: string | null }>()
    for (const page of allPages) {
        if (!uniquePages.has(page.loc)) {
            uniquePages.set(page.loc, page)
        } else if (page.lastmod && (!uniquePages.get(page.loc)?.lastmod || (page.lastmod > (uniquePages.get(page.loc)!.lastmod ?? "")))) {
            uniquePages.set(page.loc, page)
        }
    }

    const urls = Array.from(uniquePages.values())

    return sitemapResponse(urls)
}