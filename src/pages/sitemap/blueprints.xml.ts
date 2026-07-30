export const prerender = false

import type { APIRoute } from "astro"
import { useBlueprintsList } from "~/composables/useBlueprintsList.ts"
import { CATEGORY_TILE_META } from "~/utils/blueprints/categoryMeta"
import { sitemapResponse, formatLastMod } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const data = (await useBlueprintsList({ page: 1, size: 9999 })) as {
        results: Blueprint[]
        total: number
    }

    // Category listings served by src/pages/blueprints/[id].astro. It treats
    // every tile slug as a category except "Getting Started", which falls
    // through to the blueprint lookup and has no category page of its own.
    const categoryUrls = CATEGORY_TILE_META.filter(
        (category) => category.name !== "Getting Started",
    ).map((category) => ({ loc: `https://kestra.io/blueprints/${category.slug}` }))

    const urls = data.results.map((r) => ({ loc: `https://kestra.io/blueprints/${r.id}`, lastmod: formatLastMod(r.updatedAt) }))

    return sitemapResponse([...categoryUrls, ...urls])
}