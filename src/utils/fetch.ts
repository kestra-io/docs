import { API_URL } from "astro:env/client"

const cloudflareCache = {
    cf: {
        cacheTtl: 60 * 60, // 1 hour
        cacheEverything: true,
    },
} as RequestInit

// Prerendering runs in Node and hundreds of pages fetch the same payloads, so memoize
// them per build (workerd excluded). Callers share the resolved object: never mutate it.
const memoizeCachedFetches =
    import.meta.env.SSR &&
    import.meta.env.PROD &&
    globalThis.navigator?.userAgent !== "Cloudflare-Workers"

const buildMemo = new Map<string, Promise<unknown>>()

function memoizeGet<T>(
    url: string,
    init: RequestInit,
    load: () => Promise<T>,
): Promise<T> {
    const method = (init.method ?? "GET").toUpperCase()
    if (!memoizeCachedFetches || method !== "GET" || init.body) return load()
    const key = `${url} ${JSON.stringify(init.headers ?? null)}`
    let pending = buildMemo.get(key) as Promise<T> | undefined
    if (!pending) {
        pending = load()
        // A transient failure must not be replayed on every page that follows.
        pending.catch(() => buildMemo.delete(key))
        buildMemo.set(key, pending)
    }
    return pending
}

// A single 504 from an upstream API used to abort a whole build, so idempotent
// requests back off and retry before the error propagates.
const MAX_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 250
const RETRY_MAX_DELAY_MS = 5_000
const RETRYABLE_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504])

type FetchError = Error & {
    response?: { status: number; statusText: string; data?: unknown }
    retryAfter?: string | null
}

const sleep = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms))

// Replaying a POST could duplicate a submission, so only GET/HEAD are retried.
function isIdempotent(init: RequestInit): boolean {
    const method = (init.method ?? "GET").toUpperCase()
    return (method === "GET" || method === "HEAD") && !init.body
}

function isTransient(error: FetchError): boolean {
    const status = error.response?.status
    return status === undefined || RETRYABLE_STATUSES.has(status)
}

function retryDelay(attempt: number, retryAfter: string | null): number {
    const seconds = Number(retryAfter)
    if (Number.isFinite(seconds) && seconds > 0) {
        return Math.min(seconds * 1000, RETRY_MAX_DELAY_MS)
    }
    return Math.min(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1), RETRY_MAX_DELAY_MS)
}

async function fetchOnce(url: string, init: RequestInit): Promise<Response> {
    const response = await fetch(url, init)

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

        const error: FetchError = new Error(
            `Fetch error: ${response.status} ${response.statusText} on url ${url}`,
        )

        error.response = {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
        }
        error.retryAfter = response.headers.get("retry-after")

        throw error
    }

    return response
}

async function internalFetch(
    url: string,
    init: RequestInit = {},
): Promise<Response> {
    const retryable = isIdempotent(init)

    for (let attempt = 1; ; attempt++) {
        try {
            return await fetchOnce(url, init)
        } catch (error) {
            const fetchError = error as FetchError
            const status = fetchError.response?.status

            if (
                !retryable ||
                attempt >= MAX_ATTEMPTS ||
                !isTransient(fetchError)
            ) {
                // Non-2xx already carries its status to the caller; only a
                // network-level failure would otherwise be silent.
                if (status === undefined) {
                    console.error(`Fetch error on url ${url}: ${fetchError}`)
                }
                throw error
            }

            const delay = retryDelay(attempt, fetchError.retryAfter ?? null)
            console.warn(
                `Fetch ${status ?? "network error"} on url ${url}, retry ${attempt}/${MAX_ATTEMPTS - 1} in ${delay}ms`,
            )
            await sleep(delay)
        }
    }
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

    return await memoizeGet(url, init, () => $fetch<T>(url, cachingConfig))
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

    return await memoizeGet(`${API_URL}${url}`, init, () =>
        $fetchApi<T>(url, cachingConfig),
    )
}

// Same as $fetchApiCached but resolves to undefined when the API fails, for
// decorative data that must not take the whole page down.
export async function $fetchApiCachedOptional<T = any>(
    url: string,
    init: RequestInit = {},
): Promise<T | undefined> {
    try {
        return await $fetchApiCached<T>(url, init)
    } catch (error) {
        const status = (error as { response?: { status?: number } })?.response
            ?.status
        console.warn(
            `Optional API fetch failed (${status ?? "network"}): ${url}`,
        )
        return undefined
    }
}

export async function $fetchApiRawCached(
    url: string,
    init: RequestInit = {},
): Promise<Response> {
    const cachingConfig: RequestInit = { ...init, ...cloudflareCache }

    return await internalFetch(`${API_URL}${url}`, cachingConfig)
}
