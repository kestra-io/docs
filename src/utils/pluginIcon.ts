import { $fetchApiTextCached } from "~/utils/fetch"
import { optimizeSvgIcon } from "~/utils/svgo"

export const pluginIconPath = (group: string) => `/plugins/icons/${group}`

// The API answers a class it doesn't know with this generic file outline
// instead of a 404.
const API_PLACEHOLDER_PATH = "M288 32H0v448h384V128l-96-96z"

// Logos of plugins the API doesn't publish, named after their group and taken
// from the plugin repositories. They only stand in while the API has none.
const localPluginLogos = import.meta.glob<string>(
    "../components/orchestrate/assets/plugins/*.svg",
    { query: "?raw", import: "default", eager: true },
)

function localPluginLogo(cls: string): string | undefined {
    const parts = cls.split(".")
    for (let i = parts.length; i > 0; i--) {
        const group = parts.slice(0, i).join(".")
        const key = Object.keys(localPluginLogos).find((k) =>
            k.endsWith(`/${group}.svg`),
        )
        if (key) return localPluginLogos[key]
    }
    return undefined
}

export async function fetchPluginIcon(group: string): Promise<string> {
    // Memoized per build: ~86 icons are fetched across the orchestration pages,
    // and their cache keys digest the same payloads.
    const svg = await $fetchApiTextCached(pluginIconPath(group))
    const icon = svg.includes(API_PLACEHOLDER_PATH)
        ? (localPluginLogo(group) ?? svg)
        : svg
    return optimizeSvgIcon(icon, group)
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
