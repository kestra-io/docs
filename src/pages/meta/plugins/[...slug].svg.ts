import { generate } from "~/utils/ogImage.ts"
import { $fetch } from "~/utils/fetch.ts"
import type { JSONSchema } from "@kestra-io/ui-libs"
import { API_URL } from "astro:env/client"
import { formatElementName } from "~/utils/pluginUtils.ts"

export const prerender = false

export async function GET({ request, params }: { request: any; params: { slug: string } }) {
    const cls = params.slug

    const metadata = await $fetch<{ markdown: string; schema: JSONSchema }>(
        `${API_URL}/plugins/definitions/${cls}`,
    )

    const category = "Plugins"
    const title = formatElementName(cls)
    const description = metadata.schema.properties?.title
    const image = "/icons/" + cls + ".svg"

    const svgString = generate(request, category as string, title as string, image, description)

    return new Response(svgString, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "max-age=86400",
        },
    })
}