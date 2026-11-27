import type { PluginSearchCard } from "~/utils/search/plugins"

export const pluginCard = (
    title: string,
    extra: Partial<PluginSearchCard> = {},
): PluginSearchCard => ({
    name: "plugin-aws",
    title,
    group: "io.kestra.plugin.aws",
    ...extra,
})
