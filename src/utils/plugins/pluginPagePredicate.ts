import { $fetchApiCachedOptional } from "~/utils/fetch"
import { filterPluginsWithoutDeprecated, type Plugin } from "./plugin"

/**
 * Whether `/plugins/<name>` renders a page. The metadata endpoint still lists
 * artifacts that have none: plugins whose every element is deprecated (e.g.
 * `plugin-notifications`, split into per-channel plugins) and artifacts with
 * no `/plugins` entry at all (e.g. `script`). The plugin router 301s both to
 * the /plugins index, so anything linking to them from that list produces a
 * redirected link. The rule is the router's own (`filterPluginsWithoutDeprecated`).
 *
 * An empty payload means the API failed: every name is then kept rather than
 * emptying the carousels.
 */
export function pluginPagePredicate(
    plugins: Plugin[],
): (name: string) => boolean {
    if (plugins.length === 0) return () => true
    const live = new Set(
        filterPluginsWithoutDeprecated(plugins).map((plugin) =>
            plugin.name?.toLowerCase(),
        ),
    )
    return (name) => live.has(name.toLowerCase())
}

export async function fetchPluginPagePredicate(): Promise<
    (name: string) => boolean
> {
    const plugins = await $fetchApiCachedOptional<Plugin[]>("/plugins")
    return pluginPagePredicate(plugins ?? [])
}
