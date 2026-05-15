import { slugify } from "../slugify"

export type PluginElement = {
    cls: string
    deprecated?: boolean
}

export type PluginMetadata = {
    group: string
    artifactGroupId: string
    artifactId: string
    name: string
    title: string
    description?: string
    videos?: string[]
    createdBy?: string
    managedBy?: string
    version?: string
    icon?: string
}

export type Plugin = {
    name: string
    title: string
    group: string
    longDescription?: string
    description?: string
    subGroup?: string
    tooltipContent?: string
    categories?: string[]
    controllers?: string[]
    storages?: string[]
    aliases?: string[]
    guides?: string[]
    manifest?: Record<string, any>
    [pluginElement: string]: PluginElement[] | string | string[] | Record<string, any> | undefined
}

export function isEntryAPluginElementPredicate(key: string, value: any): value is PluginElement[] {
    return (
        Array.isArray(value) &&
        !["categories", "controllers", "storages", "aliases", "guides"].includes(key) &&
        ((value as any[]).length === 0 || value[0]?.cls !== undefined)
    )
}

export function subGroupName(subGroupWrapper: { title?: string }) {
    const title = subGroupWrapper.title ?? ""
    const result = title.replace(/\.([a-zA-Z])/g, (_, capture) => ` ${capture.toUpperCase()}`)
    return result.charAt(0).toUpperCase() + result.slice(1)
}

export function extractPluginElements(plugin: Plugin): Record<string, string[]> {
    return Object.fromEntries(
        Object.entries(plugin)
            .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
            .map(([key, value]) => [
                key.replace(/[A-Z]/g, (match) => ` ${match}`),
                (value as PluginElement[]).filter(({ deprecated }) => !deprecated).map(({ cls }) => cls),
            ]),
    )
}

export function filterPluginsWithoutDeprecated(plugins: Plugin[]): Plugin[] {
    return plugins.flatMap((plugin) => {
        const filteredEntries = Object.entries(plugin)
            .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
            .map(([key, value]) => [key, (value as PluginElement[]).filter((element) => !element.deprecated)])
            .filter(([, elements]) => elements.length > 0)

        return filteredEntries.length > 0 ? [{ ...plugin, ...Object.fromEntries(filteredEntries) }] : []
    })
}

export type PluginMappings = {
    clsToSubgroup: Record<string, string>
    clsToPlugin: Record<string, { slug: string; raw: string }>
    shortNameToCls: Record<string, string[]>
}

export function buildPluginMappings(plugins: Plugin[]): PluginMappings {
    const mappings: PluginMappings = { clsToSubgroup: {}, clsToPlugin: {}, shortNameToCls: {} }

    for (const plugin of plugins ?? []) {
        const elements = extractPluginElements(plugin)
        const group = plugin.group ?? plugin.name ?? ""
        const pluginSlug = slugify(group)
        const subgroupSlug = plugin.subGroup ? slugify(subGroupName(plugin)) : undefined

        Object.values(elements).forEach((names) => {
            names.forEach((cls) => {
                if (subgroupSlug) mappings.clsToSubgroup[cls] = subgroupSlug
                mappings.clsToPlugin[cls] = { slug: pluginSlug, raw: group }

                const short = (cls.split(".").pop() ?? cls).toLowerCase()
                mappings.shortNameToCls[short] = mappings.shortNameToCls[short] ?? []
                if (!mappings.shortNameToCls[short].includes(cls)) {
                    mappings.shortNameToCls[short].push(cls)
                }
            })
        })
    }

    return mappings
}
