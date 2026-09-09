import type { Plugin, PluginElement } from "./plugin"
import { isEntryAPluginElementPredicate, subGroupName } from "./plugin"
import { slugify } from "../slugify"
import type { NavItem } from "~/utils/navigation"
import { toNavTitle } from "./all"

function filterDeprecatedElements(plugin: Plugin): [string, PluginElement[]][] {
    return Object.entries(plugin)
        .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
        .map(([type, elements]) => [
            type,
            (elements as PluginElement[]).filter(({ deprecated }) => !deprecated),
        ] as [string, PluginElement[]])
        .filter(([, elements]) => elements.length > 0)
}

function buildElementNav(plugin: Plugin, parentUrl: string): NavItem[] {
    return filterDeprecatedElements(plugin).map(([key, elements]) => ({
        title: toNavTitle(key),
        isPage: false,
        path: `${parentUrl}#${slugify(key)}`,
        children: elements.map((item) => ({
            title: item.cls.substring(item.cls.lastIndexOf(".") + 1),
            path: `${parentUrl}/${slugify(item.cls)}`,
        })),
    }))
}

function stripDeprecated(plugin: Plugin): Plugin {
    const filtered = filterDeprecatedElements(plugin)
    if (filtered.length === 0) return undefined as unknown as Plugin

    const nonElementEntries = Object.entries(plugin)
        .filter(([key, value]) => !isEntryAPluginElementPredicate(key, value))

    return Object.fromEntries([...nonElementEntries, ...filtered]) as unknown as Plugin
}

export function generateNavigationFromSubgroups(pluginsSubGroups: Plugin[]): NavItem[] {
    const subGroupsByGroup: Record<string, Plugin[]> = {}

    for (const raw of pluginsSubGroups) {
        const plugin = stripDeprecated(raw)
        if (!plugin) continue
        ;(subGroupsByGroup[plugin.group] ??= []).push(plugin)
    }

    const sorted = Object.values(subGroupsByGroup)
        .map((wrappers) => {
            const root = wrappers.find((p) => p.subGroup === undefined)!
            const rootUrl = `/plugins/${slugify(root.name)}`

            const subGroups = wrappers.filter((p) => p.subGroup !== undefined)

            const children = subGroups.length > 1
                ? subGroups.map((p) => {
                        const url = `${rootUrl}/${slugify(subGroupName(p))}`
                        return {
                            title: toNavTitle(p.title),
                            path: url,
                            children: buildElementNav(p, url),
                        }
                    })
                : buildElementNav(root, rootUrl)

            return {
                title: toNavTitle(root.title),
                path: rootUrl,
                children,
            }
        })
        .sort((a, b) => {
            const nameA = a.title.toLowerCase()
            const nameB = b.title.toLowerCase()
            if (nameA === "core") return -1
            if (nameB === "core") return 1
            return nameA.localeCompare(nameB)
        })

    return [{ title: "Plugins", path: "/plugins", children: sorted }]
}
