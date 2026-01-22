import { API_URL } from "astro:env/client"

const cacheObject: Record<string, any> = {}

export async function $fetch<T = any>(url: string, init: RequestInit = {}): Promise<T> {
    let response: Response
    if (cacheObject[url]) {
        return cacheObject[url]
    }
    try {
        response = await fetch(url, init)
    } catch (error) {
        console.error(`Fetch error on url ${url}: ${error}`)
        throw error
    }

    if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} ${response.statusText} on url ${url}`)
    }

    const data = await response.json()

    cacheObject[url] = data
    return data
}

export async function $fetchApi<T = any>(url: string, init: RequestInit = {}): Promise<T> {
    return $fetch<T>(`${API_URL}${url}`, init)
}

export async function $fetchApiCached<T = any>(
    url: string,
    duration = 60000,
    init: RequestInit = {},
): Promise<T> {
    if (cacheObject[url]) {
        if (Date.now() - cacheObject[url].timestamp < duration) {
            return cacheObject[url].data
        }
    }

    const data = await $fetchApi<T>(url, init)
    cacheObject[url] = {
        data,
        timestamp: Date.now(),
    }
    return data
}