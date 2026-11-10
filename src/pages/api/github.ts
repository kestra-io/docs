import type { APIRoute } from "astro"
import { loadGithubRepoStats } from "~/utils/githubRepoStats"

export const prerender = false

export const GET: APIRoute = async ({ locals }) => {
    const stats = await loadGithubRepoStats(locals)

    if (!stats) {
        return new Response(JSON.stringify({ error: "unavailable" }), {
            status: 503,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
        })
    }

    return new Response(JSON.stringify(stats), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300",
        },
    })
}
