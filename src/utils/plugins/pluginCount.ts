import { $fetchApi } from "~/utils/fetch";
import type { Plugin } from "@kestra-io/ui-libs";
import { calculateTotalPlugins } from "~/composables/usePluginsCount";

export async function fetchTotalPluginsCount(): Promise<string> {
    try {
        const pluginGroups = await $fetchApi<Plugin[]>("/plugins/subgroups");
        const count = calculateTotalPlugins(pluginGroups);
        const rounded = Math.floor(count / 100) * 100;
        return `${rounded}`;
    } catch (e) {
        console.error("Failed to fetch plugins count:", e);
        return "0";
    }
}
