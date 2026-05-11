import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { slugify } from "@kestra-io/ui-libs"
import { sitemapResponse, formatLastMod, gitLastModified } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const pageEntries = Object.entries(
        import.meta.glob<{ url?: string }>("../use-cases/**/*.astro", { eager: true }),
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

    const allUseCases = await getCollection("customerStories")

    const storyUrls = allUseCases.map((story) => {
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

    return sitemapResponse([...pageUrls, ...storyUrls])
}
