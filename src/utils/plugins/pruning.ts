import type { Plugin } from "@kestra-io/ui-libs"

export const prunePlugin = (p: Plugin) => {
    const pruned: any = {
        title: p.title,
        group: p.group,
        subGroup: p.subGroup,
        name: p.name,
        description: p.description,
        aliases: p.aliases
    }

    const elementKeys = [
        "tasks",
        "triggers",
        "conditions",
        "controllers",
        "storages",
        "guides",
    ]
    for (const key of elementKeys) {
        if (Array.isArray((p as any)[key])) {
            pruned[key] = (p as any)[key].map((el: any) => ({ cls: el.cls, deprecated: el.deprecated }))
        }
    }

    return pruned
}

export const prunePluginData = (value: any) => {
    return {
        title: value.title,
        description: value.description,
        categories: value.categories,
        elementCounts: value.elementCounts,
        blueprints: value.blueprints,
        className: value.className,
    }
}

export const prunePlugins = (plugins: Plugin[]) => {
    return plugins.map(prunePlugin)
}

export const pruneAllPluginsData = (pluginsData: any, limitToKeys?: string[]) => {
    const entries = Object.entries(pluginsData.byPlugin || pluginsData)
    
    const filteredEntries = limitToKeys 
        ? entries.filter(([key]) => limitToKeys.includes(key))
        : entries

    return Object.fromEntries(
        filteredEntries.map(([key, value]: [string, any]) => [
            key,
            prunePluginData(value)
        ])
    )
}
