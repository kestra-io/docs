import { handle } from '@astrojs/cloudflare/handler';
import contentSecurityPolicyConfig from "../../content-security-policy.config"
import { defineCFMiddleware, type CFMiddleware } from './worker.types';
import { proxyTracking } from "../utils/trackingProxy";

const setupContentSecurityPolicyHeaders = defineCFMiddleware(async (url, next) => {
    // disable for tracking
    if (url.pathname.startsWith("/t/")) {
        return next()
    }

    const nextResponse = await next()
    const response = new Response(nextResponse.body, nextResponse)

    const localhost: string[] = []
    if (import.meta.env.DEV) {
        localhost.push(url.protocol + "//" + url.host)
    }

    const contentSecurityPolicy: string = Object.entries(
        contentSecurityPolicyConfig as Record<string, Array<string> | boolean>,
    )
        .filter(
            ([key]) =>
                !import.meta.env.DEV || key !== "upgrade-insecure-requests",
        )
        .map(([key, value]) => {
            let line = key

            if (typeof value !== "boolean") {
                if (value.length === 1 && value[0] === "'none'") {
                    line += " " + value.join(" ")
                } else {
                    line += " " + localhost.concat(value).join(" ")
                }
            }

            return line
        })
        .join("; ")

    response.headers.set(
        "x-frame-options",
        import.meta.env.DEV ? "SAMEORIGIN" : "DENY",
    )
    response.headers.set("x-content-type-options", "nosniff")
    response.headers.set("x-download-options", "nosniff")
    response.headers.set(
        "access-control-allow-origin",
        url.protocol + "//" + url.host,
    )
    response.headers.set("cross-origin-opener-policy", "same-origin")
    response.headers.set("cross-origin-resource-policy", "same-origin")
    response.headers.set(
        "permissions-policy",
        "camera=(), display-capture=(), fullscreen=(*), geolocation=(), microphone=()",
    )
    response.headers.set("referrer-policy", "strict-origin-when-cross-origin")
    response.headers.set("x-permitted-cross-domain-policies", "none")
    response.headers.set("content-security-policy", contentSecurityPolicy)

    if (!import.meta.env.DEV) {
        response.headers.set("strict-transport-security", "max-age=31536000")
    }

    return response
})

const noIndex = defineCFMiddleware(async (url, next) => {
    // disable for tracking
    if (url.pathname.startsWith("/t/")) {
        return next()
    }

    // Check if the request is coming from the .workers.dev domain or others
    if (url.host !== "kestra.io") {
        const nextResponse = await next()
        const response = new Response(nextResponse.body, nextResponse)

        response.headers.set("X-Robots-Tag", "noindex, nofollow")

        return response
    }

    return next()
})


const middlewares: CFMiddleware[] = [setupContentSecurityPolicyHeaders, noIndex]

// TTL (seconds) for edge-cached SSR HTML. Kept in sync with the 1h upstream
// API cache in src/utils/fetch.ts so a page's HTML and its data expire
// together. Once s-maxage lapses the next request is a cache miss and re-renders.
// `stale-while-revalidate` is advisory for browsers and any downstream shared
// cache (the Workers Cache API does not revalidate in the background itself).
const EDGE_CACHE_TTL = 60 * 60
const EDGE_CACHE_SWR = 60 * 60 * 24

// The plugin & blueprint templates declare `prerender = false`, so every hit
// re-runs a full Astro render inside the Worker (high TTFB — see issue #5158).
// Their HTML is public and request-independent (any content that varies —
// `?version=` on plugins, `?q=` on pattern pages — is part of the URL and
// therefore part of the cache key), so it is safe to serve from Cloudflare's
// edge cache. Other `prerender = false` routes (/api/*, /t/*, careers apply,
// cloud-early-access, hubspot-submit, …) are intentionally excluded.
function isEdgeCacheablePage(url: URL): boolean {
    const path = url.pathname
    return (
        path === "/plugins" ||
        path.startsWith("/plugins/") ||
        path === "/blueprints" ||
        path.startsWith("/blueprints/")
    )
}

// Analytics/campaign query params never change the rendered HTML. Stripping
// them (and sorting the rest) from the cache key keeps campaign traffic from
// fragmenting the cache into per-visitor misses.
const TRACKING_PARAMS = new Set([
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "utm_id",
    "gclid",
    "gbraid",
    "wbraid",
    "fbclid",
    "msclkid",
    "mc_cid",
    "mc_eid",
    "ref",
    "ref_src",
    "yclid",
    "twclid",
    "igshid",
    "_hsenc",
    "_hsmi",
])

