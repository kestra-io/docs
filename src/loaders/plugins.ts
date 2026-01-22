import type { Loader } from "astro/loaders"
import { $fetchApi } from "~/utils/fetch"
import type { Plugin } from "@kestra-io/ui-libs"
import { z } from "astro:content"

export default {
    name: "plugins",
    async load({ store }) {
        const plugins = await $fetchApi<Plugin[]>("/plugins/subgroups")
        store.clear()
        for (const plugin of plugins) {
            const id = plugin.subGroup ?? plugin.group
            store.set({
                id,
                data: plugin,
            })
        }
    },
    schema: z.object({
        name: z.string(),
        title: z.string(),
        group: z.string(),
        longDescription: z.string().optional(),
        description: z.string().optional(),
        subGroup: z.string().optional(),
        tooltipContent: z.string().optional(),
        categories: z.array(z.string()).optional(),
        controllers: z.array(z.string()).optional(),
        storages: z.array(z.string()).optional(),
        aliases: z.array(z.string()).optional(),
        guides: z.array(z.string()).optional(),
    }),
} satisfies Loader