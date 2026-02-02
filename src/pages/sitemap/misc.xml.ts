import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const pages = await getCollection("legal")
    const urls = pages.map((content) => `https://kestra.io/${content.id}`)

    return sitemapResponse(urls)
}