// `caches.default` is a Cloudflare Workers runtime extension that is absent
// from the ambient DOM `CacheStorage` type, so we narrow it explicitly (the
// runtime values here are DOM `Request`/`Response`).
interface EdgeCache {
    match(request: Request): Promise<Response | undefined>
    put(request: Request, response: Response): Promise<void>
}

function edgeCache(): EdgeCache {
    return (caches as unknown as { default: EdgeCache }).default
}

function edgeCacheKey(url: URL): Request {
    const keyUrl = new URL(url.toString())
    for (const param of [...keyUrl.searchParams.keys()]) {
        if (TRACKING_PARAMS.has(param.toLowerCase())) {
            keyUrl.searchParams.delete(param)
        }
    }
    keyUrl.searchParams.sort()
    return new Request(keyUrl.toString(), { method: "GET" })
}

export default {
    async fetch(
        request: Parameters<typeof handle>[0],
        env: Parameters<typeof handle>[1],
        ctx: Parameters<typeof handle>[2],
    ) {
        const url = new URL(request.url)

        // Proxy PostHog analytics directly, before Astro can apply
        // `trailingSlash: "never"`. posthog-js posts to /t/i/v0/e/ with a
        // trailing slash; letting Astro 301 it strips the slash with a redirect
        // that has no CORS header, which breaks every cross-origin instance.
        // Must also run before the static-asset check below (/t/static/* paths
        // have file extensions).
        if (url.pathname.startsWith("/t/")) {
            return proxyTracking(request)
        }

        // Enforce no-trailing-slash canonical URLs site-wide (SEO consolidation).
        // Cloudflare's `html_handling: drop-trailing-slash` is bypassed by
        // `run_worker_first: true` (see PR #4547), so the worker must do the
        // 301 itself. `/t/` is excluded because its trailing slash is part of
        // the tracking payload forwarded to /login?next=...
        if (
            url.pathname.length > 1 &&
            url.pathname.endsWith("/") &&
            !url.pathname.startsWith("/t/")
        ) {
            url.pathname = url.pathname.replace(/\/+$/, "")
            return Response.redirect(url.toString(), 301)
        }

        // Serve static assets directly without middleware overhead
        if (/\.[a-zA-Z0-9]+$/.test(url.pathname)) {
            return handle(request, env, ctx)
        }

        // Edge-cache the rendered HTML of the SSR plugin & blueprint pages.
        // Because `run_worker_first: true` routes every request through this
        // Worker, Cloudflare's CDN never caches the generated HTML on its own;
        // we do it explicitly via the Cache API so each page is rendered at
        // most once per TTL (and the CSP is rebuilt at most once per TTL too).
        const canEdgeCache =
            request.method === "GET" &&
            url.host === "kestra.io" &&
            isEdgeCacheablePage(url)
        const cacheKey = canEdgeCache ? edgeCacheKey(url) : undefined

        if (cacheKey) {
            const hit = await edgeCache().match(cacheKey)
            if (hit) {
                return hit
            }
        }

        let response: Response | undefined = undefined
        function next() {
            if (response) {
                return Promise.resolve(response)
            }
            return handle(request, env, ctx)
        }

        for (const middleware of middlewares) {
            response = await middleware(new URL(request.url), next, request)
        }

        const finalResponse = await next()

        if (cacheKey && finalResponse.status === 200) {
            const response = new Response(finalResponse.body, finalResponse)
            response.headers.set(
                "Cache-Control",
                `public, s-maxage=${EDGE_CACHE_TTL}, stale-while-revalidate=${EDGE_CACHE_SWR}`,
            )

            // Cloudflare's Cache API rejects `put()` on any response carrying a
            // `Set-Cookie` header. Because the write runs inside
            // `ctx.waitUntil`, that rejection would be swallowed — silently
            // disabling the cache and re-rendering on every request. These
            // routes are public and request-independent (no server-set cookies
            // today), but strip `Set-Cookie` from the stored copy so a future
            // cookie can never quietly break caching, and guard the write so a
            // failed `put()` degrades to "not cached" instead of an unhandled
            // rejection. The response returned to this (cache-miss) visitor is
            // left untouched.
            const toStore = response.clone()
            toStore.headers.delete("Set-Cookie")
            ctx.waitUntil(
                edgeCache()
                    .put(cacheKey, toStore)
                    .catch((error) => {
                        console.error(
                            `Edge cache put failed for ${cacheKey.url}: ${error}`,
                        )
                    }),
            )

            return response
        }

        return finalResponse
    },
}