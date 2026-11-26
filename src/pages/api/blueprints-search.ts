import type { APIRoute } from "astro"
import { $fetchApiCached } from "~/utils/fetch"
import type { BlueprintEntry } from "~/utils/search/blueprints"
import { PLUGIN_PACKAGE } from "~/utils/search/matching"

export const prerender = false

type BlueprintsPage = {
    total?: number
    results?: {
        id: string
        title: string
        shortDescription?: string
        tags?: string[]
        includedTasks?: string[]
    }[]
}

export const GET: APIRoute = async () => {
    const { total = 0 } = await $fetchApiCached<BlueprintsPage>(
        "/blueprints/versions/latest?page=1&size=1",
    )
    // The API repeats rows across pages, so everything is read in one page.
    const { results = [] } = await $fetchApiCached<BlueprintsPage>(
        `/blueprints/versions/latest?page=1&size=${Math.max(total, 1)}`,
    )

    const entries: BlueprintEntry[] = results.map((blueprint) => ({
        id: blueprint.id,
        title: blueprint.title,
        description: blueprint.shortDescription ?? "",
        tags: blueprint.tags ?? [],
        tasks: (blueprint.includedTasks ?? []).map((cls) =>
            cls.replace(PLUGIN_PACKAGE, ""),
        ),
    }))

    return new Response(JSON.stringify(entries), {
        headers: { "Content-Type": "application/json" },
    })
}
