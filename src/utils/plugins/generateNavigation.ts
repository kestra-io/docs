import type { Plugin, PluginElement } from "@kestra-io/ui-libs"
import { isEntryAPluginElementPredicate, slugify, subGroupName } from "@kestra-io/ui-libs"

function toNavTitle(title: string) {
    let startCaseTitle = title.charAt(0).toUpperCase() + title.slice(1)
    if (title.match(/^[a-z]+[A-Z][a-z]/)) {
        startCaseTitle = title.replace(/[A-Z][a-z]/, (match) => " " + match)
    }
    return startCaseTitle
        .split(".")
        .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
        .join("")
}

function subGroupWrapperNav(subGroupWrapper: Plugin, parentUrl: string) {
    return Object.entries(subGroupWrapper)
        .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
        .map(([key, value]) => {
            return {
                title: toNavTitle(key),
                isPage: false,
                path: parentUrl + "#" + slugify(key),
                children: (value as PluginElement[])
                    .filter(({ deprecated }) => !deprecated)
                    .map((item) => ({
                        title: item.cls.substring(item.cls.lastIndexOf(".") + 1),
                        path: `${parentUrl}/${slugify(item.cls)}`,
                    })),
            }
        })
}

interface Navigation {
    title: string
    path: string
    children?: Navigation[] | undefined
    isPage?: boolean
}

export function generateNavigationFromSubgroups(pluginsSubGroups: Plugin[]): Navigation[] {
    const subGroupsByGroup = pluginsSubGroups.reduce(
        (result, subGroupWrapper) => {
            const filteredElementsByTypeEntries = Object.entries(subGroupWrapper)
                .filter(([key, value]) => isEntryAPluginElementPredicate(key, value))
                .map(([elementType, elements]) => [
                    elementType,
                    (elements as PluginElement[]).filter(({ deprecated }) => !deprecated),
                ])
                .filter(([, elements]) => elements.length > 0)

            if (filteredElementsByTypeEntries.length === 0) {
                return result
            }

            subGroupWrapper = Object.fromEntries([
                ...Object.entries(subGroupWrapper).filter(
                    ([key, value]) => !isEntryAPluginElementPredicate(key, value),
                ),
                ...filteredElementsByTypeEntries,
            ])

            if (!result[subGroupWrapper.group]) {
                result[subGroupWrapper.group] = []
            }
            result[subGroupWrapper.group].push(subGroupWrapper)
            return result
        },
        {} as Record<string, Plugin[]>,
    )
    let sortedPluginsHierarchy = Object.entries(subGroupsByGroup)
        .map(([_, subGroupsWrappers]) => {
            let plugin = subGroupsWrappers.find(
                (subGroupWrapper) => subGroupWrapper.subGroup === undefined,
            )!
            let rootPluginUrl = "/plugins/" + slugify(plugin.name)
            let pluginChildren
            if (subGroupsWrappers.length > 1) {
                pluginChildren = subGroupsWrappers
                    .filter((subGroupWrapper) => subGroupWrapper.subGroup !== undefined)
                    .map((subGroupWrapper) => {
                        const subGroupUrl = `${rootPluginUrl}/${slugify(subGroupName(subGroupWrapper))}`
                        return {
                            title: toNavTitle(subGroupWrapper.title),
                            path: subGroupUrl,
                            children: subGroupWrapperNav(subGroupWrapper, subGroupUrl),
                        }
                    })
            }
            // There is no subgroups, we skip that part and directly put plugin elements below
            else {
                pluginChildren = subGroupWrapperNav(subGroupsWrappers[0], rootPluginUrl)
            }
            return {
                title: toNavTitle(plugin.title),
                path: rootPluginUrl,
                children: pluginChildren,
            }
        })
        .sort((a, b) => {
            const nameA = a.title.toLowerCase(),
                nameB = b.title.toLowerCase()

            if (nameA === "core") {
                return -1
            }
            if (nameB === "core") {
                return 1
            }

            return nameA === nameB ? 0 : nameA < nameB ? -1 : 1
        })
    return [
        {
            title: "Plugins",
            path: "/plugins",
            children: sortedPluginsHierarchy,
        },
    ]
}