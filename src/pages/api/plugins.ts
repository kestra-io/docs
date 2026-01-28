import { $fetchApi } from "../../utils/fetch"
import type { Plugin } from "@kestra-io/ui-libs"
import { prunePlugins, pruneAllPluginsData } from "../../utils/plugins/pruning"

export const prerender = false

let cachedData: any = null;
let cacheExpiry = 0;

export async function GET() {
    if (cachedData && cacheExpiry > Date.now()) {
        return new Response(JSON.stringify(cachedData), {
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "max-age=1800",
            },
        })
    }

    const plugins = await $fetchApi<Plugin[]>(`/plugins/subgroups`)
    const pluginsData = await $fetchApi(`/plugins/pluginsInformation`)

    const prunedPlugins = prunePlugins(plugins)
    const prunedPluginsData = pruneAllPluginsData(pluginsData)

    cachedData = { plugins: prunedPlugins, pluginsData: prunedPluginsData };
    cacheExpiry = Date.now() + 1800 * 1000;

    return new Response(JSON.stringify(cachedData), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "max-age=1800",
        },
    })
}
