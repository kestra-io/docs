import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

export async function getStaticPaths() {
    const blogsPages = await getCollection("blogs")
    return blogsPages.map((post) => ({
        params: { slug: post.id },
        props: {
            title: post.data.title,
            source: post.body,
        },
    }))
}

/**
 * respond with the raw markdown content of the blog post.
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
