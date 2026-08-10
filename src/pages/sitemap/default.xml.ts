import type { APIRoute } from "astro"
import { sitemapResponse } from "~/utils/sitemap.ts"

/**
 * Routes that resolve to a different canonical URL, so submitting them would
 * point Google at a page it is told not to index under that address.
 *
 * - /videos rewrites to /videos/all and canonicalises there.
 */
const NON_CANONICAL_ROUTES = new Set(["/videos"])

export const GET: APIRoute = async () => {
    const list: Array<any> = Object.values(import.meta.glob("../**/*.astro", { eager: true }))

    const urls = list
        .map((item) => item.url)
        .filter((r) => r !== "" && r.indexOf("[") === -1)
        .filter((r) => r !== "/404" && r !== "/500")
        .filter((r) => !NON_CANONICAL_ROUTES.has(r))
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
