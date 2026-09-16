import { $fetchCached, $fetchCachedRaw } from "~/utils/fetch"
import { DISABLE_GITHUB } from "astro:env/server"

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
    let contribCountRes: any
    try {
        contribCountRes = await $fetchCachedRaw(
            "https://api.github.com/repos/kestra-io/kestra/contributors?anon=true&per_page=1",
            { headers: { "User-Agent": "request" } },
        )
    } catch (error) {
        console.error("Error fetching contributors count:", error)
        return defaultValues
    }

    if (!contribCountRes.ok) {
        if (contribCountRes.status === 404) {
            return defaultValues
        }
        // Handle other errors
        console.error(
            "Error fetching contributors count:",
            contribCountRes.status,
            contribCountRes.statusText,
        )
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

    // This route is prerendered, so an unguarded throw here aborts the whole
    // build for a decorative star counter. Degrade instead.
    let repo: any
    try {
        repo = await $fetchCached(
            "https://api.github.com/repos/kestra-io/kestra",
            { headers: { "User-Agent": "request" } },
        )
    } catch (error) {
        console.error("Error fetching repository metadata:", error)
        return { ...defaultValues, contributors }
    }

    return {
        stargazers: repo.stargazers_count,
        watchers: repo.watchers_count,
        issues: repo.open_issues_count,
        forks: repo.forks,
        network: repo.network_count,
        subscribers: repo.subscribers_count,
        size: repo.size,
        contributors,
    }
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
