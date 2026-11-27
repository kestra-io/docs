import type { APIRoute } from "astro"
import { getImage } from "astro:assets"
import { getCollection } from "astro:content"
import { categoryMap } from "~/components/blogs/categories"
import TeamsImages from "~/utils/teamsImages"
import type { BlogEntry } from "~/utils/search/blogs"
import { markdownHeadings } from "~/utils/search/markdownHeadings"

export const prerender = true

export const GET: APIRoute = async () => {
    const posts = await getCollection("blogs", ({ data }) => !data.lang)

    const entries: BlogEntry[] = await Promise.all(
        posts.map(async (post) => {
            const {
                title,
                description,
                date,
                category,
                image,
                author,
                authors,
            } = post.data
            const body = post.body ?? ""
            const people = authors?.length ? authors : author ? [author] : []
            return {
                id: post.id.toLowerCase(),
                title,
                description: description ?? "",
                date: date.toISOString(),
                category: categoryMap[category] ?? category,
                authors: await Promise.all(
                    people.map(async (person) => {
                        const photo = TeamsImages[`${person.image}-sm.png`]
                        return {
                            name: person.name,
                            role: person.role ?? undefined,
                            avatar: photo
                                ? (await getImage({ src: photo, width: 64 }))
                                      .src
                                : undefined,
                        }
                    }),
                ),
                thumb: image
                    ? (
                          await getImage({
                              src: image,
                              width: 240,
                              format: "webp",
                          })
                      ).src
                    : undefined,
                cover: image
                    ? (
                          await getImage({
                              src: image,
                              width: 720,
                              format: "webp",
                          })
                      ).src
                    : undefined,
                headings: markdownHeadings(body),
                minutes: Math.max(
                    1,
                    Math.round(body.split(/\s+/).length / 230),
                ),
            }
        }),
    )

    return new Response(JSON.stringify(entries), {
        headers: { "Content-Type": "application/json" },
    })
}
