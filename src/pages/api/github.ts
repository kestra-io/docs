import { $fetchCached, $fetchCachedRaw } from "~/utils/fetch"
import { DISABLE_GITHUB, GITHUB_TOKEN } from "astro:env/server"

const defaultValues = {
    stargazers: 0,
    watchers: 0,
    issues: 0,
    forks: 0,
    network: 0,
    subscribers: 0,
    size: 0,
    contributors: 0,
}

export async function getValues() {
    if (DISABLE_GITHUB) {
        return defaultValues
    }
    const authHeaders: Record<string, string> = GITHUB_TOKEN
        ? { "User-Agent": "request", Authorization: `Bearer ${GITHUB_TOKEN}` }
        : { "User-Agent": "request" }

    let contribCountRes: any
    try {
        contribCountRes = await $fetchCachedRaw(
            "https://api.github.com/repos/kestra-io/kestra/contributors?anon=true&per_page=1",
            { headers: authHeaders },
        )
    } catch (error) {
        console.error("Error fetching contributors count:", error)
        return defaultValues
    }

    if (!contribCountRes.ok) {
        console.error(
            "Error fetching contributors count:",
            contribCountRes.status,
            contribCountRes.statusText,
        )
        return defaultValues
    }

    const contribStr =
        contribCountRes.headers
            ?.get("Link")
            ?.match(/page=(\d+)>; rel="last"/)?.[1] || "0"

    const contributors = parseInt(contribStr, 10)
    if (isNaN(contributors)) {
        throw Error(
            "Failed to parse contributors count" +
                contribCountRes.headers.get("Link"),
        )
    }

    return await $fetchCached("https://api.github.com/repos/kestra-io/kestra", {
        headers: authHeaders,
    }).then((value) => {
        return {
            stargazers: value.stargazers_count,
            watchers: value.watchers_count,
            issues: value.open_issues_count,
            forks: value.forks,
            network: value.network_count,
            subscribers: value.subscribers_count,
            size: value.size,
            contributors,
        }
    })
}

export async function GET() {
    const data = await getValues()
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=86400",
        },
    })
}
