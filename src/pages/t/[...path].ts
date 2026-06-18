export const prerender = false

import type { APIRoute } from "astro"

const proxyDomain = new URL("https://eu.posthog.com/")
const staticProxyDomain = new URL("https://eu-assets.i.posthog.com/static/")

// Every Kestra instance (cloud, custom domains, OSS self-hosted) loads this
// proxy cross-origin, so analytics ingest responses must be CORS-readable. The
// endpoint only proxies public PostHog ingestion (the token is public and the
// cookie header is stripped below), so a wildcard origin without credentials is
// safe here.
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
}

export const ALL: APIRoute = async ({ request, clientAddress }) => {
    // Answer CORS preflight locally instead of forwarding it upstream.
    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders })
    }

    const requestUrl = new URL(request.url)
    let realUrl = requestUrl.pathname.substring(2, requestUrl.pathname.length) + (requestUrl.search ? "?" + requestUrl.searchParams.toString() : "")

    if (realUrl.startsWith("//")) {
        realUrl = realUrl.substring(1, realUrl.length)
    }

    const proxyUrl = new URL(
        realUrl,
        realUrl.startsWith("/static") ? staticProxyDomain : proxyDomain,
    )

    // Forward headers, excluding ones that shouldn't be proxied
    const headers = new Headers()
    const excludedHeaders = [
        "host",
        "connection",
        "content-length",
        "transfer-encoding",
        "accept-encoding",
        "cookie",
    ]

    for (const [key, value] of request.headers.entries()) {
        if (!excludedHeaders.includes(key.toLowerCase())) {
            headers.set(key, value)
        }
    }

    // Forward client IP for geolocation
    const clientIp =
        request.headers.get("CF-Connecting-IP") ||
        request.headers.get("x-real-ip") ||
        request.headers.get("x-forwarded-for") ||
        clientAddress

    if (clientIp) {
        headers.set("x-forwarded-for", clientIp)
    }

    const forwardedRequest = new Request(proxyUrl, {
        headers: headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : null,
        method: request.method,
        credentials: request.credentials,
        mode: request.mode,
        redirect: request.redirect,
        referrer: request.referrer
    })

    const response = await fetch(forwardedRequest)

    // Override any upstream value so a single, well-defined ACAO is returned.
    const responseHeaders = new Headers(response.headers)
    responseHeaders.set("Access-Control-Allow-Origin", "*")

    return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
    })
}