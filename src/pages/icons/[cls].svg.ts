// do not prerender icons there are too many of them and are updated frequently
export const prerender = false

import { API_URL } from "astro:env/client"
import { optimizeSvgIcon } from "~/utils/svgo"

export async function GET({ params }: { params: { cls: string } }) {
    const clsComplete = params.cls
    const [cls,modifier] = clsComplete.split("-")
    const response = await fetch(`${API_URL}/plugins/icons/${cls}`)

    if (!response.ok) {
        throw new Error("Failed to fetch icon")
    }

    const svg = optimizeSvgIcon(await response.text(), clsComplete)

    // replace all currentColor with the specified modifier if provided
    const modifiedSvg = modifier ? svg.replace(/currentColor/g, modifier) : svg

    return new Response(modifiedSvg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "max-age=86400",
        },
    })
}