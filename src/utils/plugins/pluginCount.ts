import { $fetchApiCached } from "~/utils/fetch";
import type { Plugin } from "./plugin";
import { calculateTotalPlugins } from "~/composables/usePluginsCount";

const FETCH_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 500;

// Retries transient fetch failures (with a short growing backoff) before
// giving up: the count is rendered on ~30 pages, so a single network blip
// should not fail the whole build.
async function fetchWithRetry<T>(url: string): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt++) {
        try {
            return await $fetchApiCached<T>(url);
        } catch (e) {
            lastError = e;
            if (attempt < FETCH_ATTEMPTS) {
                await new Promise((resolve) =>
                    setTimeout(resolve, RETRY_BASE_DELAY_MS * attempt),
                );
            }
        }
    }
    throw lastError;
}

async function loadTotalPluginsCount(): Promise<string> {
    const pluginGroups = await fetchWithRetry<Plugin[]>("/plugins/subgroups");
    const count = calculateTotalPlugins(pluginGroups);
    const rounded = Math.floor(count / 100) * 100;
    return `${rounded}`;
}

let totalPluginsCountPromise: Promise<string> | undefined;

// Memoized at module level: dozens of pages render this count, and sharing one
// request keeps them all on the same value within a build. A failure is not
// cached (the next caller retries) and propagates instead of degrading to "0",
// so a build fails loudly rather than shipping "0+ Plugins" in copy and SEO
// markup.
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
