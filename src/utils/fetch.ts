import { API_URL } from "astro:env/client"

const cloudflareCache = {
    cf: {
        cacheTtl: 60 * 60, // 1 hour
        cacheEverything: true,
    },
} as RequestInit

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

const RETRY_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 500

// Retries transient failures with a short growing backoff before rethrowing, for
// values rendered on many prerendered pages where one blip would fail the build.
export async function $fetchApiCachedWithRetry<T = any>(
    url: string,
    init: RequestInit = {},
): Promise<T> {
    let lastError: unknown
    for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
        try {
            return await $fetchApiCached<T>(url, init)
        } catch (e) {
            lastError = e
            if (attempt < RETRY_ATTEMPTS) {
                await new Promise((resolve) =>
                    setTimeout(resolve, RETRY_BASE_DELAY_MS * attempt),
                )
            }
        }
    }
    throw lastError
}

export async function $fetchApiRawCached(
    url: string,
    init: RequestInit = {},
): Promise<Response> {
    const cachingConfig: RequestInit = { ...init, ...cloudflareCache }

    return await internalFetch(`${API_URL}${url}`, cachingConfig)
}
