import { getPluginCountRounded } from "~/data/counts"

/**
 * Plugin count floored to the hundred, without the trailing "+", e.g. "1900".
 * Call sites add the "+" themselves.
 *
 * Kept as a thin wrapper so existing pages keep working; the fetch, the
 * fallback and the build-time assertion all live in ~/data/counts.
 */
export async function fetchTotalPluginsCount(): Promise<string> {
    return await getPluginCountRounded()
}
