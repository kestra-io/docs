import type { APIRoute, GetStaticPaths } from "astro"
import { getCollection } from "astro:content"
import { generateBlogPlaceholder } from "~/utils/blogPlaceholderImage"

// Generated cover images for blog posts published without a frontmatter
// `image`. Prerendered at build time; posts that ship their own image get
// no route here.

export const prerender = true

export const getStaticPaths = (async () => {
    const blogs = await getCollection("blogs", (post) => !post.data.image)
    return blogs.map((post) => ({
        params: { slug: post.id.toLowerCase() },
        props: post,
    }))
}) satisfies GetStaticPaths

export const GET: APIRoute = async ({ props }) => {
    const { title, category, date, author, authors } = props.data
    const webp = await generateBlogPlaceholder({
        title,
        category,
        date,
        authors: authors ?? (author ? [author] : []),
    })
    return new Response(new Uint8Array(webp), {
        headers: {
            "Content-Type": "image/webp",
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    })
}
