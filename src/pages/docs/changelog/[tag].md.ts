import type { APIRoute, GetStaticPaths } from "astro"
import { renderReleaseMarkdown } from "~/utils/changelogMarkdown"
import {
    fetchMajorReleases,
    type GitHubRelease,
} from "~/utils/fetchChangelogVersions"

// Same limit as the getStaticPaths in src/pages/docs/changelog/[tag].astro, so
// every release page that gets built also gets a Markdown endpoint.
const CHANGELOG_RELEASES = 150

export const getStaticPaths = (async () => {
    const releases = await fetchMajorReleases(CHANGELOG_RELEASES)
    return releases.map((release: GitHubRelease) => ({
        params: { tag: release.tag_name },
        props: { release },
    }))
}) satisfies GetStaticPaths

/**
 * Serves a release notes page (`/docs/changelog/{tag}`) as raw Markdown at
 * `/docs/changelog/{tag}.md`.
 *
 * The catch-all route `docs/[...docsPath].md.ts` only emits paths for the
 * `docs` content collection, and changelog pages are built from the GitHub
 * releases API instead of Markdown files in this repo. Without this endpoint
 * every `/docs/changelog/*.md` URL 404s, which breaks the "append .md to any
 * kestra.io/docs/* URL" contract advertised in DocsLayout and llms-full.txt.
 */
export const GET: APIRoute = ({ props }) => {
    const release = (props as { release?: GitHubRelease }).release
    if (!release) {
        return new Response("Not found", { status: 404 })
    }

    return new Response(renderReleaseMarkdown(release), {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
        },
    })
}
