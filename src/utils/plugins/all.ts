import {
    isEntryAPluginElementPredicate,
    type Plugin,
    type PluginElement,
    type PluginMetadata,
} from "@kestra-io/ui-libs"

function toNavTitle(title: string): string {
    let startCaseTitle = title.charAt(0).toUpperCase() + title.slice(1)
    if (title.match(/^[a-z]+[A-Z][a-z]/)) {
        startCaseTitle = title.replace(/[A-Z][a-z]/, (match) => ` ${match}`)
    }
    return startCaseTitle
        .split(".")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("")
}

/**
 * Hack to get the subpackage from a cls if subGroup is not directly provided.
 * Extracts the first-level subpackage from a class name for grouping.
 * E.g., "io.kestra.plugin.github.actions" with base "io.kestra.plugin.github" returns "actions".
 */
function getSubpackage(cls: string, baseGroup: string): string | undefined {
    const parts = cls.replace(`${baseGroup}.`, "").split(".")
    return parts.length >= 2 ? parts[0] : undefined
}

/**
 * Checks if a plugin has multiple subPackages to determine auto-grouping.
 * Returns true if 2+ unique subPackages are found.
 */
export function hasMultipleSubPackages(plugin: Plugin): boolean {
    const elements = Object.entries(plugin)
        .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
        .flatMap(([_, value]) => value as PluginElement[])

    const subPackages = new Set(
        elements.map((el) => getSubpackage(el.cls, plugin.group)).filter(Boolean),
    )

    return subPackages.size > 1
}

/**
 * Groups plugin elements by subpackage for hierarchical navigation.
 * Creates separate Plugin objects per subpackage (e.g., "actions", "issues" for GitHub).
 * Uses provided metadata to add descriptions.
 *
 * @example
 * Groups GitHub plugin tasks into subgroups like "actions", "code", "commits", "issues", etc.
 */
export function groupBySubpackage(plugin: Plugin, allMetadata: PluginMetadata[]): Plugin[] {
    const groups = new Map<string, Record<string, PluginElement[]>>()

    Object.entries(plugin)
        .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
        .forEach(([elementType, elements]) => {
            ;(elements as PluginElement[]).forEach((element) => {
                const subpackage = getSubpackage(element.cls, plugin.group)
                if (!subpackage) return

                if (!groups.has(subpackage)) {
                    groups.set(subpackage, {})
                }

                const group = groups.get(subpackage)!
                if (!group[elementType]) {
                    group[elementType] = []
                }
                group[elementType].push(element)
            })
        })

    return Array.from(groups.entries()).map(([subpackage, elementsByType]) => {
        const formattedSubpackage = toNavTitle(subpackage)
            .replace(/([A-Z])/g, " $1")
            .trim()
        const subGroupCls = `${plugin.group}.${subpackage}`
        const metadata = allMetadata?.find((m) => m.group === subGroupCls)

        return {
            name: plugin.name,
            title: subpackage,
            group: plugin.group,
            subGroup: subpackage,
            description:
                metadata?.description ??
                `This Sub-Group Of Plugin Contains Tasks For Using ${plugin.name} ${formattedSubpackage}`,
            categories: plugin.categories ?? [],
            ...elementsByType,
        }
    }) as any[]
}