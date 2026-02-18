// do not prerender icons there are too many of them and are updated frequently
export const prerender = false

import { API_URL } from "astro:env/client"
import { optimize } from "svgo"

export async function GET({ params }: { params: { cls: string } }) {
    const cls = params.cls
    const response = await fetch(`${API_URL}/plugins/icons/${cls}`)

    if (!response.ok) {
        throw new Error("Failed to fetch icon")
    }

    const svg = optimize(await response.text(), {
        plugins: [
            "preset-default",
            {
                name: "removeUnknownsAndDefaults",
                params: {
                    keepDataAttrs: false,
                },
            }
        ]
    }).data
    const modifiedSvg = svg.replace(/currentColor/g, "black")

    return new Response(modifiedSvg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "max-age=86400",
        },
    })
}