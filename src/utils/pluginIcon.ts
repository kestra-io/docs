import { $fetchApiTextCached } from "~/utils/fetch"
import { optimizeSvgIcon } from "~/utils/svgo"

export const pluginIconPath = (group: string) => `/plugins/icons/${group}`

export async function fetchPluginIcon(group: string): Promise<string> {
    // Memoized per build: ~86 icons are fetched across the orchestration pages,
    // and their cache keys digest the same payloads.
    return optimizeSvgIcon(await $fetchApiTextCached(pluginIconPath(group)), group)
}

const CACHE_TTL = 60 * 60 * 24 // 24 hours

export async function fetchPluginIconCached(
    cls: string,
    runtime: { env: ENV },
): Promise<string> {
    const kv = runtime.env.ICON_CACHE
    const cacheKey = `icon:${cls}`

    const cached = await kv?.get(cacheKey)
    if (cached) return cached

    const result = await fetchPluginIcon(cls)

    // Store with 24h TTL (in seconds)
    await kv?.put(cacheKey, result, { expirationTtl: CACHE_TTL })

    return result
}