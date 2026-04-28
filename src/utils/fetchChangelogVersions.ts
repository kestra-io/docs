import { $fetchCached } from "~/utils/fetch.ts"

export interface GitHubRelease {
    tag_name: string
    name?: string
    body: string
    published_at: string
    draft: boolean
    prerelease: boolean
}

function modifyCommitLink(body: string, repo = "kestra-io/kestra") {
    const marker = "Kestra Enterprise Edition Changes"
    const splitIndex = body.indexOf(marker)

    if (splitIndex === -1) {
        return body.replace(/^-\s([a-f0-9]{7})/gm, (match, commitId) => {
            const url = `https://github.com/${repo}/commit/${commitId}`
            return `- [\`${commitId}\`](${url})`
        })
    }
    const before = body.slice(0, splitIndex)
    const after = body.slice(splitIndex)

    const transformedBefore = before.replace(
        /^-\s([a-f0-9]{7})/gm,
        (match, commitId) => {
            const url = `https://github.com/${repo}/commit/${commitId}`
            return `- [\`${commitId}\`](${url})`
        },
    )
    const transformedAfter = after.replace(/^-\s([a-f0-9]{7})/gm, "- ")

    return transformedBefore + transformedAfter
}

export async function fetchMajorReleases(limit = 20): Promise<GitHubRelease[]> {
    try {
        const data = await $fetchCached(
            `https://api.github.com/repos/kestra-io/kestra/releases?per_page=150`,
        )
        const majorReleases = data.filter((r: any) => !r.draft && !r.prerelease)

        return majorReleases.slice(0, limit).map((release: any) => ({
            ...release,
            body: modifyCommitLink(release.body),
        }))
    } catch {
        return []
    }
}

export async function fetchReleaseByTag(tag: string) {
    try {
        const data = await $fetchCached(
            `https://api.github.com/repos/kestra-io/kestra/releases/tags/${tag}`,
        )
        return {
            ...data,
            body: modifyCommitLink(data.body),
        }
    } catch {
        return null
    }
}
