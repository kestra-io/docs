import loadDocsMetadata from "~/utils/loadDocsMetadata"
import { generate } from "~/utils/ogImage.ts"

export const prerender = false

export async function GET({ request, params }: { request: any; params: { path: string } }) {
    const docsMetadata = await loadDocsMetadata()
    const path = params.path
    const entry = docsMetadata.find((doc) => doc.id === `/${path}`)

    if (entry === undefined) {
        return new Response("", {
            status: 301,
            headers: {
                Location: "/og-image.png",
            },
        })
    }

    const svgString = generate(request, "Documentation", entry.data.title, entry.data.icon)

    return new Response(svgString, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "max-age=86400",
        },
    })
}