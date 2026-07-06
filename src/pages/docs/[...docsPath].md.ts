import type { APIRoute } from "astro"
import { getEntry } from "astro:content"

/**
 * Respond with the raw markdown content of a doc page.
 * To be used by AI or other tools that want to consume the markdown content directly.
 * The index page (/docs.md) is handled by the dedicated docs.md.ts endpoint.
 */
export const GET: APIRoute = async ({ params }) => {
    const docsPath = params.docsPath

    if (!docsPath) {
        return new Response("Not found", { status: 404 })
    }

    const doc = await getEntry("docs", docsPath)
    if (!doc) {
        return new Response("Not found", { status: 404 })
    }

    return new Response(`# ${doc.data.title}\n\n${doc.body}`, {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
        },
    })
}
