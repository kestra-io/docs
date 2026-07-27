import type { APIRoute } from "astro"
import { getEntry } from "astro:content"

/**
 * Serves the docs index page (`/docs`) as raw Markdown at `/docs.md`.
 *
 * The catch-all route `docs/[...docsPath].md.ts` handles `/docs/{slug}.md`
 * but cannot produce `/docs.md` (which sits one level above the `docs/`
 * directory). This dedicated endpoint fills that gap so that the
 * "View as Markdown" action on the Welcome / index page resolves correctly
 * instead of returning a 404.
 */
export const GET: APIRoute = async () => {
    const doc = await getEntry("docs", "<index>")
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
