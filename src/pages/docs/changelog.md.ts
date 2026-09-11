import type { APIRoute } from "astro"
import { fetchMajorReleases } from "~/utils/fetchChangelogVersions"
import { buildChangelogEntries } from "~/utils/changelog/parseRelease"
import { buildChangelogMarkdown } from "~/utils/changelog/markdown"


export const GET: APIRoute = async () => {
    const releases = await fetchMajorReleases(150)


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

    return new Response(markdown, {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
        },
    })
}
