import { generate } from "~/utils/ogImage.ts"
import { $fetch } from "~/utils/fetch.ts"
import type { PluginMetadata } from "@kestra-io/ui-libs"
import { API_URL } from "astro:env/client"

export const prerender = false

export async function GET({ request, params }: { request: any; params: { cls: string } }) {
    const cls = params.cls
    const metadata = await $fetch<PluginMetadata>(`${API_URL}/plugins/metadata/group/${cls}`)

    const category = "Plugins"
    const title = metadata.title
    const description = metadata.description
    const image = metadata.icon

    const svgString = generate(request, category as string, title as string, image, description)

    return new Response(svgString, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "max-age=86400",
        },
    })
}