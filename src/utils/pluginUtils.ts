import type { Plugin } from "@kestra-io/ui-libs"

/**
 * Format element type string by adding spaces between camelCase words and capitalizing each word. e.g. "storageVolumes" -> "Storage Volumes"
 */
export const formatElementType = (type: string): string => {
    return type
        .replaceAll(/[A-Z]/g, (match) => ` ${match}`)
        .trim()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}

/**
 * Extract the class name. Example: "io.kestra.core.tasks.flows.Flow" -> "Flow"
 */
export const formatElementName = (cls: string): string => {
    return cls.substring(cls.lastIndexOf(".") + 1)
}

/**
 * Transform title by adding zero-width space before uppercase letters and removing emojis.
 */
export const transformTitle = (text: string): string => {
    return text
        .replace(/([A-Z])/g, "&#x200B;$1")
        .replace(
            /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
            "",
        )
}

/**
 * Format plugin name for display by extracting the last segment, stripping prefixes, and capitalizing words.
 */
export const formatPluginName = (raw?: string): string => {
    if (!raw) return ""
    const part = raw.split(".").pop() ?? raw
    const words = part
        .replace(/^plugins?[-_]/i, "")
        .split(/[-_]/)
        .filter(Boolean)
    if (words.length === 0) return ""
    if (words.length === 1) {
        const w = words[0]!
        return /^[a-z0-9]{1,3}$/i.test(w) || /\d/.test(w)
            ? w.toUpperCase()
            : w.charAt(0).toUpperCase() + w.slice(1)
    }
    return words.map((w) => w!.charAt(0).toUpperCase() + w!.slice(1)).join(" ")
}

export const formatCategoryName = (category: string): string => {
    const DONT_CAPITALIZE = ["AI", "BI"]
    return DONT_CAPITALIZE.includes(category) ? category : formatPluginName(category.toLowerCase())
}

export const capitalize = (str: string): string =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : ""

export const getPluginTitle = (plugin: Plugin, metadataMap: any): string => {
    const key = plugin?.subGroup ?? plugin?.group
    const title = metadataMap?.[key]?.title ?? plugin?.title ?? ""
    return capitalize(title.replace(/\s*\(EE\)\s*$/i, ""))
}

/**
 * Get the Title and ID for related Blueprints Heading.
 */
export function getBlueprintsHeading(
    pluginName: string,
    pluginWrapper?: Plugin,
    subGroupName?: string,
    pluginType?: string,
    customId?: string | null,
): { text: string; id: string } {
    const formattedPluginName = formatPluginName(pluginWrapper?.group ?? pluginName)

    let text: string

    if (pluginType) {
        text = `Create automations with ${formattedPluginName} ${formatPluginName(subGroupName)} ${formatElementName(pluginType)?.charAt(0).toUpperCase() + formatElementName(pluginType)?.slice(1)}`
    } else if (subGroupName) {
        text = `Create automations with ${formattedPluginName} ${formatPluginName(subGroupName)}`
    } else {
        text = `Create automations with ${formatPluginName(pluginWrapper?.group ?? pluginName)} Plugins`
    }

    const id =
        customId ||
        `create-with-${text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")}`

    return { text, id }
}