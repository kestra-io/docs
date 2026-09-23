import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { authorMarkdown } from "~/components/unified-orchestration-whitepaper/author"

// Markdown variant of the unified orchestration whitepaper page, mirroring the
// per-topic endpoint in resources/[category]/[topic].md.ts. The entry sets
// `href`, which excludes it from that route, so it needs its own endpoint.
export const GET: APIRoute = async () => {
    const post = await getEntry("resources", "unified-orchestration-whitepaper")
    if (!post) return new Response("Not found", { status: 404 })
    const { title, author, description } = post.data
    const byline = author ? `**Whitepaper · By ${author}**\n\n` : ""
    const intro = description ? `${description}\n\n` : ""
    const body = `${(post.body ?? "").trimEnd()}\n\n${authorMarkdown()}\n`
    return new Response(`# ${title}\n\n${byline}${intro}${body}`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
