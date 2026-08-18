import { getBlueprintCountRounded } from "~/data/counts"

/**
 * Blueprint count floored to the ten, without the trailing "+", e.g. "480".
 *
 * This used to return a zero when the fetch failed, which rendered the hero
 * headline with a zeroed count — the same failure mode as the plugin count.
 * It now falls back to the committed value in ~/data/counts.
 */
export async function fetchTotalBlueprintsCount(): Promise<string> {
    return await getBlueprintCountRounded()
}
