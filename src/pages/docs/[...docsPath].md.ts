import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

const API_MD_REDIRECTS: Record<string, string> = {
    "api-reference/open-source": "/api-reference/kestra.md",
    "api-reference/enterprise": "/api-reference/kestra-ee.md",
}

export async function getStaticPaths() {
    const docsPages = await getCollection("docs")
    return docsPages.map((doc) => ({
        params: { docsPath: doc.id },
        props: {
            title: doc.data.title,
            source: doc.body,
        },
    }))
}

/**
 * respond with the raw markdown content of the doc page.
 * to be used by AI or other tools that want to consume the markdown content directly.
 */
export const GET: APIRoute = ({ params, props, redirect }) => {
    const redirectTarget = API_MD_REDIRECTS[params.docsPath as string]
    if (redirectTarget) {
        return redirect(redirectTarget, 301)
    }

    return new Response(`# ${props.title}\n\n${props.source}`, {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
        },
    })
}
