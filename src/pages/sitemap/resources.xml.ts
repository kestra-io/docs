import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { resourceTabs, ALL_RESOURCES } from "~/components/resources/tags"
import { sitemapResponse, formatLastMod, gitLastModified } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const pageEntries = Object.entries(
        import.meta.glob<{ url?: string }>("../resources/**/*.astro", { eager: true }),
    )

    const pageUrls = pageEntries
        .filter(([_, mod]) => mod.url && mod.url.indexOf("[") === -1)
        .map(([globPath, mod]) => {
            const filePath = globPath.replace(/^\.\.\//, "src/pages/")
            return {
                loc: `https://kestra.io${mod.url}`,
                lastmod: formatLastMod(gitLastModified(filePath)),
            }
        })

    const tagUrls = Array.from(resourceTabs.keys())
        .filter((tag) => tag !== ALL_RESOURCES)
        .map((tag) => ({ loc: `https://kestra.io/resources/${tag}` }))

    const articles = await getCollection("resources")

    const articleUrls = articles
        .filter((post) => !post.data.href)
        .map((post) => {
            let lastmod = formatLastMod((post.data as any).date ?? null)
            if (!lastmod && (post as any).filePath) {
                lastmod = formatLastMod(gitLastModified((post as any).filePath))
            }
            return {
                loc: `https://kestra.io/resources/${post.data.tag}/${post.id.toLowerCase()}`,
                lastmod,
            }
        })

    return sitemapResponse([...pageUrls, ...tagUrls, ...articleUrls])
}
