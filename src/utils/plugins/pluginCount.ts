import { $fetchApiCached } from "~/utils/fetch";
import type { Plugin } from "./plugin";
import { calculateTotalPlugins } from "~/composables/usePluginsCount";

export async function fetchTotalPluginsCount(): Promise<string> {
    try {
        const pluginGroups = await $fetchApiCached<Plugin[]>("/plugins/subgroups");
        const count = calculateTotalPlugins(pluginGroups);
        const rounded = Math.floor(count / 100) * 100;
        return `${rounded}`;
    } catch (e) {
        console.error("Failed to fetch plugins count:", e);
        return "0";
    }
}

const TOTAL_PLUGINS_PLACEHOLDER = "{totalPlugins}";

// Deep-replaces the {totalPlugins} placeholder in content data (e.g. the vs
// collection YAML) so authored copy always reflects the live plugin count.
export function replaceTotalPluginsPlaceholder<T>(value: T, totalPlugins: string): T {
    if (typeof value === "string") {
        return value.replaceAll(TOTAL_PLUGINS_PLACEHOLDER, totalPlugins) as T;
    }
    if (Array.isArray(value)) {
        return value.map((item) => replaceTotalPluginsPlaceholder(item, totalPlugins)) as T;
    }
    if (value !== null && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, entry]) => [
                key,
                replaceTotalPluginsPlaceholder(entry, totalPlugins),
            ]),
        ) as T;
    }
    return value;
}
