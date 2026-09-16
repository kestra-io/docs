import type { APIRoute } from "astro"
import { getEntry } from "astro:content"

// Markdown variant of the Airflow 2 EOL whitepaper page, mirroring the
// per-topic endpoint in resources/[category]/[topic].md.ts. The entry sets
// `href`, which excludes it from that route, so it needs its own endpoint.
export const GET: APIRoute = async () => {
    const post = await getEntry("resources", "airflow-2-eol-whitepaper")
    if (!post) return new Response("Not found", { status: 404 })
    return new Response(`# ${post.data.title}\n\n${post.body}`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
