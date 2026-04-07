import type { Plugin } from "@kestra-io/ui-libs"

// "storageVolumes" -> "Storage Volumes"
export const formatElementType = (type: string): string =>
    type
        .replaceAll(/[A-Z]/g, (m) => ` ${m}`)
        .trim()
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")

// "io.kestra.core.tasks.flows.Flow" -> "Flow"
export const formatElementName = (cls: string): string =>
    cls.substring(cls.lastIndexOf(".") + 1)

// Extract last segment, strip plugin prefix, capitalize words. e.g. "plugin-aws-s3" -> "Aws S3"
export const formatPluginName = (raw?: string): string => {
    if (!raw) return ""
    const words = (raw.split(".").pop() ?? raw)
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
    return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

const PRESERVE_CASE = ["AI", "BI"]
export const formatCategoryName = (category: string): string =>
    PRESERVE_CASE.includes(category) ? category : formatPluginName(category.toLowerCase())

export const capitalize = (str: string): string =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : ""

export const getPluginTitle = (plugin: Plugin, metadataMap: any): string => {
    const key = plugin?.subGroup ?? plugin?.group
    const title = metadataMap?.[key]?.title ?? plugin?.title ?? ""
    return capitalize(title.replace(/\s*\(EE\)\s*$/i, ""))
}

const highlight = (content: string) =>
    `<span style="color: var(--ks-content-color-highlight)">${content}</span>`

export function getBlueprintsHeading(
    pluginName: string,
    pluginWrapper?: Plugin,
    subGroupName?: string,
    customId?: string | null,
): { text: string; html: string; id: string } {
    const base = formatPluginName(pluginWrapper?.group ?? pluginName)
    const dynamic = subGroupName ? `${base} ${formatPluginName(subGroupName)}` : base
    const suffix = subGroupName ? "" : " Plugins"

    const text = `Create automations with ${dynamic}${suffix}`
    const html = `Create automations with ${highlight(dynamic)}${suffix}`
    const id =
        customId ||
        `create-with-${text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")}`

    return { text, html, id }
}

