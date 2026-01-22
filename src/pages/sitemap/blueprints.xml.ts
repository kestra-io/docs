export const prerender = false

import type { APIRoute } from "astro"
import { useBlueprintsList } from "~/composables/useBlueprintsList.ts"
import { sitemapResponse } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const data = (await useBlueprintsList({ page: 1, size: 9999 })) as {
        results: Blueprint[]
        total: number
    }

    const urls = data.results.map((r) => `https://kestra.io/blueprints/${r.id}`)

    return sitemapResponse(urls)
}