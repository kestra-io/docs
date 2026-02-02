import type { APIRoute } from "astro"
import { sitemapResponse } from "~/utils/sitemap.ts"
import {
    isEntryAPluginElementPredicate,
    subGroupName,
    buildPluginMappings,
    filterPluginsWithoutDeprecated,
    type Plugin,
    type PluginElement,
} from "@kestra-io/ui-libs"
import { $fetch } from "~/utils/fetch.ts"
import { API_URL } from "astro:env/client"
import { slugify } from "@kestra-io/ui-libs/src/utils/url.ts"

export const GET: APIRoute = async () => {
    const allPlugins = await $fetch<Plugin[]>(`${API_URL}/plugins/subgroups`)
    const mapping = buildPluginMappings(allPlugins)
    const subgroups = Object.values(mapping.clsToSubgroup)
    const allPages = filterPluginsWithoutDeprecated(allPlugins).flatMap((plugin) => {
        const pluginName = plugin.name
        const groupUrl = slugify(subGroupName(plugin))
        const urls = [`/plugins/${pluginName}`]

        if (subgroups.includes(groupUrl)) {
            urls.push(`/plugins/${pluginName}/${slugify(subGroupName(plugin))}`)
        }

        return urls.concat(
            Object.entries(plugin)
                .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
                .map(([_, value]) => value as PluginElement[])
                .flatMap((value) => {
                    return value.map((t: PluginElement) => {
                        const subgroup = mapping.clsToSubgroup[t.cls]
                        return `/plugins/${pluginName}${subgroup ? "/" + subgroup : ""}/${t.cls.toLocaleLowerCase()}`
                    })
                }),
        )
    })

    const urls = [...new Set(allPages)].map((e) => `https://kestra.io${e}`)

    return sitemapResponse(urls)
}