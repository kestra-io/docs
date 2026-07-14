import { $fetchApiCached } from "~/utils/fetch"

export async function fetchTotalBlueprintsCount(): Promise<string> {
    try {
        const { total = 0 } = await $fetchApiCached<{ total: number }>(
            "/blueprints/versions/latest?size=1&page=1",
        )
        const rounded = Math.floor(total / 10) * 10
        return `${rounded}`
    } catch (e) {
        console.error("Failed to fetch blueprints count:", e)
        return "0"
    }
}
