const HIDDEN_TAGS = new Set(["System", "Getting Started"])

export function visibleTags<T extends { name: string }>(tags: T[]): T[] {
    return tags.filter((t) => !HIDDEN_TAGS.has(t.name))
}
