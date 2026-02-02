export const prerender = false

import type { APIRoute } from "astro"

const proxyDomain = new URL("https://eu.posthog.com/")
const staticProxyDomain = new URL("https://eu-assets.i.posthog.com/static/")

export const ALL: APIRoute = async ({ request, clientAddress }) => {
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

    return new Response(response.body, {
        headers: response.headers,
    })
}