import { $fetchApiCached } from "~/utils/fetch"
import type { Plugin } from "~/utils/plugins/plugin"
import { getAliasMapping } from "~/utils/plugins/aliasMapping"
import {
    buildPluginUrlIndex,
    canonicalPluginUrl,
} from "~/utils/plugins/canonicalUrl"

/**
 * Canonical plugin URL for each of the given classes.
 *
 * A legacy name kept in a plugin's `aliases` (`io.kestra.plugin.docker.Build`) resolves
 * to its current class, as the plugin router does when it redirects it. Classes the
 * payload does not know at all — a task whose plugin was removed — are left out, so
 * callers keep whatever fallback they had for them. Same for a plugin API failure,
 * which yields an empty map rather than taking the page down.
 */
export async function buildTaskUrls(
    classes: string[] = [],
): Promise<Record<string, string>> {
    if (classes.length === 0) return {}

    let plugins: Plugin[] = []
    try {
        plugins = await $fetchApiCached<Plugin[]>("/plugins/subgroups")
    } catch {
        return {}
    }

    const index = buildPluginUrlIndex(plugins)
    const aliases = getAliasMapping(plugins)
    const urls: Record<string, string> = {}

    for (const cls of new Set(classes)) {
        const url =
            canonicalPluginUrl(cls, index) ??
            canonicalPluginUrl(aliases[cls.toLowerCase()] ?? "", index)
        if (url) urls[cls] = url
    }

    return urls
}
