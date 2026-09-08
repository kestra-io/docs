import { $fetchApiCachedWithRetry } from "~/utils/fetch";
import { isEntryAPluginElementPredicate, type Plugin, type PluginElement } from "./plugin";

// Distinct task/trigger/... classes across all plugin groups. A class listed in
// several groups counts once.
export function calculateTotalPlugins(plugins: Plugin[]): number {
    const classes = new Set<string>();
    plugins.forEach((plugin) => {
        Object.entries(plugin).forEach(([key, elements]) => {
            if (isEntryAPluginElementPredicate(key, elements)) {
                elements.forEach((el: PluginElement) => classes.add(el.cls));
            }
        });
    });
    return classes.size;
}

const pluginCountFormatter = new Intl.NumberFormat("en-US");

// The one rounding/format rule for the marketing plugin total: floored to the
// hundred with a thousands separator and no trailing "+" (1949 -> "1,900").
export function formatPluginCount(count: number): string {
    return pluginCountFormatter.format(Math.floor(count / 100) * 100);
}

async function loadTotalPluginsCount(): Promise<string> {
    const pluginGroups = await $fetchApiCachedWithRetry<Plugin[]>("/plugins/subgroups");
    return formatPluginCount(calculateTotalPlugins(pluginGroups));
}

let totalPluginsCountPromise: Promise<string> | undefined;

// Build-time plugin total, floored to the hundred and formatted for display
// without the trailing "+" (e.g. "1,900"); callers append it.
// Memoized so every page shares one request; a failure is not cached and
// propagates rather than degrading to "0", so a build fails loudly instead.
export function fetchTotalPluginsCount(): Promise<string> {
    if (!totalPluginsCountPromise) {
        totalPluginsCountPromise = loadTotalPluginsCount().catch((e) => {
            totalPluginsCountPromise = undefined;
            console.error("Failed to fetch plugins count:", e);
            throw e;
        });
    }
    return totalPluginsCountPromise;
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
    // Only plain objects are walked: a Date or other class instance has no
    // enumerable entries and would otherwise silently collapse to {}.
    if (value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
        return Object.fromEntries(
            Object.entries(value).map(([key, entry]) => [
                key,
                replaceTotalPluginsPlaceholder(entry, totalPlugins),
            ]),
        ) as T;
    }
    return value;
}
