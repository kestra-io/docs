import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
	const allBlogPosts = await getCollection("docs")
	const urls = allBlogPosts.map((content) => `https://kestra.io/docs/${content.id}`)

	return sitemapResponse(urls)
}