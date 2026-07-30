import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { ALL_NEWS, allBlogCategories } from "~/components/blogs/categories"
import { sitemapResponse, formatLastMod, gitLastModified } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    // Category listings built by src/pages/blogs/[category].astro. `$all` is
    // skipped: it canonicalises to /blogs, which default.xml already lists.
    const categoryUrls = Array.from(allBlogCategories.keys())
        .filter((category) => category !== ALL_NEWS)
        .map((category) => ({ loc: `https://kestra.io/blogs/${category}` }))

    const allBlogPosts = await getCollection("blogs")
    const urls = allBlogPosts.map((content) => {
        const updatedField = content.data.updated

        let lastmod = formatLastMod(updatedField)
        if (!lastmod && content.filePath) {
            lastmod = formatLastMod(gitLastModified(content.filePath))
        }

        return {
            loc: `https://kestra.io/blogs/${content.id}`,
            lastmod,
        }
    })

    return sitemapResponse([...categoryUrls, ...urls])
}