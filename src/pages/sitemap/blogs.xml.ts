import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse, formatLastMod } from "~/utils/sitemap.ts"
import fs from "fs"
import path from "path"

export const GET: APIRoute = async () => {
    const allBlogPosts = await getCollection("blogs")
    const urls = allBlogPosts.map((content) => {
        const updatedField = (content.data as any).updated ?? (content.data as any).updatedAt ?? (content.data as any).date ?? null

        let lastmod = formatLastMod(updatedField)
        if (!lastmod && (content as any).filePath) {
            try {
                const fp = path.isAbsolute((content as any).filePath) ? (content as any).filePath : path.join(process.cwd(), (content as any).filePath)
                const stat = fs.statSync(fp)
                lastmod = formatLastMod(stat.mtime)
            } catch (e) {
                // ignore
            }
        }

        return {
            loc: `https://kestra.io/blogs/${content.id}`,
            lastmod,
        }
    })

    return sitemapResponse(urls)
}