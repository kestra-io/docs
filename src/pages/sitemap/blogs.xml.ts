import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse, formatLastMod, gitLastModified } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const allBlogPosts = await getCollection("blogs")
    const urls = allBlogPosts.map((content) => {
        const updatedField = content.data.updated

        let lastmod = formatLastMod(updatedField)
        if (!lastmod && content.filePath) {
            lastmod = formatLastMod(gitLastModified(content.filePath))
        }

        return {
            loc: `https://kestra.io/blogs/${content.id}`,
            lastmod,
        }
    })

    return sitemapResponse(urls)
}