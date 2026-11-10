import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse, formatLastMod, gitLastModified } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const comparisons = await getCollection("vs")

    const urls = comparisons.map((entry) => ({
        loc: `https://kestra.io/vs/${entry.id}`,
        lastmod: formatLastMod(gitLastModified((entry as any).filePath)),
    }))

    return sitemapResponse(urls)
}
