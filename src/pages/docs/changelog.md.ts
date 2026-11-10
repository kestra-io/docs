import type { APIRoute } from "astro"
import { fetchMajorReleases } from "~/utils/fetchChangelogVersions"
import { buildChangelogEntries } from "~/utils/changelog/parseRelease"
import { buildChangelogMarkdown } from "~/utils/changelog/markdown"

// SSR at runtime — when prerendered, Astro writes the 503 body below to dist as
// a 200 and drops its headers, so a failed GitHub fetch would ship a one-line
// "unavailable" document as the changelog until the next deploy.
export const prerender = false

export const GET: APIRoute = async () => {
    const releases = await fetchMajorReleases(150)

    // fetchMajorReleases swallows API errors and resolves to an empty list, so
    // no releases means the data is unavailable, not an empty changelog.
    if (releases.length === 0) {
        return new Response("Release notes temporarily unavailable", {
            status: 503,
            headers: {
                "content-type": "text/plain;charset=utf-8",
                "cache-control": "no-store",
                "retry-after": "30",
            },
        })
    }

    const markdown = buildChangelogMarkdown(buildChangelogEntries(releases))

    // Lets browsers and the AI-tool fetchers reuse the 261 KB document for an
    // hour, the same window $fetchCached gives the upstream GitHub call. The
    // Worker itself only edge-caches plugin and blueprint pages (worker.ts).
    return new Response(markdown, {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    })
}
