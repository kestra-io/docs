import type { APIRoute } from "astro"

// SSR at runtime — when prerendered, Astro converts 301 responses into a
// meta-refresh HTML page (200), defeating the redirect.
export const prerender = false

export const GET: APIRoute = () => {
    return new Response(null, {
        status: 301,
        headers: {
            Location: "/sitemap/index.xml",
        },
    })
}
