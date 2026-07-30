import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse, formatLastMod, gitLastModified } from "~/utils/sitemap.ts"

/**
 * Legal pages declare their own robots directive with a `<meta>` tag in the
 * markdown body (data-processing-agreement, enterprise-license-agreement,
 * kestra-cloud-tos, master-software-licence-agreement). Read it back rather than
 * keeping a second list here, so a page and its sitemap entry can't disagree.
 */
const isNoindex = (body?: string) =>
    /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(body ?? "")

export const GET: APIRoute = async () => {
    const pages = await getCollection("legal")
    const urls = pages.filter((content) => !isNoindex(content.body)).map((content) => {
        const updatedField = (content.data as any).updated ?? (content.data as any).updatedAt ?? null
        let lastmod = formatLastMod(updatedField)
        if (!lastmod && (content as any).filePath) {
            lastmod = formatLastMod(gitLastModified((content as any).filePath))
        }

        return { loc: `https://kestra.io/${content.id}`, lastmod }
    })

    return sitemapResponse(urls)
}