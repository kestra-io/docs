// Single lookup for "what icon represents this tag pill" across both tag
// axes (vertical category, use-case pattern), so card tag badges and filter
// chips render the same icon regardless of which axis the tag belongs to.
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
