import { $fetch } from "../fetch";

function colorFixedB64Icon(b64Icon: string) {
    return Buffer.from(Buffer.from(b64Icon, 'base64').toString('utf-8').replace(/currentColor/g, "#CAC5DA")).toString('base64');
}

export async function getIcon(pluginName: string, pluginType?: string, group?:string, subGroup?: string) {
    const originalIcons = await $fetch(`https://api.kestra.io/v1/plugins/${pluginName}/icons/subgroups`);
    const elementIcons = await $fetch(`https://api.kestra.io/v1/plugins/${pluginName}/icons`);

    const originalIconsAsString = Object.fromEntries((Object.entries(originalIcons) as Array<[string, {icon: string}]>)
        .map(([key, value]) => [key, colorFixedB64Icon(value.icon)]));
    const elementIconsAsString = Object.fromEntries((Object.entries(elementIcons) as Array<[string, {icon: string}]>)
        .map(([key, value]) => [key, colorFixedB64Icon(value.icon)]));

    const icons = {
        ...originalIconsAsString,
        ...elementIconsAsString
    }

    let icon;
    if (pluginType !== undefined) {
        icon = icons[pluginType];
        if (icon === undefined) {
            const filteredIcons = Object.entries(icons).filter(([key]) => pluginType?.includes(key))
            icon = filteredIcons.sort(([key1], [key2]) => key2.length - key1.length)?.[0]?.[1];
        }
    } else if (subGroup) {
        icon = icons[subGroup];
    } else if (group) {
        icon = icons[group];
    }

    return {
        pageIcon: icon ? `data:image/svg+xml;base64,${colorFixedB64Icon(icon)}` : undefined,
        icons
    };
}