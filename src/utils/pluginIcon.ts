import { API_URL } from "astro:env/client"
import { optimizeSvgIcon } from "~/utils/svgo"

const iconCache: Record<string, string> = {}

export async function fetchPluginIcon(group: string): Promise<string> {
    if (iconCache[group]) {
        return iconCache[group]
    }

    const iconResponse = await fetch(`${API_URL}/plugins/icons/${group}`)

    if (!iconResponse.ok) {
        throw new Error(`Failed to fetch icon "${group}"`, {
            cause: iconResponse.statusText,
        })
    }

    const icon = optimizeSvgIcon(await iconResponse.text(), group)
    iconCache[group] = icon

    return icon
}
