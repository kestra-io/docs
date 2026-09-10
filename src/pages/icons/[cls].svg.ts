// do not prerender icons there are too many of them and are updated frequently
export const prerender = false

import { $fetchApiRawCached } from "~/utils/fetch.ts"
import { optimizeSvgIcon } from "~/utils/svgo"

// Path from DEFAULT_ICON in api.kestra.io PluginController, the blank sheet it serves for any type
// it cannot resolve. Icons resolve against the running Kestra, so anything renamed or removed since
// the current release gets it, which on an archived page is a real task with no icon. The response
// carries no other signal that it is a fallback, so matching the path is the only way to spot one.
// If DEFAULT_ICON ever changes there, this stops matching and blanks come back.
const PLACEHOLDER_PATH = "M288 32H0v448h384V128l-96-96z"

async function fetchIcon(type: string): Promise<string | null> {
    const response = await $fetchApiRawCached(`/plugins/icons/${type}`)
    return response.ok ? await response.text() : null
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
    let isPlaceholder = icon.includes(PLACEHOLDER_PATH)
    if (isPlaceholder) {
        const pkg = packageOf(cls)
        const subGroupIcon = pkg ? await fetchIcon(pkg) : null
        if (subGroupIcon && !subGroupIcon.includes(PLACEHOLDER_PATH)) {
            icon = subGroupIcon
            isPlaceholder = false
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
            // A placeholder is the exception: it stops being the answer the moment
            // the class resolves, so it must not be pinned for a year.
            "Cache-Control": isPlaceholder
                ? "public, max-age=3600"
                : "public, max-age=31536000, immutable",
        },
    })
}
