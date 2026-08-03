import type { APIRoute } from "astro"
import { sitemapResponse } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const list: Array<any> = Object.values(import.meta.glob("../**/*.astro", { eager: true }))

    const urls = list
        .map((item) => item.url)
        .filter((r) => r !== "" && r.indexOf("[") === -1)
        .filter((r) => r !== "/404" && r !== "/500")
        .filter((r) => r !== "/use-cases" && !r.startsWith("/use-cases/"))
        .filter((r) => r !== "/orchestration" && !r.startsWith("/orchestration/"))
        .filter((r) => r !== "/resources" && !r.startsWith("/resources/"))
        // Paid-campaign landing pages: noindex/nofollow by design, outside the
        // site navigation, and never to be submitted for indexing. This glob
        // picks up every `pages/**/*.astro`, so the exclusion has to live here.
        .filter((r) => !r.startsWith("/lp/"))
        .map((r) => "https://kestra.io" + r)

    return sitemapResponse(urls)
}
