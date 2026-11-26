export async function fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${url} answered ${response.status}`)
    return response.json()
}

export function loadOnce<T>(load: () => Promise<T>) {
    let pending: Promise<T> | undefined
    return () => {
        if (!pending) {
            const request = load()
            request.catch(() => {
                if (pending === request) pending = undefined
            })
            pending = request
        }
        return pending
    }
}

export function cachedLoader<T>(load: (key: string) => Promise<T>, limit = 20) {
    const cache = new Map<string, Promise<T>>()
    return {
        isLoaded: (key: string) => cache.has(key),
        load(key: string) {
            const request = cache.get(key) ?? load(key)
            if (!cache.has(key)) {
                request.catch(() => {
                    if (cache.get(key) === request) cache.delete(key)
                })
            }
            cache.delete(key)
            cache.set(key, request)
            if (cache.size > limit) cache.delete(cache.keys().next().value!)
            return request
        },
    }
}
