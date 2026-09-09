import { generate } from "~/utils/ogImage.ts"
import { $fetchApiCached } from "~/utils/fetch.ts"
import type { Plugin } from "~/utils/plugins/plugin"

export const prerender = false

export async function GET({ request, params }: { request: any; params: { name: string } }) {
    const name = params.name
    const pluginsData = await $fetchApiCached<Plugin[]>(`/plugins/subgroups`)
    const metadata = await $fetchApiCached(`/plugins/plugin-${name}`)
    const plugin = pluginsData.filter((p) => p.name === "plugin-" + name)[0]

    const category = "Plugins"
    const title = plugin.title
    const description = plugin.description
    const image = metadata.icon

    const svgString = generate(request, category as string, title as string, image, description)

    return new Response(svgString, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400",
        },
    })
}