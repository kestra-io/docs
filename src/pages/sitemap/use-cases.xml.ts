export const prerender = false

import { slugify } from "@kestra-io/ui-libs"
import type { APIRoute } from "astro"
import { $fetchApi } from "~/utils/fetch.ts"
import { sitemapResponse } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const data = await $fetchApi<{
        results: Array<{ id: string; title?: string }>
        total: number
    }>("/customer-stories-v2?size=9999")

    const urls = data.results.map(
        (story) =>
            `https://kestra.io/use-cases/stories/${story.id}-${slugify(story.title ?? "--")}`,
    )

    return sitemapResponse(urls)
}