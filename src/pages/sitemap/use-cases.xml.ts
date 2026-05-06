import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { slugify } from "@kestra-io/ui-libs"
import { sitemapResponse, formatLastMod, gitLastModified } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const allUseCases = await getCollection("customerStories")

    const urls = allUseCases.map((story) => {
        const updatedField = (story.data as any).updated ?? (story.data as any).updatedAt ?? null
        let lastmod = formatLastMod(updatedField)
        if (!lastmod && (story as any).filePath) {
            lastmod = formatLastMod(gitLastModified((story as any).filePath))
        }

        return {
            loc: `https://kestra.io/use-cases/stories/${story.id}-${slugify(story.data.title ?? "--")}`,
            lastmod,
        }
    })

    return sitemapResponse(urls)
}
