import { CATEGORY_TILE_META } from "~/utils/blueprints/categoryMeta"
import { PATTERN_TAGS } from "~/utils/blueprints/useCaseTags"

const FALLBACK_ICON = "mdi:tag-outline"

export function tagIconFor(name: string): string {
    const category = CATEGORY_TILE_META.find((c) => c.name === name)
    if (category) return category.icon

    const pattern = PATTERN_TAGS.find((p) => p.name === name)
    if (pattern) return pattern.icon

    return FALLBACK_ICON
}
