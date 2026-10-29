import type { APIRoute } from "astro"
import { getEntry } from "astro:content"
import { buildDocMarkdown } from "~/utils/docMarkdown"
import { resolveDocsPagePath, resolvePageUrl } from "~/utils/markdown-actions"
import { docSourceFile, latestDocLinkResolver } from "~/utils/latestDocLinks"

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

    const url = resolvePageUrl(resolveDocsPagePath(doc.id))
    const resolveLink = doc.filePath
        ? latestDocLinkResolver(url, docSourceFile(doc.filePath))
        : undefined
    const markdown = buildDocMarkdown(
        { title: doc.data.title, h1: doc.data.h1, description: doc.data.description, url },
        doc.body ?? "",
        resolveLink,
    )

    return new Response(markdown, {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
        },
    })
}
