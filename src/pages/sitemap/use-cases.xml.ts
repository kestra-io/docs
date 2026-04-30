import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const allUseCases = await getCollection("customerStories")

    const urls = allUseCases.map(
        (story) =>
            `https://kestra.io/use-cases/stories/${story.data.slug}`,
    )

    return sitemapResponse(urls)
}
