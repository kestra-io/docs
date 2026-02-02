import { $fetchApi } from "~/utils/fetch"

function colorFixedB64Icon(b64Icon: string) {
    return Buffer.from(
        Buffer.from(b64Icon, "base64")
            .toString("utf-8")
            .replace(/currentColor/g, "#000000"),
    ).toString("base64")
}

export function getPluginIconsAsString(icons: Record<string, { icon: string }>) {
    return Object.fromEntries(
        (Object.entries(icons) as Array<[string, { icon: string }]>).map(([key, value]) => [
            key,
            colorFixedB64Icon(value.icon),
        ]),
    )
}

export async function getIcon(
    pluginName: string,
    pluginType?: string,
    group?: string,
    subGroup?: string,
) {
    const originalIcons = await $fetchApi(`/plugins/${pluginName}/icons/subgroups`)
    const elementIcons = await $fetchApi(`/plugins/${pluginName}/icons`)

    const originalIconsAsString = getPluginIconsAsString(originalIcons)
    const elementIconsAsString = getPluginIconsAsString(elementIcons)

    const icons = {
        ...originalIconsAsString,
        ...elementIconsAsString,
    }

    let icon
    if (pluginType !== undefined) {
        icon = icons[pluginType]
        if (icon === undefined) {
            const filteredIcons = Object.entries(icons).filter(([key]) => pluginType?.includes(key))
            icon = filteredIcons.sort(([key1], [key2]) => key2.length - key1.length)?.[0]?.[1]
        }
    } else if (subGroup) {
        icon = icons[subGroup]
    } else if (group) {
        icon = icons[group]
    }

    return {
        currentPageIcon: icon ? `data:image/svg+xml;base64,${colorFixedB64Icon(icon)}` : undefined,
        subGroupsIcons: icons,
    }
}