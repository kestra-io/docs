import { $fetchApiCached } from "~/utils/fetch";
import type { Plugin } from "./plugin";
import { calculateTotalPlugins } from "~/composables/usePluginsCount";

// Every page that shows a plugin count is prerendered, so a blip on
// /plugins/subgroups must degrade rather than abort the build.
export async function fetchTotalPluginsCount(): Promise<number> {
    try {
        const pluginGroups =
            await $fetchApiCached<Plugin[]>("/plugins/subgroups");
        return Math.floor(calculateTotalPlugins(pluginGroups) / 100) * 100;
    } catch (e) {
        console.error("Failed to fetch plugins count:", e);
        return 0;
    }
}
