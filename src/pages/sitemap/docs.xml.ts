import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { fetchMajorReleases } from "~/utils/fetchChangelogVersions.ts"
import { sitemapResponse, formatLastMod, gitLastModified } from "~/utils/sitemap.ts"

// Same limit as the getStaticPaths in src/pages/docs/changelog/[tag].astro, so
// the sitemap lists exactly the release pages that get built.
const CHANGELOG_RELEASES = 150

export const GET: APIRoute = async () => {
    const releases = await fetchMajorReleases(CHANGELOG_RELEASES)

    const changelogUrls = releases.map((release) => ({
        loc: `https://kestra.io/docs/changelog/${release.tag_name}`,
        lastmod: formatLastMod(release.published_at),
    }))

    const allBlogPosts = await getCollection("docs")
    const urls = allBlogPosts.map((content) => {
        const page = content.id.replace("<index>", "")
        const updatedField = (content.data as any).updated ?? (content.data as any).updatedAt ?? null

        let lastmod = formatLastMod(updatedField)
        if (!lastmod && (content as any).filePath) {
            lastmod = formatLastMod(gitLastModified((content as any).filePath))
        }

        return {
            loc: `https://kestra.io/docs${page ? "/" + page : ""}`,
            lastmod,
        }
    })

    return sitemapResponse([...urls, ...changelogUrls])
}