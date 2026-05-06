import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse, formatLastMod, gitLastModified } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const allBlogPosts = await getCollection("docs")
    const urls = allBlogPosts.map((content) => {
        const page = content.id.replace("<index>", "")
        const updatedField = (content.data as any).updated ?? (content.data as any).updatedAt ?? null

        let lastmod = formatLastMod(updatedField)
        if (!lastmod && (content as any).filePath) {
            lastmod = formatLastMod(gitLastModified((content as any).filePath))
        }

        return {
            loc: `https://kestra.io/docs${page ? "/" + page : ""}`,
            lastmod,
        }
    })

    return sitemapResponse(urls)
}