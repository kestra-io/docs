import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { generateApiMarkdown } from "~/utils/openapi-to-markdown"

const API_MD_SPECS: Record<string, string> = {
    "api-reference/open-source": "kestra.yml",
    "api-reference/enterprise": "kestra-ee.yml",
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
export const GET: APIRoute = async ({ params, props }) => {
    const specFile = API_MD_SPECS[params.docsPath as string]
    if (specFile) {
        const markdown = await generateApiMarkdown(specFile)
        return new Response(markdown, {
            status: 200,
            headers: {
                "Content-Type": "text/markdown; charset=utf-8",
                "Cache-Control": "public, max-age=3600",
            },
        })
    }

    return new Response(`# ${props.title}\n\n${props.source}`, {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
        },
    })
}
