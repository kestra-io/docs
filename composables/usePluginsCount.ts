import type { Plugin, PluginElement } from "@kestra-io/ui-libs";
import { isEntryAPluginElementPredicate } from "@kestra-io/ui-libs";

function calculateTotalPlugins(plugins: Plugin[]): number {
    const classes = new Set<string>();

    plugins.forEach(plugin => {
        Object.entries(plugin).forEach(([key, elements]) => {
            if (isEntryAPluginElementPredicate(key, elements)) {
                elements.forEach((el: PluginElement) => classes.add(el.cls));
            }
        });
    });

    return classes.size;
}

export const usePluginsCount = () => {
    const { data: plugins, error, status } = useFetch<Plugin[]>(
        `${useRuntimeConfig().public.apiUrl}/plugins/subgroups`
    );

    const totalPlugins = computed(() => {
        if (!plugins.value) return "0+";
        const count = calculateTotalPlugins(plugins.value);
        const rounded = Math.floor(count / 100) * 100;
        return `${rounded}+`;
    });

    return { totalPlugins, plugins, error, status };
};