import { API_URL } from "astro:env/client"
import { optimizeSvgIcon } from "./svgo"

export async function getPluginIcon(pluginGroup: string) {
    const iconResponse = await fetch(`${API_URL}/plugins/icons/${pluginGroup}`)

    if (!iconResponse.ok) {
        throw new Error("Failed to fetch icon", {
            cause: iconResponse.statusText,
        })
    }

    return optimizeSvgIcon(await iconResponse.text(), pluginGroup)
}
