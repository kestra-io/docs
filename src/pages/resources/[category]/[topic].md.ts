import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { mdxToMarkdown } from "~/components/vra-migration-guide/mdxToMarkdown"
import { entryCacheKey } from "~/utils/incrementalCacheKey"
import {
    fetchTotalPluginsCount,
    pluginCountScope,
    replaceTotalPluginsPlaceholder,
} from "~/utils/plugins/pluginCount"

export async function getStaticPaths() {
    const all = await getCollection("resources")
    const totalPlugins = await fetchTotalPluginsCount()
    return all
        .filter((post) => !post.data.href)
        .map((post) => {
            const source = replaceTotalPluginsPlaceholder(post.body ?? "", totalPlugins)
            return {
                params: { category: post.data.tag, topic: post.id },
                props: {
                    title: post.data.title,
                    // MDX bodies carry imports, exports and component tags.
                    source: post.filePath?.endsWith(".mdx") ? mdxToMarkdown(source) : source,
                },
                cacheKey: entryCacheKey(post, ...pluginCountScope(totalPlugins, post.body)),
            }
        })
}

export const GET: APIRoute = ({ props }) => {
    return new Response(`# ${props.title}\n\n${props.source}`, {
        status: 200,
        headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
}
