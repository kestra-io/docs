export const prerender = false

import type { APIRoute } from "astro"
import { useBlueprintsList } from "~/composables/useBlueprintsList.ts"
import { sitemapResponse, formatLastMod } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const data = (await useBlueprintsList({ page: 1, size: 9999 })) as {
        results: Blueprint[]
        total: number
    }

    const urls = data.results.map((r) => ({ loc: `https://kestra.io/blueprints/${r.id}`, lastmod: formatLastMod(r.updatedAt) }))

    return sitemapResponse(urls)
}