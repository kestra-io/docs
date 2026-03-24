import { API_URL } from "astro:env/client"
import { optimizeSvgIcon } from "~/utils/svgo"

export async function fetchPluginIcon(group: string): Promise<string> {

    const iconResponse = await fetch(`${API_URL}/plugins/icons/${group}`)

    if (!iconResponse.ok) {
        throw new Error(`Failed to fetch icon "${group}"`, {
            cause: iconResponse.statusText,
        })
    }

    const icon = optimizeSvgIcon(await iconResponse.text(), group)

    return icon
}

const CACHE_TTL = 60 * 60 * 24 // 24 hours

export async function fetchPluginIconCached(
    cls: string,
    runtime: App.Locals["runtime"],
): Promise<string> {
    const kv = runtime.env.ICON_CACHE as KVNamespace
    const cacheKey = `icon:${cls}`

    const cached = await kv?.get(cacheKey)
    if (cached) return cached

    const result = await fetchPluginIcon(cls)

    // Store with 24h TTL (in seconds)
    await kv?.put(cacheKey, result, { expirationTtl: CACHE_TTL })

    return result
}
