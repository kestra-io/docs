import { slugify, subGroupName, type Plugin } from "@kestra-io/ui-libs"

export const matchesSubGroup = (plugin: Plugin | any, subGroup?: string): boolean => {
    if (!subGroup) return true
    const segment = plugin.subGroup?.split(".").pop()
    return [
        slugify(subGroupName(plugin)),
        segment,
        slugify(segment ?? ""),
    ].includes(subGroup)
}
