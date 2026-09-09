// Job openings come from Ashby and change without a deploy, so the list is
// resolved per request rather than frozen at build time.
export const prerender = false

import type { APIRoute } from "astro"
import { fetchJobs } from "~/utils/careers.ts"
import { jobPath } from "~/utils/careersPath.ts"
import { sitemapResponse } from "~/utils/sitemap.ts"

export const GET: APIRoute = async () => {
    const jobs = await fetchJobs()

    const urls = jobs.flatMap((job) => {
        const path = jobPath(job)
        return path ? [`https://kestra.io${path}`] : []
    })

    return sitemapResponse(urls)
}
