import { SUB_CATEGORY_TAG_NAMES } from "~/utils/blueprints/subCategories"

// Single source of truth for which blueprint tags are shown to visitors.
// "System" carries real blueprints (extend.tags is untouched) but isn't a
// visitor-facing category, so it's excluded here rather than in each caller.
// "Getting Started" is excluded too: it's an onboarding curation (the six
// blueprints in the dedicated top-of-page carousel), not a real content
// domain, so it shouldn't compete with AI/Data/Cloud/etc. as a filterable
// category or show up as a tag pill on individual cards.
// Sub-category tags (VM Provisioning, Day 2 Operations, ...) power the
// nested rows on category pages only, never the top-level surfaces.
const HIDDEN_TAGS = new Set([
    "System",
    "Getting Started",
    ...SUB_CATEGORY_TAG_NAMES,
])

export function visibleTags<T extends { name: string }>(tags: T[]): T[] {
    return tags.filter((t) => !HIDDEN_TAGS.has(t.name))
}
