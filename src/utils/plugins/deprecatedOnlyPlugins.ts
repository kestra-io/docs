import { $fetchApiCachedOptional } from "~/utils/fetch"
import { isEntryAPluginElementPredicate, type Plugin } from "./plugin"

/**
 * Names of plugins whose every element is deprecated. The metadata endpoint
 * still lists them (e.g. `plugin-notifications`, split into per-channel
 * plugins), but their page has nothing left to render and the plugin router
 * 301s it to the /plugins index — so anything linking to `/plugins/<name>`
 * from that list produces a redirected link.
 */
export function collectDeprecatedOnlyPlugins(plugins: Plugin[]): Set<string> {
    const total = new Map<string, number>()
    const live = new Map<string, number>()
    for (const plugin of plugins) {
        const name = plugin.name?.toLowerCase()
        if (!name) continue
        for (const [key, value] of Object.entries(plugin)) {
            if (!isEntryAPluginElementPredicate(key, value)) continue
            total.set(name, (total.get(name) ?? 0) + value.length)
            live.set(
                name,
                (live.get(name) ?? 0) + value.filter((element) => !element.deprecated).length,
            )
        }
    }
    return new Set(
        [...total.entries()]
            .filter(([name, count]) => count > 0 && (live.get(name) ?? 0) === 0)
            .map(([name]) => name),
    )
}

export async function fetchDeprecatedOnlyPlugins(): Promise<Set<string>> {
    const plugins = await $fetchApiCachedOptional<Plugin[]>("/plugins")
    return collectDeprecatedOnlyPlugins(plugins ?? [])
}
