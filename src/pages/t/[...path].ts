export const prerender = false

import type { APIRoute } from "astro"

export const ALL: APIRoute = async ({ request, clientAddress }) => {
    const proxyDomain = new URL("https://eu.i.posthog.com/")
    const staticProxyDomain = new URL("https://eu-assets.i.posthog.com/static/")
    const requestUrl = new URL(request.url)
    const realUrl = requestUrl.pathname.substring(2, requestUrl.pathname.length)

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
    ]

    for (const [key, value] of Object.entries(request.headers)) {
        if (value && !excludedHeaders.includes(key.toLowerCase())) {
            headers.set(key, value)
        }
    }

    // Forward client IP for geolocation
    const clientIp =
        request.headers.get("x-real-ip") ||
        request.headers.get("x-forwarded-for") ||
        clientAddress

    if (clientIp) {
        headers.set("x-forwarded-for", clientIp)
    }

    const response = await fetch(proxyUrl.href, request);

    return new Response(response.body, {
        headers: headers,
    })
}