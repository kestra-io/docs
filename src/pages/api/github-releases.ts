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

/**
 * Compare two semver-ish version strings ("1.3.20", "1.10.2") for descending sort.
 * Date sort is wrong for repos with parallel release lines (e.g. Kestra core: 1.1.x and 1.3.x
 * release concurrently — a recent 1.1.x patch was appearing above older 1.3.x in the dropdown).
 */
function compareVersionsDesc(a: string, b: string): number {
    const partsA = a.split(".").map((n) => parseInt(n, 10) || 0)
    const partsB = b.split(".").map((n) => parseInt(n, 10) || 0)
    const len = Math.max(partsA.length, partsB.length)
    for (let i = 0; i < len; i++) {
        const diff = (partsB[i] ?? 0) - (partsA[i] ?? 0)
        if (diff !== 0) return diff
    }
    return 0
}

export async function retrieveRepoReleases(repo: string) {
    if (DISABLE_GITHUB) {
        return { versions: [] }
    }
    const headers: Record<string, string> = { "User-Agent": "request" }
    const token = process.env.GITHUB_TOKEN
    if (token) headers["Authorization"] = `Bearer ${token}`

    const response = await fetch(
        `https://api.github.com/repos/kestra-io/${repo}/releases?per_page=100`,
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
            .toSorted((a, b) => compareVersionsDesc(a.version, b.version))

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
