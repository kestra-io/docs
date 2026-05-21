import { isEntryAPluginElementPredicate } from "@kestra-io/ui-libs"
import type { Plugin, PluginElement } from "@kestra-io/ui-libs"

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
    firstReleasedAt?: string
    lastReleasedAt?: string
    usageCount?: number
}

export function prunePluginsForCards(
    plugins: Plugin[],
    pluginsData: Record<string, any>
): CardPlugin[] {
    return plugins.map(p => {
        const key = p.subGroup ?? p.group ?? p.name
        const info = pluginsData[key] ?? {}
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
            firstReleasedAt: info.firstReleasedAt as string | undefined,
            lastReleasedAt: info.lastReleasedAt as string | undefined,
            usageCount: info.usageCount as number | undefined,
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

export function calculateTotalPluginCount(plugins: Plugin[]): string {
    const classes = new Set<string>()
    for (const plugin of plugins) {
        for (const [k, v] of Object.entries(plugin)) {
            if (isEntryAPluginElementPredicate(k, v)) {
                v.forEach((el: PluginElement) => classes.add(el.cls))
            }
        }
    }
    const rounded = Math.floor(classes.size / 100) * 100
    return `${rounded}+`
}
