import { getCollection, type CollectionEntry } from "astro:content"
import { getImage } from "astro:assets"
import type { ResourceTag } from "./tags"

export type ResourceListItem = {
    id: string
    path: string
    title: string
    description?: string
    tag: ResourceTag
    date?: Date
    image?: string
}

const resourcePath = (entry: CollectionEntry<"resources">) =>
    entry.data.href ?? `/resources/${entry.data.tag}/${entry.id}`

export async function loadResources(): Promise<{ items: ResourceListItem[] }> {
    const entries = (await getCollection("resources")).sort((a, b) => {
        const da = a.data.date?.getTime() ?? 0
        const db = b.data.date?.getTime() ?? 0
        if (da !== db) return db - da
        return a.data.title.localeCompare(b.data.title)
    })

    const items = await Promise.all(
        entries.map(async (entry) => {
            const image = entry.data.image
                ? await getImage({
                      src: entry.data.image,
                      format: "webp",
                      width: 800,
                  })
                : null
            return {
                id: entry.id,
                path: resourcePath(entry),
                title: entry.data.title,
                description: entry.data.description,
                tag: entry.data.tag,
                date: entry.data.date,
                image: image?.src,
            } satisfies ResourceListItem
        }),
    )

    return { items }
}
