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

export default {
    async fetch(request, env, ctx) {
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
        return await next()
    },
} satisfies ExportedHandler;