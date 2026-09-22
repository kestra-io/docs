import type { APIRoute } from "astro"
import { getEntry } from "astro:content"

// Markdown variant of the unified orchestration whitepaper page, mirroring the
// per-topic endpoint in resources/[category]/[topic].md.ts. The entry sets
// `href`, which excludes it from that route, so it needs its own endpoint.
export const GET: APIRoute = async () => {
    const post = await getEntry("resources", "unified-orchestration-whitepaper")
    if (!post) return new Response("Not found", { status: 404 })
    const { title, author, description } = post.data
    const byline = author ? `**Whitepaper · By ${author}**\n\n` : ""
    const intro = description ? `${description}\n\n` : ""
    return new Response(`# ${title}\n\n${byline}${intro}${post.body}`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
