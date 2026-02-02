import { $fetch } from "~/utils/fetch"

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

export async function getValues() {
    const cached = await getFromCache([])

    if (cached) {
        return cached
    }

    const contribCountRes = await fetch(
        "https://api.github.com/repos/kestra-io/kestra/contributors?anon=true&per_page=1",
        { headers: { "User-Agent": "request" } },
    )

    if (!contribCountRes.ok) {
        if (contribCountRes.status === 404) {
            return {
                stargazers: 0,
                watchers: 0,
                issues: 0,
                forks: 0,
                network: 0,
                subscribers: 0,
                size: 0,
                contributors: 0,
            }
        }
        // Handle other errors
        console.error(
            "Error fetching contributors count:",
            contribCountRes.status,
            contribCountRes.statusText,
        )
    }

    const contribStr =
        contribCountRes.headers?.get("Link")?.match(/page=(\d+)>; rel="last"/)?.[1] || "0"

    const contributors = parseInt(contribStr, 10)
    if (isNaN(contributors)) {
        throw Error("Failed to parse contributors count" + contribCountRes.headers.get("Link"))
    }

    const result = await $fetch("https://api.github.com/repos/kestra-io/kestra", {
        headers: { "User-Agent": "request" },
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

    await addToCache(result, [], 300)

    return result
}

export async function GET() {
    const data = await getValues()
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "max-age=86400",
        },
    })
}