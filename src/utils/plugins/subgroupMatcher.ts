import { subGroupName, type Plugin } from "./plugin"
import { slugify } from "../slugify"

export const matchesSubGroup = (plugin: Plugin | any, subGroup?: string): boolean => {
    if (!subGroup) return true
    const segment = plugin.subGroup?.split(".").pop()
    return [
        slugify(subGroupName(plugin)),
        segment,
        slugify(segment ?? ""),
    ].includes(subGroup)
}
