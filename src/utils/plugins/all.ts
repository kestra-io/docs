import {
    isEntryAPluginElementPredicate,
    type Plugin,
    type PluginElement,
    type PluginMetadata,
} from "./plugin"

export function toNavTitle(title: string): string {
    const startCase = title.match(/^[a-z]+[A-Z][a-z]/)
        ? title.replace(/[A-Z][a-z]/, (m) => ` ${m}`)
        : title.charAt(0).toUpperCase() + title.slice(1)

    return startCase
        .split(".")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("")
}

function getPluginElements(plugin: Plugin): PluginElement[] {
    return Object.entries(plugin)
        .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
        .flatMap(([_, value]) => value as PluginElement[])
}

function getSubpackage(cls: string, baseGroup: string): string | undefined {
    const parts = cls.replace(`${baseGroup}.`, "").split(".")
    return parts.length >= 2 ? parts[0] : undefined
}

export function hasMultipleSubPackages(plugin: Plugin): boolean {
    const subPackages = new Set(
        getPluginElements(plugin)
            .map((el) => getSubpackage(el.cls, plugin.group))
            .filter(Boolean),
    )
    return subPackages.size > 1
}

export function groupBySubpackage(plugin: Plugin, allMetadata: PluginMetadata[]): Plugin[] {
    const groups = new Map<string, Record<string, PluginElement[]>>()

    Object.entries(plugin)
        .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
        .forEach(([elementType, elements]) => {
            for (const element of elements as PluginElement[]) {
                const subpackage = getSubpackage(element.cls, plugin.group)
                if (!subpackage) continue

                if (!groups.has(subpackage)) {
                    groups.set(subpackage, {})
                }

                const group = groups.get(subpackage)!
                ;(group[elementType] ??= []).push(element)
            }
        })

    return Array.from(groups.entries()).map(([subpackage, elementsByType]) => {
        const formatted = toNavTitle(subpackage).replace(/([A-Z])/g, " $1").trim()
        const metadata = allMetadata?.find((m) => m.group === `${plugin.group}.${subpackage}`)

        return {
            name: plugin.name,
            title: subpackage,
            group: plugin.group,
            subGroup: subpackage,
            description: metadata?.description
                ?? `This Sub-Group Of Plugin Contains Tasks For Using ${plugin.name} ${formatted}`,
            categories: plugin.categories ?? [],
            ...elementsByType,
        }
    }) as any[]
}
