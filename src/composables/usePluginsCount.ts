import type { Plugin } from "~/utils/plugins/plugin"
import { computed, ref, type Ref } from "vue"
import { $fetchApiCached } from "~/utils/fetch.ts"
import { calculateTotalPlugins, formatPluginCount } from "~/utils/plugins/pluginCount"

// Client-side counterpart of fetchTotalPluginsCount: same counting and format
// rule, but returns the value *with* the trailing "+" and starts at "0+" until loaded.
export function usePluginsCount(pluginsRef?: Ref<Plugin[]>) {
    let plugins = pluginsRef
    if (!plugins) {
        plugins = ref<Plugin[]>([])
        // Fetch plugins data if not available
        $fetchApiCached(`/plugins/subgroups`).then((data) => {
            if (plugins) {
                plugins.value = data as unknown as Plugin[]
            }
        })
    }

    const totalPlugins = computed(() => {
        if (!plugins.value) return "0+"
        return `${formatPluginCount(calculateTotalPlugins(plugins.value))}+`
    })

    return { totalPlugins, plugins }
}
