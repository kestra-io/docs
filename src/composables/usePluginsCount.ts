import type { Plugin, PluginElement } from "@kestra-io/ui-libs"
import { isEntryAPluginElementPredicate } from "@kestra-io/ui-libs"
import { computed, ref, type Ref } from "vue"
import { API_URL } from "astro:env/client"

export function calculateTotalPlugins(plugins: Plugin[]): number {
    const classes = new Set<string>()

    plugins.forEach((plugin) => {
        Object.entries(plugin).forEach(([key, elements]) => {
            if (isEntryAPluginElementPredicate(key, elements)) {
                elements.forEach((el: PluginElement) => classes.add(el.cls))
            }
        })
    })

    return classes.size
}

export function usePluginsCount(pluginsRef?: Ref<Plugin[]>) {
    let plugins = pluginsRef
    const status = ref<string>("")
    if (!plugins) {
        plugins = ref<Plugin[]>([])
        // Fetch plugins data if not available
        fetch(`${API_URL}/plugins/subgroups`)
            .then((r) => {
                status.value = r.status === 200 ? "success" : "error"
                return r.json()
            })
            .then((data) => {
                if (plugins) {
                    plugins.value = data as unknown as Plugin[]
                }
            })
    }

    const totalPlugins = computed(() => {
        if (!plugins.value) return "0+"
        const count = calculateTotalPlugins(plugins.value)
        const rounded = Math.floor(count / 100) * 100
        return `${rounded}+`
    })

    return { totalPlugins, plugins }
}