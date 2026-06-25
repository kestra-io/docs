import type { APIRoute } from "astro"
import { retrieveRepoReleases } from "~/utils/plugins/repoReleases"

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
    const data = await retrieveRepoReleases(params.repo ?? "kestra")
    return new Response(JSON.stringify(data), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=86400",
        },
    })
}
