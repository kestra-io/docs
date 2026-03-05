import type { APIRoute } from "astro"
import { getImage } from "astro:assets"
import { getCollection } from "astro:content"

export const prerender = false

export const GET: APIRoute = async ({ request }) => {
    const origin = new URL(request.url).origin
    const entries = await getCollection("feeds")

    const top10 = entries
        .sort((a, b) => b.data.publicationDate.getTime() - a.data.publicationDate.getTime())
        .slice(0, 10)

    const feeds = await Promise.all(
        top10.map(async (entry) => {
            let image: string | null = null
            if (entry.data.image) {
                const processed = await getImage({ src: entry.data.image, width: 600 })
                image = origin + processed.src
            }
            return {
                id: entry.id,
                title: entry.data.title,
                description: entry.body ?? null,
                link: entry.data.link,
                href: entry.data.href,
                image,
                publicationDate: entry.data.publicationDate,
                addedDate: entry.data.addedDate,
            }
        }),
    )

    return new Response(JSON.stringify(feeds), {
        headers: {
            "Content-Type": "application/json",
        },
    })
}
