import { isEntryAPluginElementPredicate } from "@kestra-io/ui-libs"
import type { Plugin, PluginElement } from "@kestra-io/ui-libs"

export type CardPlugin = {
    name: string
    title: string
    group: string
    subGroup?: string
    categories?: string[]
    description?: string
    className?: string
    elementCounts?: number
    blueprints?: number
}

export function prunePluginsForCards(
    plugins: Plugin[], 
    pluginsData: Record<string, any>
): CardPlugin[] {
    return plugins.map(p => {
        const key = p.subGroup ?? p.group ?? p.name
        const info = pluginsData[key] ?? {}
        return {
            name: p.name,
            title: info.title ?? p.title,
            group: p.group,
            subGroup: p.subGroup,
            categories: info.categories ?? p.categories,
            description: info.description ?? p.description,
            className: info.className,
            elementCounts: info.elementCounts,
            blueprints: info.blueprints,
        }
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
