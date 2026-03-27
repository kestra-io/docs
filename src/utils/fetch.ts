import { API_URL } from "astro:env/client"

const cloudflareCache: RequestInit = {
    cf: {
        cacheTtl: 60 * 60, // 1 hour
        cacheEverything: true,
    },
}

async function internalFetch(
    url: string,
    init: RequestInit = {},
): Promise<Response> {
    let response: Response

    try {
        response = await fetch(url, init)
    } catch (error) {
        console.error(`Fetch error on url ${url}: ${error}`)
        throw error
    }

    if (!response.ok) {
        throw new Error(
            `Fetch error: ${response.status} ${response.statusText} on url ${url}`,
        )
    }

    return response
}

export async function $fetch<T = any>(
    url: string,
    init: RequestInit = {},
): Promise<T> {
    const response = await internalFetch(url, init)

    return await response.json()
}

export async function $fetchCached<T = any>(
    url: string,
    init: RequestInit = {},
): Promise<T> {
    const cachingConfig: RequestInit = { ...init, ...cloudflareCache }

    return await $fetch<T>(url, cachingConfig)
}

export async function $fetchApi<T = any>(
    url: string,
    init: RequestInit = {},
): Promise<T> {
    return await $fetch<T>(`${API_URL}${url}`, init)
}

export async function $fetchApiCached<T = any>(
    url: string,
    init: RequestInit = {},
): Promise<T> {
    const cachingConfig: RequestInit = { ...init, ...cloudflareCache }

    return await $fetchApi<T>(url, cachingConfig)
}

export async function $fetchApiRawCached<T = any>(
    url: string,
    init: RequestInit = {},
): Promise<Response> {
    const cachingConfig: RequestInit = { ...init, ...cloudflareCache }

    return await internalFetch(`${API_URL}${url}`, cachingConfig)
}