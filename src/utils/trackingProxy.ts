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

const excludedHeaders = [
    "host",
    "connection",
    "content-length",
    "transfer-encoding",
    "accept-encoding",
    "cookie",
]

// Proxies a /t/* request to PostHog. Kept runtime-agnostic so it can run both
// from the Cloudflare worker (prod) and the Astro route (dev). It MUST run in
// the worker before Astro handles the request: `trailingSlash: "never"` would
// otherwise 301 the trailing slash posthog-js sends (e.g. /t/i/v0/e/), and that
// redirect carries no CORS header, breaking cross-origin callers.
export async function proxyTracking(request: Request, clientAddress?: string): Promise<Response> {
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
        redirect: request.redirect,
    })

    const response = await fetch(forwardedRequest)

    // Force a single, well-defined ACAO and drop allow-credentials so it stays
    // valid alongside the wildcard.
    const responseHeaders = new Headers(response.headers)
    responseHeaders.set("Access-Control-Allow-Origin", "*")
    responseHeaders.delete("Access-Control-Allow-Credentials")

    return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
    })
}
