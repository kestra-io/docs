import { useDataCache } from '#imports'

interface GitHubRelease {
    tag_name: string
    published_at: string | null
    draft: boolean
}

export interface ReleaseInfo {
    version: string
    publishedAt: string | null
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const repo = String(query.repo ?? "").trim()

    if (!repo) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required query parameter: repo'
        })
    }

    const cacheKey = `github-releases-${repo}`
    const { value, addToCache } = await useDataCache(cacheKey, event)

    if (value) {
        return value
    }

    try {
        const headers: Record<string, string> = { 'User-Agent': 'request' }

        const response = await fetch(`https://api.github.com/repos/kestra-io/${repo}/releases`, { headers })

        if (!response.ok) {
            if (response.status === 404) {
                const result = { versions: [] }
                await addToCache(result, [], 3600)
                return result
            }
            console.error(`GitHub API error for ${repo}: ${response.status} ${response.statusText}`)
            throw new Error(`GitHub API returned ${response.status}`)
        }

        const releases = await response.json() as GitHubRelease[]

        const versions: ReleaseInfo[] = releases
            .filter(release => !release.draft)
            .map(release => ({
                version: release.tag_name.replace(/^v/, ''),
                publishedAt: release.published_at
            }))

        const result = { versions }
        await addToCache(result, [], 3600)

        return result
    } catch (error) {
        console.error(`Error fetching releases for ${repo}:`, error)
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to fetch releases for ${repo}`
        })
    }
})
