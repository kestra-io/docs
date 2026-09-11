import type { APIRoute } from "astro"
import { versionedSpecSourceUrl, type SpecEdition } from "~/utils/versionedDocs"

export const prerender = false

// Serves the OpenAPI spec an archived docs version shipped with, so
// /docs/1.3/api-reference/* documents 1.3 rather than the spec in public/.
// Proxied rather than linked straight at GitHub: raw.githubusercontent caps
// caching at five minutes, and these specs never change once released.
export const GET: APIRoute = async ({ params }) => {
    const edition = params.edition
    if (edition !== "oss" && edition !== "ee") {
        return new Response("Unknown spec edition", { status: 404 })
    }

    const source = versionedSpecSourceUrl(params.version ?? "", edition as SpecEdition)
    if (!source) {
        return new Response("Unknown docs version", { status: 404 })
    }

    const upstream = await fetch(source)
    if (!upstream.ok) {
        // Never fall back to the current spec: a wrong-but-rendered API
        // reference is the failure this route exists to remove.
        return new Response(`No spec published for this version`, {
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
