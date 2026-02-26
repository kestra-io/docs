/** heavy inspired by https://www.launchfa.st/blog/astro-incremental-static-regeneration-cloudflare-kv */
/* oxlint-disable no-console */
import { defineMiddleware } from "astro:middleware"
import { createISRCache } from "./isr-cache"

const revalidate = 2

// FIXME: adjust the catch to be reliable depending on the content type
export const middlewareISRCache = defineMiddleware(async (context, next) => {
    // if dev or pregenerate, skip ISR
    if (import.meta.env.DEV || context.isPrerendered) {
        return next()
    }

    const { request, locals, url } = context

    // Only apply ISR to GET requests for HTML pages
    if (request.method !== "GET") {
        return next()
    }

    // Skip ISR for API routes and static assets
    if (
        url.pathname.startsWith("/api/") ||
        url.pathname.match(/\.(js|css|png|jpg|svg|ico|woff|woff2)$/)
    ) {
        return next()
    }

    // Skip ISR if KV is not available (local development)
    if (!locals.runtime?.env?.ISR_CACHE) {
        console.log("[ISR] KV not available, skipping cache")
        return next()
    }

    try {
        // Create ISR cache instance with 60 second default revalidation
        const cache = createISRCache(locals, {
            revalidate,
            enabled: true,
        })

        // Try to get cached version
        const cached = await cache.get(url.pathname)

        if (cached) {
            // Check if cache is still fresh
            if (cache.isFresh(cached)) {
                console.log(`[ISR] Cache HIT (fresh): ${url.pathname}`)

                // Return cached HTML with cache headers
                return new Response(cached.html, {
                    status: 200,
                    headers: {
                        "Content-Type": "text/html; charset=utf-8",
                        "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate",
                        "X-Cache-Status": "HIT",
                        "X-Cache-Age": String(Math.floor((Date.now() - cached.timestamp) / 1000)),
                    },
                })
            } else {
                console.log(`[ISR] Cache HIT (stale): ${url.pathname}`)

                // Cache is stale, but serve it anyway while we regenerate
                // This is the "stale-while-revalidate" pattern

                // Return stale content immediately
                const response = new Response(cached.html, {
                    status: 200,
                    headers: {
                        "Content-Type": "text/html; charset=utf-8",
                        "Cache-Control": "public, s-maxage=31536000, stale-while-revalidate",
                        "X-Cache-Status": "STALE",
                        "X-Cache-Age": String(Math.floor((Date.now() - cached.timestamp) / 1000)),
                    },
                })

                // Trigger background regeneration (non-blocking)
                context.locals.runtime.ctx.waitUntil(
                    (async () => {
                        try {
                            console.log(`[ISR] Regenerating in background: ${url.pathname}`)

                            // Generate fresh page
                            const freshResponse = await next()
                            const freshHtml = await freshResponse.text()

                            // Update cache
                            await cache.set(url.pathname, freshHtml, 60)

                            console.log(`[ISR] Background regeneration complete: ${url.pathname}`)
                        } catch (error) {
                            console.error(
                                `[ISR] Background regeneration failed: ${url.pathname}`,
                                error,
                            )
                        }
                    })(),
                )

                return response
            }
        } else {
            console.log(`[ISR] Cache MISS: ${url.pathname}`)

            // No cache exists, generate page
            const response = await next()

            // Only cache successful HTML responses
            if (
                response.status === 200 &&
                response.headers.get("content-type")?.includes("text/html")
            ) {
                const html = await response.text()

                // Store in cache (non-blocking)
                context.locals.runtime.ctx.waitUntil(cache.set(url.pathname, html, 60))

                // Return response with cache miss header
                return new Response(html, {
                    status: response.status,
                    headers: {
                        ...Object.fromEntries(response.headers),
                        "X-Cache-Status": "MISS",
                    },
                })
            }

            return response
        }
    } catch (error) {
        console.error("[ISR] Error in middleware:", error)
        // On error, fall back to normal SSR
        return next()
    }
})