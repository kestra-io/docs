import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { sitemapResponse, formatLastMod, gitLastModified } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const pageEntries = Object.entries(
        import.meta.glob<{ url?: string }>("../orchestration/**/*.astro", { eager: true }),
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

    const integrations = await getCollection("orchestration")

    const integrationUrls = integrations.map((entry) => ({
        loc: `https://kestra.io/orchestration/${entry.id}`,
        lastmod: formatLastMod(gitLastModified((entry as any).filePath)),
    }))

    return sitemapResponse([...pageUrls, ...integrationUrls])
}
