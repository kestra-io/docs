export const prerender = false

import type { APIRoute } from "astro"
import { sitemapResponse, formatLastMod } from "~/utils/sitemap.ts"
import {
    isEntryAPluginElementPredicate,
    filterPluginsWithoutDeprecated,
    type Plugin,
    type PluginElement,
} from "~/utils/plugins/plugin"
import {
    buildPluginUrlIndex,
    canonicalPluginPath,
    canonicalPluginUrl,
} from "~/utils/plugins/canonicalUrl"
import { $fetchApiCached } from "~/utils/fetch.ts"

export const GET: APIRoute = async () => {
    const allPlugins = await $fetchApiCached<Plugin[]>(`/plugins/subgroups`)

    const index = buildPluginUrlIndex(allPlugins)
    const allPages = filterPluginsWithoutDeprecated(allPlugins).flatMap((plugin) => {
        const pluginName = plugin.name
        const root = `/plugins/${pluginName}`
        // Only the subgroup pages that survive canonicalisation: for a plugin with a
        // single subgroup the segment is stripped with a 301, so listing it would put a
        // redirect in the sitemap.
        const base = canonicalPluginPath(plugin, index) ?? root
        const urls = base === root ? [root] : [root, base]

        const pluginUpdated = (plugin as any).updatedAt ?? (plugin as any).updated ?? null

        return urls.concat(
            Object.entries(plugin)
                .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
                .map(([_, value]) => value as PluginElement[])
                .flatMap((value) => {
                    return value.map((t: PluginElement) => {
                        if (t.deprecated) return null
                        return (
                            canonicalPluginUrl(t.cls, index)
                            ?? `${base}/${t.cls.toLocaleLowerCase()}`
                        )
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