import type { APIRoute } from "astro"
import { categories } from "~/components/videos/categories"
import { sitemapResponse } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    // Category listings built by src/pages/videos/[slug].astro. `all` is the
    // canonical home of the section: /videos rewrites to it rather than
    // rendering its own page, so the slug is listed and /videos is not.
    const urls = Array.from(categories.keys()).map(
        (slug) => `https://kestra.io/videos/${slug}`,
    )

    return sitemapResponse(urls)
}
