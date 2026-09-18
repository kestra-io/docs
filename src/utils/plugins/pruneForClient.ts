import { isEntryAPluginElementPredicate } from "./plugin"
import type { Plugin, PluginElement } from "./plugin"
import { canonicalPluginPath, type PluginUrlIndex } from "./canonicalUrl"

export type CardPlugin = {
    name: string
    title: string
    subGroupTitle?: string
    group: string
    subGroup?: string
    categories?: string[]
    description?: string
    className?: string
    elementCounts?: number
    blueprints?: number
    isEnterprise?: boolean
    classes?: string
    lastReleasedAt?: string
    usageCount?: number
    /** Canonical pathname, set when an url index is supplied. */
    href?: string
}

export function prunePluginsForCards(
    plugins: Plugin[],
    pluginsData: Record<string, any>,
    urlIndex?: Pick<PluginUrlIndex, "multiSubGroupPlugins">,
    rootGroups: Set<string> = new Set(),
): CardPlugin[] {
    return plugins.map(p => {
        const key = p.subGroup ?? p.group ?? p.name

        /** A subgroup only collides with another plugin's own info when its value IS that other
         *  plugin's root group (e.g. plugin-ee-git's subGroup is literally "io.kestra.plugin.git",
         *  plugin-git's own group) — fall back to this plugin's own group info in that case.
         *  A subgroup that merely lives in a different package tree from its own group (e.g. core's
         *  "io.kestra.plugin.ee.assets" subgroup) is not a collision: it owns its pluginsData entry. */
        const isForeignSubgroup = p.subGroup !== undefined && p.subGroup !== p.group && rootGroups.has(p.subGroup)
        const info = (isForeignSubgroup ? pluginsData[p.group] : pluginsData[key]) ?? {}

        const groupInfo = pluginsData[p.group]

        const classes = Object.entries(p)
            .filter(([k, v]) => isEntryAPluginElementPredicate(k, v))
            .flatMap(([, v]) => (v as PluginElement[]).map((el) => el.cls))
            .join(" ")
            .replace(/io\.kestra\.plugin\./g, "")

        return {
            name: p.name,
            title: info.title ?? p.title ?? p.name,
            subGroupTitle: p.title,
            group: p.group,
            subGroup: p.subGroup,
            categories: info.categories ?? p.categories,
            description: (p.subGroup?.startsWith(p.group) ? info.description : groupInfo?.description) ?? p.description,
            className: info.className,
            elementCounts: info.elementCounts,
            blueprints: info.blueprints,
            isEnterprise: p.group?.includes('.ee.') ?? false,
            classes,
            lastReleasedAt: info.lastReleasedAt as string | undefined,
            usageCount: info.usageCount as number | undefined,
            href: urlIndex ? canonicalPluginPath(p, urlIndex) : undefined,
        }
    })
}

/**
 * Strip heavy fields (descriptions, aliases, manifest) from plugins
 * before sending to client-side components that only need navigation data.
 */
export function prunePluginsForSidebar(plugins: Plugin[]): Plugin[] {
    return plugins.map((p) => {
        const pruned: Record<string, any> = {
            name: p.name,
            title: p.title,
            group: p.group,
            subGroup: p.subGroup,
            categories: p.categories,
        }

        for (const [key, value] of Object.entries(p)) {
            if (isEntryAPluginElementPredicate(key, value)) {
                pruned[key] = (value as PluginElement[]).map((el) => ({
                    cls: el.cls,
                    deprecated: el.deprecated,
                }))
            }
        }

        return pruned as Plugin
    })
}
