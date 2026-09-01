import { $fetchApiCached } from "~/utils/fetch"
import type { Plugin } from "~/utils/plugins/plugin"
import {
    buildPluginUrlIndex,
    canonicalPluginUrl,
} from "~/utils/plugins/canonicalUrl"

/**
 * Canonical plugin URL for each of the given classes.
 *
 * Classes the payload does not know — a legacy name kept in a plugin's `aliases`, or a
 * task whose plugin was removed — are left out, so callers keep whatever fallback they
 * had for them. Same for a plugin API failure, which yields an empty map rather than
 * taking the page down.
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
    const urls: Record<string, string> = {}

    for (const cls of new Set(classes)) {
        const url = canonicalPluginUrl(cls, index)
        if (url) urls[cls] = url
    }

    return urls
}
