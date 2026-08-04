import { DISABLE_GITHUB } from "astro:env/server"
import { compareVersionsDesc } from "~/utils/plugins/compareVersions"

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

async function fetchRepoReleases(repo: string): Promise<{ versions: ReleaseInfo[] }> {
    const headers: Record<string, string> = { "User-Agent": "request" }

    const response = await fetch(
        `https://api.github.com/repos/kestra-io/${repo}/releases?per_page=100`,
        {
            headers,
        },
    )

    if (!response.ok) {
        // 404 is a real empty result; transient errors throw so the caller keeps stale data.
        if (response.status === 404) {
            return { versions: [] }
        }
        throw new Error(`GitHub API ${response.status} ${response.statusText}`)
    }

    const releases = (await response.json()) as GitHubRelease[]
    const versions: ReleaseInfo[] = releases
        .filter((release) => !release.draft && !release.tag_name.includes("SNAPSHOT"))
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
}

// Called on every SSR plugin page render, so memoize per repo per worker isolate
// with a TTL to avoid hitting the GitHub API (and its rate limit) each time.
const RELEASES_TTL_MS = 10 * 60 * 1000
const releasesCache = new Map<string, { at: number; data: { versions: ReleaseInfo[] } }>()

export async function retrieveRepoReleases(repo: string): Promise<{ versions: ReleaseInfo[] }> {
    if (DISABLE_GITHUB) {
        return { versions: [] }
    }
    const now = Date.now()
    const cached = releasesCache.get(repo)
    if (cached && now - cached.at < RELEASES_TTL_MS) {
        return cached.data
    }
    try {
        const data = await fetchRepoReleases(repo)
        releasesCache.set(repo, { at: now, data })
        return data
    } catch (error) {
        console.error(`Error fetching releases for ${repo}:`, error)
        return cached?.data ?? { versions: [] } // keep stale data on a failed refresh
    }
}
