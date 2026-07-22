import { getImage } from "astro:assets"
import main from "~/components/blueprints/assets/bar-bg.png"
import ai from "~/components/blueprints/assets/bar-bg-ai.png"
import business from "~/components/blueprints/assets/bar-bg-business.png"
import cloud from "~/components/blueprints/assets/bar-bg-cloud.png"
import core from "~/components/blueprints/assets/bar-bg-core.png"
import data from "~/components/blueprints/assets/bar-bg-data.png"
import infrastructure from "~/components/blueprints/assets/bar-bg-infrastructure.png"

const CATEGORY_SOURCES: Record<string, ImageMetadata> = {
    ai,
    business,
    cloud,
    core,
    data,
    infrastructure,
}

/**
 * Resolve a blueprint banner to an optimized WebP URL.
 *
 * The banner is consumed via a `background-image: url(...)` inline style in
 * BlueprintHero, so a bare `.src` import never passes through Astro's image
 * optimizer and would ship the full-size source PNG. getImage() emits a WebP
 * while the PNG stays the source of truth. (Returns the original when the image
 * service is `passthrough`, e.g. the NO_IMAGE_OPTIM Lighthouse build.)
 *
 * Call from page frontmatter — a render context — rather than at module scope,
 * so it stays safe under SSR.
 */
export async function bannerForCategory(slug?: string): Promise<string> {
    const source = (slug && CATEGORY_SOURCES[slug]) || main
    return (await getImage({ src: source, format: "webp" })).src
}
