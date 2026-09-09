import { generate } from "~/utils/ogImage.ts"
import { $fetchApiCached } from "~/utils/fetch.ts"
import type { PluginMetadata } from "~/utils/plugins/plugin"

export const prerender = false

export async function GET({ request, params }: { request: any; params: { cls: string } }) {
    const cls = params.cls
    if (!cls || cls === "undefined" || cls === "null") {
        return new Response("Not found", { status: 404 })
    }

    let metadata: PluginMetadata
    try {
        metadata = await $fetchApiCached<PluginMetadata>(`/plugins/metadata/group/${cls}`)
    } catch {
        return new Response("Not found", { status: 404 })
    }

    if (!metadata?.title) {
        return new Response("Not found", { status: 404 })
    }

    const svgString = generate(request, "Plugins", metadata.title, metadata.icon, metadata.description)

    return new Response(svgString, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400",
        },
    })
}