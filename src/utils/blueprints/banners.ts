import main from "~/components/blueprints/assets/bar-bg.png"
import ai from "~/components/blueprints/assets/bar-bg-ai.png"
import business from "~/components/blueprints/assets/bar-bg-business.png"
import cloud from "~/components/blueprints/assets/bar-bg-cloud.png"
import core from "~/components/blueprints/assets/bar-bg-core.png"
import data from "~/components/blueprints/assets/bar-bg-data.png"
import infrastructure from "~/components/blueprints/assets/bar-bg-infrastructure.png"

export const MAIN_BANNER = main.src

export const CATEGORY_BANNERS: Record<string, string> = {
    ai: ai.src,
    business: business.src,
    cloud: cloud.src,
    core: core.src,
    data: data.src,
    infrastructure: infrastructure.src,
}

export function bannerForCategory(slug?: string): string {
    return (slug && CATEGORY_BANNERS[slug]) || MAIN_BANNER
}
