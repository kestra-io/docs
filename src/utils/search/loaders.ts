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

