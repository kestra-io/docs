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
        let responseData: unknown

        try {
            const contentType = response.headers.get("content-type") || ""
            if (contentType.includes("application/json")) {
                responseData = await response.clone().json()
            } else {
                responseData = await response.clone().text()
            }
        } catch {
            responseData = undefined
        }

        const error = new Error(
            `Fetch error: ${response.status} ${response.statusText} on url ${url}`,
        ) as Error & {
            response?: { status: number; statusText: string; data?: unknown }
        }

        error.response = {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
        }

        throw error
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

export async function $fetchCachedRaw(
    url: string,
    init: RequestInit = {},
): Promise<Response> {
    const cachingConfig: RequestInit = { ...init, ...cloudflareCache }

    return await internalFetch(url, cachingConfig)
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

export async function $fetchApiRawCached(
    url: string,
    init: RequestInit = {},
): Promise<Response> {
    const cachingConfig: RequestInit = { ...init, ...cloudflareCache }

    return await internalFetch(`${API_URL}${url}`, cachingConfig)
}

/**
 * Non-cached raw API fetch. Cloudflare then respects the API's own Cache-Control, so a ready (200)
 * versioned doc is still edge-cached while a transient 202 (generating) is not. The cacheEverything
 * variant would pin that 202 for an hour and make the page reload-loop while polling.
 */
export async function $fetchApiRaw(
    url: string,
    init: RequestInit = {},
): Promise<Response> {
    return await internalFetch(`${API_URL}${url}`, init)
}
