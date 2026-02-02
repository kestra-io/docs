/** heavy inspired by https://www.launchfa.st/blog/astro-incremental-static-regeneration-cloudflare-kv */

export interface ISRCacheOptions {
    /**
     * Time in seconds before cache is considered stale
     * @default 60
     */
    revalidate?: number

    /**
     * Custom cache key prefix
     * @default 'isr'
     */
    prefix?: string

    /**
     * Whether to enable cache
     * @default true
     */
    enabled?: boolean
}

export interface CachedData {
    /** The cached HTML content */
    html: string

    /** Timestamp when the cache was created */
    timestamp: number

    /** Revalidation time in seconds */
    revalidate: number

    /** URL that was cached */
    url: string
}

export class ISRCache {
    private kv: KVNamespace
    private options: Required<ISRCacheOptions>

    constructor(kv: KVNamespace, options: ISRCacheOptions = {}) {
        this.kv = kv
        this.options = {
            revalidate: options.revalidate ?? 60,
            prefix: options.prefix ?? "isr",
            enabled: options.enabled ?? true,
        }
    }

    /**
     * Generate a cache key for a given URL
     */
    private getCacheKey(url: string): string {
        // Remove query params and hash for consistent caching
        const cleanUrl = url.split("?")[0].split("#")[0]
        return `${this.options.prefix}:${cleanUrl}`
    }

    /**
     * Get cached data if it exists
     */
    async get(url: string): Promise<CachedData | null> {
        if (!this.options.enabled) return null

        try {
            const key = this.getCacheKey(url)
            const cached = (await this.kv.get(key, "json")) as CachedData | null

            return cached
        } catch (error) {
            console.error("[ISR Cache] Error getting cache:", error)
            return null
        }
    }

    /**
     * Check if cached data is still fresh
     */
    isFresh(cachedData: CachedData): boolean {
        const now = Date.now()
        const age = (now - cachedData.timestamp) / 1000 // Convert to seconds
        return age < cachedData.revalidate
    }

    /**
     * Store HTML in cache
     */
    async set(url: string, html: string, revalidate?: number): Promise<void> {
        if (!this.options.enabled) return

        try {
            const key = this.getCacheKey(url)
            const data: CachedData = {
                html,
                timestamp: Date.now(),
                revalidate: revalidate ?? this.options.revalidate,
                url,
            }

            // Store in KV with metadata
            await this.kv.put(key, JSON.stringify(data), {
                // Optional: Set expiration time to automatically clean up old cache
                // expirationTtl: (revalidate ?? this.options.revalidate) * 2,
                metadata: {
                    url,
                    cachedAt: new Date().toISOString(),
                },
            })

            console.log(`[ISR Cache] Cached: ${url} (revalidate: ${data.revalidate}s)`)
        } catch (error) {
            console.error("[ISR Cache] Error setting cache:", error)
        }
    }

    /**
     * Invalidate (delete) cache for a specific URL
     */
    async invalidate(url: string): Promise<boolean> {
        try {
            const key = this.getCacheKey(url)
            await this.kv.delete(key)
            console.log(`[ISR Cache] Invalidated: ${url}`)
            return true
        } catch (error) {
            console.error("[ISR Cache] Error invalidating cache:", error)
            return false
        }
    }

    /**
     * Invalidate multiple URLs at once
     */
    async invalidateMany(urls: string[]): Promise<number> {
        let invalidated = 0

        await Promise.all(
            urls.map(async (url) => {
                const success = await this.invalidate(url)
                if (success) invalidated++
            }),
        )

        return invalidated
    }

    /**
     * List all cached URLs with a given prefix
     */
    async list(prefix?: string): Promise<string[]> {
        try {
            const listPrefix = prefix
                ? `${this.options.prefix}:${prefix}`
                : `${this.options.prefix}:`
            const list = await this.kv.list({ prefix: listPrefix })

            return list.keys.map((key) => key.name.replace(`${this.options.prefix}:`, ""))
        } catch (error) {
            console.error("[ISR Cache] Error listing cache:", error)
            return []
        }
    }

    /**
     * Get cache statistics
     */
    async getStats(): Promise<{
        totalKeys: number
        keys: string[]
    }> {
        const keys = await this.list()
        return {
            totalKeys: keys.length,
            keys,
        }
    }
}

/**
 * Helper function to create an ISR cache instance
 */
export function createISRCache(locals: App.Locals, options?: ISRCacheOptions): ISRCache {
    const kv = locals.runtime.env.ISR_CACHE as KVNamespace
    if (!kv) {
        throw new Error(
            "ISR_CACHE KV namespace not found. Make sure it is configured in wrangler.toml",
        )
    }
    return new ISRCache(kv, options)
}