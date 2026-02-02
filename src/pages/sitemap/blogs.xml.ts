import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const allBlogPosts = await getCollection("blogs")
    const urls = allBlogPosts.map((content) => `https://kestra.io/blogs/${content.id}`)

    return sitemapResponse(urls)
}