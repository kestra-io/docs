import type { APIRoute } from "astro"
import { API_URL } from "astro:env/client"
import { versionedSpecSourceUrl } from "~/utils/versionedDocs"

export const prerender = false

// Serves the OpenAPI spec an archived docs version shipped with, so
// /docs/1.3/api-reference/* documents 1.3 rather than the spec in public/.
// Proxied rather than fetched by RapiDoc itself: the docs API only allows the
// production origin, and archived specs never change, so they cache here.
export const GET: APIRoute = async ({ params }) => {
    const edition = params.edition
    if (edition !== "oss" && edition !== "ee") {
        return new Response("Unknown spec edition", { status: 404 })
    }

    const source = versionedSpecSourceUrl(API_URL, params.version ?? "", edition)
    if (!source) {
        return new Response("Unknown docs version", { status: 404 })
    }

    let upstream: Response
    try {
        // Edge-cached, not just browser-cached: an archived spec is immutable,
        // so this keeps every reader after the first from re-proxying the
        // full (up to ~1.2 MB) body through the worker.
        upstream = await fetch(source, {
            cf: { cacheTtl: 86400, cacheEverything: true },
        } as RequestInit)
    } catch (error) {
        // DNS/connect-reset/subrequest-limit rejects the promise rather than
        // resolving with a bad status — without this, that surfaces to RapiDoc
        // as a 500 HTML error page instead of the 502 below.
        console.error(`Failed to fetch versioned spec ${source}:`, error)
        return new Response("No spec published for this version", { status: 502 })
    }
    if (!upstream.ok) {
        // Never fall back to the current spec: a wrong-but-rendered API
        // reference is the failure this route exists to remove.
        return new Response("No spec published for this version", {
            status: upstream.status === 404 ? 404 : 502,
        })
    }

    return new Response(upstream.body, {
        headers: {
            "Content-Type": "application/yaml; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
        },
    })
}
