import { $fetch } from "../fetch";

export async function getIcon(pluginType?: string, group?:string, subGroup?: string) {
    const originalIcons = await $fetch(`https://api.kestra.io/v1/plugins/${pluginType}/icons/subgroups`);
    const elementIcons = await $fetch(`https://api.kestra.io/v1/plugins/${pluginType}/icons`);
    const icons = {...originalIcons, ...elementIcons}
    let icon;
    if (pluginType !== undefined) {
        icon = icons[pluginType];
        if (icon === undefined) {
            icon = Object.entries(icons).filter(([key]) => pluginType?.includes(key))
                .sort(([key1], [key2]) => key2.length - key1.length)?.[0]?.[1];
        }
    } else if (subGroup === undefined && group) {
        icon = icons[group];
    } else if(subGroup) {
        icon = icons[subGroup];
    }

    return {
        pageIcon: `data:image/svg+xml;base64,${icon}`,
        icons
    };
}