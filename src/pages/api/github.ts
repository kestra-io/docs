import type { APIRoute } from "astro"
import { env } from "cloudflare:workers"
import { DISABLE_GITHUB, GITHUB_TOKEN } from "astro:env/server"
import { getGithubStats, type GithubStats } from "~/utils/githubStats"

export const prerender = false

const REPO_URL = "https://api.github.com/repos/kestra-io/kestra"

async function githubFetch(url: string): Promise<Response> {
    const headers: Record<string, string> = {
        "User-Agent": "kestra.io",
        Accept: "application/vnd.github+json",
    }
    if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`
    const response = await fetch(url, { headers })
    if (!response.ok) throw new Error(`GitHub ${response.status} on ${url}`)
    return response
}

// Either call may fail alone; missing fields fall back to the stored values.
async function fetchStats(): Promise<Partial<GithubStats>> {
    const [contributors, repo] = await Promise.allSettled([
        githubFetch(`${REPO_URL}/contributors?anon=true&per_page=1`).then(
            (response) =>
                Number(
                    response.headers
                        .get("Link")
                        ?.match(/page=(\d+)>; rel="last"/)?.[1] ?? 0,
                ),
        ),
        githubFetch(REPO_URL).then((response) => response.json<any>()),
    ])
    if (contributors.status === "rejected" && repo.status === "rejected") {
        throw contributors.reason
    }

    const stats: Partial<GithubStats> = {}
    if (contributors.status === "fulfilled") {
        stats.contributors = contributors.value
    }
    if (repo.status === "fulfilled") {
        Object.assign(stats, {
            stargazers: repo.value.stargazers_count,
            watchers: repo.value.watchers_count,
            issues: repo.value.open_issues_count,
            forks: repo.value.forks,
            network: repo.value.network_count,
            subscribers: repo.value.subscribers_count,
            size: repo.value.size,
        })
    }
    return stats
}

export const GET: APIRoute = async ({ locals }) => {
    const stats = DISABLE_GITHUB
        ? undefined
        : await getGithubStats({
              kv: env.GITHUB_CACHE,
              fetchStats,
              waitUntil: (promise) => locals.cfContext?.waitUntil(promise),
          })

    if (!stats) {
        return new Response(JSON.stringify({ error: "unavailable" }), {
            status: 503,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
        })
    }

    return new Response(JSON.stringify(stats), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300",
        },
    })
}
