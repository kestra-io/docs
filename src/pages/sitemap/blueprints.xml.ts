export const prerender = false

import type { APIRoute } from "astro"
import { useBlueprintsList } from "~/composables/useBlueprintsList.ts"
import { CATEGORY_TILE_META } from "~/utils/blueprints/categoryMeta"
import { sitemapResponse, formatLastMod } from "~/utils/sitemap.ts"

/**
 * Blueprints listed by the API whose page currently returns a 500.
 *
 * Their `/blueprints/{id}/versions/latest` payload is fine, but
 * `/blueprints/{id}/versions/latest/graph` answers 422 and the page fetches the
 * graph outside a try/catch, so the render throws. Nothing in the list payload
 * distinguishes them, hence the explicit list. Drop an entry once its page
 * returns 200 again.
 */
const BROKEN_BLUEPRINTS = new Set([
    "azure-blob-backup-retention-cutover",
    "ldap-employee-offboarding-deprovision",
])

export const GET: APIRoute = async () => {
    const data = (await useBlueprintsList({ page: 1, size: 9999 })) as {
        results: Blueprint[]
        total: number
    }

    // Category listings served by src/pages/blueprints/[id].astro. It treats
    // every tile slug as a category except "Getting Started", which falls
    // through to the blueprint lookup and has no category page of its own.
    const categoryUrls = CATEGORY_TILE_META.filter(
        (category) => category.name !== "Getting Started",
    ).map((category) => ({ loc: `https://kestra.io/blueprints/${category.slug}` }))

    const urls = data.results
        // `Blueprint.id` is declared as a number in src/type.d.ts but the API returns a slug.
        .filter((r) => !BROKEN_BLUEPRINTS.has(String(r.id)))
        .map((r) => ({ loc: `https://kestra.io/blueprints/${r.id}`, lastmod: formatLastMod(r.updatedAt) }))

    return sitemapResponse([...categoryUrls, ...urls])
}