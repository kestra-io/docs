import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { entryCacheKey } from "~/utils/incrementalCacheKey"

export async function getStaticPaths() {
    const docsPages = await getCollection("docs")
    return docsPages.map((doc) => ({
        params: { docsPath: doc.id },
        props: {
            title: doc.data.title,
            source: doc.body,
        },
        cacheKey: entryCacheKey(doc),
    }))
}

/**
 * respond with the raw markdown content of the doc page.
 * to be used by AI or other tools that want to consume the markdown content directly.
 */
export const GET: APIRoute = ({ props }) => {
    return new Response(`# ${props.title}\n\n${props.source}`, {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
        },
    })
}
