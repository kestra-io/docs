// do not prerender icons there are too many of them and are updated frequently
import { $fetchApiRawCached } from "~/utils/fetch.ts"

export const prerender = false

import { optimizeSvgIcon } from "~/utils/svgo"

export async function GET({ params }: { params: { cls: string } }) {
    const clsComplete = params.cls
    const [cls, modifier] = clsComplete.split("-")
    const response = await $fetchApiRawCached(`/plugins/icons/${cls}`)

    if (!response.ok) {
        throw new Error("Failed to fetch icon")
    }

    const svg = await optimizeSvgIcon(await response.text(), "cls")

    // replace all currentColor with the specified modifier if provided
    const modifiedSvg = modifier ? svg.replace(/currentColor/g, modifier) : svg

    return new Response(modifiedSvg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=86400",
        },
    })
}
