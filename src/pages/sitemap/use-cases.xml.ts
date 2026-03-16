export const prerender = false

import { slugify } from "@kestra-io/ui-libs"
import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const allStories = await getCollection("customerStories")

    const urls = allStories.map(
        (story) =>
            `https://kestra.io/use-cases/stories/${story.id}-${slugify(story.data.title)}`,
    )

    return sitemapResponse(urls)
}
