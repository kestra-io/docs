import type { CardPlugin } from "~/utils/plugins/pruneForClient"
import { includesAll, searchTokens } from "~/utils/search/matching"

const SEARCHABLE_FIELDS = ["title", "description", "name", "classes"] as const

const isStrongMatch = (plugin: CardPlugin, tokens: string[]) =>
    includesAll(plugin.name, tokens) || includesAll(plugin.title, tokens)

export const filterPluginsBySearch = <T extends CardPlugin>(
    plugins: T[],
    query: string,
) => {
    const tokens = searchTokens(query)
    if (!tokens.length) return plugins

    return plugins
        .filter((p) => SEARCHABLE_FIELDS.some((f) => includesAll(p[f], tokens)))
        .sort((a, b) => {
            const aStrong = isStrongMatch(a, tokens)
            const bStrong = isStrongMatch(b, tokens)
            if (aStrong !== bStrong) return aStrong ? -1 : 1
            return 0
        })
}

export const sortPlugins = <T extends CardPlugin>(
    plugins: T[],
    sort: string,
    query: string,
) => {
    const tokens = searchTokens(query)

    return [...plugins].sort((a, b) => {
        if (query) {
            const aStrong = isStrongMatch(a, tokens)
            const bStrong = isStrongMatch(b, tokens)
            if (aStrong !== bStrong) return aStrong ? -1 : 1
        }

        if (sort === "newest") {
            const aDate = a.lastReleasedAt
                ? new Date(a.lastReleasedAt).getTime()
                : 0
            const bDate = b.lastReleasedAt
                ? new Date(b.lastReleasedAt).getTime()
                : 0
            if (aDate !== bDate) return bDate - aDate
        } else if (sort === "most-used") {
            const bCmp = (b.usageCount ?? 0) - (a.usageCount ?? 0)
            if (bCmp !== 0) return bCmp
        } else {
            const aCore = a.group === "io.kestra.plugin.core" && !a.subGroup
            const bCore = b.group === "io.kestra.plugin.core" && !b.subGroup
            if (aCore !== bCore) return aCore ? -1 : 1
        }

        const comparison = a.title
            .toLowerCase()
            .localeCompare(b.title.toLowerCase())
        return sort === "Z-A" ? -comparison : comparison
    })
}
