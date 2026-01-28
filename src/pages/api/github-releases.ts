import type { APIRoute } from "astro"

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
}

const cache: { [key: string]: { data: any; expiry: number } } = {}

async function getFromCache(keys: string[]) {
    const cacheKey = keys.join(":")
    const cachedEntry = cache[cacheKey]

    if (cachedEntry && cachedEntry.expiry > Date.now()) {
        return cachedEntry.data
    }
    return null
}

async function addToCache(data: any, keys: string[], ttl: number) {
    const cacheKey = keys.join(":")
    cache[cacheKey] = {
        data,
        expiry: Date.now() + ttl * 1000,
    }
}

export async function retrieveRepoReleases(repo: string) {
    const cached = await getFromCache([repo])

    if (cached) return cached

    const headers: Record<string, string> = { "User-Agent": "request" }

    const response = await fetch(`https://api.github.com/repos/kestra-io/${repo}/releases`, {
        headers,
    })

    if (!response.ok) {
        if (response.status === 404) {
            const result = { versions: [] }
            await addToCache(result, [], 3600)
            return result
        }
        console.error(`GitHub API error for ${repo}: ${response.status} ${response.statusText}`)
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
                const major = parseInt(v.version.split(".")[0]);
                return !isNaN(major) && major >= 1;
            });

        const result = { versions }
        await addToCache(result, [repo], 3600)

        return result
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
            "Cache-Control": "max-age=86400",
        },
    })
}