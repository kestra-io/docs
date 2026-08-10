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
        .filter((r) => typeof r === "string" && r.indexOf("[") === -1)
        .filter((r) => r !== "/404" && r !== "/500")
        .filter((r) => !NON_CANONICAL_ROUTES.has(r))
        .filter((r) => r !== "/use-cases" && !r.startsWith("/use-cases/"))
        .filter((r) => r !== "/orchestration" && !r.startsWith("/orchestration/"))
        .filter((r) => r !== "/resources" && !r.startsWith("/resources/"))
        // `trailingSlash: "never"` reduces the home page route to an empty
        // string, so it needs the slash back to become an absolute URL.
        .map((r) => "https://kestra.io" + (r === "" ? "/" : r))

    return sitemapResponse(urls)
}
