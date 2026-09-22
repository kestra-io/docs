import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { resourceTabs, ALL_RESOURCES } from "~/components/resources/tags"
import { entryCacheKey } from "~/utils/incrementalCacheKey"

// Markdown variant of a hub page (a resources entry whose `href` is
// `/resources/<tag>`), mirroring resources/[category]/[topic].md.ts. Such an
// entry is excluded from that route by its `href`, so it needs this one.
export async function getStaticPaths() {
    const all = await getCollection("resources")
    return Array.from(resourceTabs.keys())
        .filter((tag) => tag !== ALL_RESOURCES)
        .flatMap((tag) => {
            const hub = all.find((post) => post.data.href === `/resources/${tag}`)
            if (!hub) return []
            return [{
                params: { tag },
                props: { title: hub.data.title, source: hub.body },
                cacheKey: entryCacheKey(hub),
            }]
        })
}

export const GET: APIRoute = ({ props }) => {
    return new Response(`# ${props.title}\n\n${props.source}`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
