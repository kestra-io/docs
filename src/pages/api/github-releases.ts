import type { APIRoute } from "astro"
import { DISABLE_GITHUB } from "astro:env/server"

export const prerender = false

interface GitHubRelease {
    tag_name: string
    published_at: string | null
    draft: boolean
}

export interface ReleaseInfo {
    version: string
    publishedAt: string | null
    minCoreCompatibilityVersion?: string | null
    releaseNotesUrl?: string | null
}

export async function retrieveRepoReleases(repo: string) {
    if (DISABLE_GITHUB) {
        return { versions: [] }
    }
    const headers: Record<string, string> = { "User-Agent": "request" }

    const response = await fetch(
        `https://api.github.com/repos/kestra-io/${repo}/releases`,
        {
            headers,
        },
    )

    if (!response.ok) {
        if (response.status === 404) {
            return { versions: [] }
        }
        console.error(
            `GitHub API error for ${repo}: ${response.status} ${response.statusText}`,
        )
        return { versions: [] }
    }

    const releases = (await response.json()) as GitHubRelease[]

    try {
        const versions: ReleaseInfo[] = releases
            .filter((release) => !release.draft)
            .map((release) => ({
                version: release.tag_name.replace(/^v/, ""),
                publishedAt: release.published_at,
            }))
            .filter((v) => {
                const major = parseInt(v.version.split(".")[0])
                return !isNaN(major) && major >= 1
            })
            .toSorted((a, b) => {
                const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0
                const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0
                return bTime - aTime
            })

        return { versions }
    } catch (error) {
        console.error(`Error processing releases for ${repo}:`, error)
        return { versions: [] }
    }
}

export const GET: APIRoute = async ({ params }) => {
    const data = await retrieveRepoReleases(params.repo ?? "kestra")
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=86400",
        },
    })
}
