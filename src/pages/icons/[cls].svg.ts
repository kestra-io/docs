// do not prerender icons there are too many of them and are updated frequently
export const prerender = false

import { API_URL } from "astro:env/client"

export async function GET({ params }: { params: { cls: string } }) {
    const cls = params.cls
    const response = await fetch(`${API_URL}/plugins/icons/${cls}`)

    if (!response.ok) {
        throw new Error("Failed to fetch icon")
    }

    const svg = await response.text()
    const modifiedSvg = svg.replace(/currentColor/g, "white")

    return new Response(modifiedSvg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "max-age=86400",
        },
    })
}