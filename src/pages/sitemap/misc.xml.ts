import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse, formatLastMod } from "~/utils/sitemap.ts"
import fs from "fs"
import path from "path"

export const GET: APIRoute = async () => {
    const pages = await getCollection("legal")
    const urls = pages.map((content) => {
        const updatedField = (content.data as any).updated ?? (content.data as any).updatedAt ?? null
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

        return { loc: `https://kestra.io/${content.id}`, lastmod }
    })

    return sitemapResponse(urls)
}