// Kept out of careers.ts on purpose: that module reads ASHBY_APIKEY from
// `astro:env/server` at import time, and this helper is needed by
// src/components/careers/Positions.vue, which is hydrated client-side. Only the
// type crosses over from careers.ts, and `import type` is erased at build.
import type { AshbyJob } from "./careers"
import { slugify } from "./slugify"

/**
 * Path of a job opening, as resolved by
 * src/pages/careers/[id1]-[id2]-[id3]-[id4]-[id5]-[slug]/index.astro.
 *
 * Shared by the listing links and the sitemap so the two cannot drift. Returns
 * null for a job with no posting, which has no page to link to.
 */
export const jobPath = (job: AshbyJob): string | null => {
    const jobPostingId = job.jobPostingIds?.[0]
    return jobPostingId ? `/careers/${jobPostingId}-${slugify(job.title)}` : null
}
