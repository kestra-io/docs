import { SUB_CATEGORY_TAG_NAMES } from "~/utils/blueprints/subCategories"

export const SOLUTIONS_TAG = "Solutions Engineering"

const HIDDEN_TAGS = new Set([
    "System",
    "Getting Started",
    SOLUTIONS_TAG,
    ...SUB_CATEGORY_TAG_NAMES,
])

export function visibleTags<T extends { name: string }>(tags: T[]): T[] {
    return tags.filter((t) => !HIDDEN_TAGS.has(t.name))
}
