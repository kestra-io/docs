import { SHARE_PARAM } from "~/utils/vra-calculator"

// The only place the calculator touches browser APIs. The engine in
// ~/utils/vra-calculator stays pure; the store receives a BrowserEnv so it can
// run (and be tested) without a window.

export interface StorageLike {
    getItem(key: string): string | null
    setItem(key: string, value: string): void
    removeItem(key: string): void
}

export interface BrowserEnv {
    storage: StorageLike | null
    href(): string
    replaceUrl(url: string): void
    locales(): readonly string[]
}

export function getBrowserEnv(): BrowserEnv | null {
    if (typeof window === "undefined") return null
    let storage: StorageLike | null = null
    try {
        storage = window.localStorage
    } catch {
        storage = null
    }
    return {
        storage,
        href: () => window.location.href,
        replaceUrl: (url) => {
            window.history.replaceState(window.history.state, "", url)
        },
        locales: () =>
            navigator.languages?.length
                ? navigator.languages
                : navigator.language
                  ? [navigator.language]
                  : [],
    }
}

export function readStored(
    storage: StorageLike | null,
    key: string,
): string | null {
    if (!storage) return null
    try {
        return storage.getItem(key)
    } catch {
        return null
    }
}

export function writeStored(
    storage: StorageLike | null,
    key: string,
    value: string | null,
): boolean {
    if (!storage) return false
    try {
        if (value === null) storage.removeItem(key)
        else storage.setItem(key, value)
        return true
    } catch {
        return false
    }
}

export function readShareParam(href: string): string | null {
    try {
        return new URL(href).searchParams.get(SHARE_PARAM)
    } catch {
        return null
    }
}

export function withShareParam(
    href: string,
    encoded: string,
    anchor?: string,
): string {
    const url = new URL(href)
    url.searchParams.set(SHARE_PARAM, encoded)
    url.hash = anchor ? "#" + anchor : ""
    return url.toString()
}

export function withoutShareParam(href: string): string {
    const url = new URL(href)
    url.searchParams.delete(SHARE_PARAM)
    return url.toString()
}

export async function copyText(text: string): Promise<boolean> {
    try {
        if (!navigator.clipboard?.writeText) return false
        await navigator.clipboard.writeText(text)
        return true
    } catch {
        return false
    }
}

export function downloadTextFile(
    filename: string,
    content: string,
    type: string,
): boolean {
    try {
        const url = URL.createObjectURL(new Blob([content], { type }))
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        link.remove()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        return true
    } catch {
        return false
    }
}
