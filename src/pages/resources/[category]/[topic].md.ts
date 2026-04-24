import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

export async function getStaticPaths() {
    const all = await getCollection("resources")
    return all
        .filter((post) => !post.data.href)
        .map((post) => ({
            params: { category: post.data.tag, topic: post.id },
            props: { title: post.data.title, source: post.body },
        }))
}

export const GET: APIRoute = ({ props }) => {
    return new Response(`# ${props.title}\n\n${props.source}`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
