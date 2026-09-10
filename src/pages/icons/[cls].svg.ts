// do not prerender icons there are too many of them and are updated frequently
export const prerender = false

import { $fetchApiRawCached } from "~/utils/fetch.ts"
import { optimizeSvgIcon } from "~/utils/svgo"

// The API answers with a blank sheet for any type it cannot resolve, and gives no other signal that
// it did. Icons resolve against the running Kestra, so anything renamed or removed since the current
// release gets it, which on an archived page is a real task with no icon. Ask for a type that can
// never exist to learn what that blank sheet is, rather than keeping a copy of it here.
const UNRESOLVABLE_TYPE = "io.kestra.plugin.unresolvable"

async function fetchIcon(type: string): Promise<string | null> {
    const response = await $fetchApiRawCached(`/plugins/icons/${type}`)
    return response.ok ? await response.text() : null
}

/** Memoised per isolate: the answer only changes when the API is redeployed. */
let blankIcon: string | null | undefined

async function fetchBlankIcon(): Promise<string | null> {
    if (blankIcon === undefined) {
        blankIcon = await fetchIcon(UNRESOLVABLE_TYPE)
    }
    return blankIcon
}

/** "io.kestra.plugin.core.flow.ForEach" -> "io.kestra.plugin.core.flow", the subgroup. */
function packageOf(cls: string): string | undefined {
    const outer = cls.split("$")[0]
    const lastDot = outer.lastIndexOf(".")
    return lastDot < 0 ? undefined : outer.slice(0, lastDot)
}

export async function GET({ params }: { params: { cls: string } }) {
    const clsComplete = params.cls
    const [cls, modifier] = clsComplete.split("-")

    let icon = await fetchIcon(cls)

    if (icon === null) {
        throw new Error("Failed to fetch icon")
    }

    // Fall back to the subgroup so an archived page shows the Flow icon rather than a blank sheet.
    const pkg = packageOf(cls)
    if (pkg) {
        const blank = await fetchBlankIcon()
        if (blank !== null && icon === blank) {
            const subGroupIcon = await fetchIcon(pkg)
            if (subGroupIcon !== null && subGroupIcon !== blank) {
                icon = subGroupIcon
            }
        }
    }

    const svg = optimizeSvgIcon(icon, "cls")

    // replace all currentColor with the specified modifier if provided
    const modifiedSvg = modifier ? svg.replace(/currentColor/g, modifier) : svg

    return new Response(modifiedSvg, {
        headers: {
            "Content-Type": "image/svg+xml",
            // Icons are keyed by a stable, per-plugin-class URL (a new plugin
            // gets a new URL, it never mutates an existing one), so they can be
            // cached "forever". This stops Googlebot from re-crawling the plugin
            // SVGs on every visit, they were ~40% of the crawl budget at 24h.
            "Cache-Control": "public, max-age=31536000, immutable",
        },
    })
}
