export const prerender = false

import type { APIRoute } from "astro"

export const ALL: APIRoute = async ({ request }) => {
    const proxyDomain = new URL("https://eu.posthog.com/")
    const requestUrl = new URL(request.url)
    const proxyUrl = new URL(requestUrl.pathname, proxyDomain)

    const response = await fetch(proxyUrl.href, request)
    return new Response(response.body, {
        headers: response.headers
    })
}