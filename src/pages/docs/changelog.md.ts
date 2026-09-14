import type { APIRoute } from "astro"
import { renderChangelogIndexMarkdown } from "~/utils/changelogMarkdown"
import { fetchMajorReleases } from "~/utils/fetchChangelogVersions"

// Same limit as the getStaticPaths in src/pages/docs/changelog/[tag].astro, so
// the index lists exactly the release pages that get built.
const CHANGELOG_RELEASES = 150

/**
 * Serves the changelog index page (`/docs/changelog`) as raw Markdown at
 * `/docs/changelog.md`.
 *
 * The release notes themselves live behind `/docs/changelog/{tag}.md`; this
 * index gives AI agents and other tools a single entry point to discover them
 * instead of returning a 404.
 */
export const GET: APIRoute = async () => {
    const releases = await fetchMajorReleases(CHANGELOG_RELEASES)

    return new Response(renderChangelogIndexMarkdown(releases), {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
        },
    })
}
