import { slugify } from "@kestra-io/ui-libs"
import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse, formatLastMod } from "~/utils/sitemap.ts"
import fs from "fs"
import path from "path"

export const GET: APIRoute = async () => {
    const allUseCases = await getCollection("customerStories")

    const urls = allUseCases.map((story) => {
        const updatedField = (story.data as any).updated ?? (story.data as any).updatedAt ?? null
        let lastmod = formatLastMod(updatedField)
        if (!lastmod && (story as any).filePath) {
            try {
                const fp = path.isAbsolute((story as any).filePath) ? (story as any).filePath : path.join(process.cwd(), (story as any).filePath)
                const stat = fs.statSync(fp)
                lastmod = formatLastMod(stat.mtime)
            } catch (e) {
                // ignore
            }
        }

        return {
            loc: `https://kestra.io/use-cases/stories/${story.id}-${slugify(story.data.title ?? "--")}`,
            lastmod,
        }
    })

    return sitemapResponse(urls)
}
