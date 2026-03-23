import { API_URL } from "astro:env/client"
import { optimizeSvgIcon } from "~/utils/svgo"

const CACHE_TTL = 60 * 60 * 24 // 24 hours

export async function fetchPluginIcon(group: string): Promise<string> {
    const url = `${API_URL}/plugins/icons/${group}`
    const cacheKey = new Request(url)
    const cache =
        typeof caches !== "undefined" ? await caches.open("plugin-icons") : null

    if (cache) {
        const cached = await cache.match(cacheKey)
        if (cached) {
            return cached.text()
        }
    }

    const iconResponse = await fetch(url)

    if (!iconResponse.ok) {
        throw new Error("Failed to fetch icon", {
            cause: iconResponse.statusText,
        })
    }

    const icon = optimizeSvgIcon(await iconResponse.text(), group)

    if (cache) {
        await cache.put(
            cacheKey,
            new Response(icon, {
                headers: { "Cache-Control": `public, max-age=${CACHE_TTL}` },
            }),
        )
    }

    return icon
}
