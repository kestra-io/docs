import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const allBlogPosts = await getCollection("docs")
    const urls = allBlogPosts.map(
        (content) => {
            const page = content.id.replace("<index>", "")

            return `https://kestra.io/docs${page ? "/" + page : ""}`
        },
    )

    return sitemapResponse(urls)
}