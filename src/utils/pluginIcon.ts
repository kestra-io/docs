import { API_URL } from "astro:env/client"
import { optimizeSvgIcon } from "~/utils/svgo"

export async function fetchPluginIcon(group: string): Promise<string> {
    const iconResponse = await fetch(
        `${API_URL}/plugins/icons/${group}`,
    )

    if (!iconResponse.ok) {
        throw new Error("Failed to fetch icon", {
            cause: iconResponse.statusText,
        })
    }

    const icon = optimizeSvgIcon(
        await iconResponse.text(),
        group,
    )

    return icon
}