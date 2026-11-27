import type { ElementPreview } from "~/utils/plugins/pluginElementsPreview"
import type { CardPlugin } from "~/utils/plugins/pruneForClient"
import {
    formatCategoryName,
    formatElementName,
} from "~/utils/plugins/pluginUtils"
import {
    filterPluginsBySearch,
    sortPlugins,
} from "~/utils/plugins/searchPlugins"
import type { SearchResult } from "~/utils/searchResults"
import { $fetch } from "~/utils/fetch"
import { loadOnce } from "~/utils/search/loaders"
import { MAX_RESULTS } from "~/utils/search/matching"

export type PluginSearchCard = CardPlugin & { elements?: ElementPreview[] }

export interface PluginSearchResult extends SearchResult {
    plugin: {
        icon: string
        subgroup: boolean
        isEnterprise: boolean
        categories: string[]
        description: string
        elementCounts: number
        blueprints: number
        elements: (ElementPreview & { items: { name: string }[] })[]
    }
}

export const loadPluginsIndex = loadOnce(() =>
    $fetch<PluginSearchCard[]>("/api/plugins-search"),
)

export const pluginIcon = (card: Pick<CardPlugin, "className">) =>
    card.className ? `/icons/${card.className}.svg` : "/icon.svg"

const toResult = (card: PluginSearchCard): PluginSearchResult => ({
    url: (card.href ?? `/plugins/${card.name}`).replace(/^\//, ""),
    type: "PLUGINS",
    title: card.title.replace(/\s*\(EE\)\s*$/i, ""),
    plugin: {
        icon: pluginIcon(card),
        subgroup: Boolean(card.subGroup),
        isEnterprise: card.isEnterprise ?? false,
        categories: (card.categories ?? []).map(formatCategoryName),
        description: card.description ?? "",
        elementCounts: card.elementCounts ?? 0,
        blueprints: card.blueprints ?? 0,
        elements: (card.elements ?? []).map((group) => ({
            ...group,
            items: group.items.map((item) => ({
                ...item,
                name: formatElementName(item.cls),
            })),
        })),
    },
})

export function pluginsSearchResults(
    cards: PluginSearchCard[],
    query: string,
    limit = MAX_RESULTS,
) {
    const matches = sortPlugins(
        filterPluginsBySearch(cards, query),
        "most-used",
        query,
    )
    return {
        total: matches.length,
        results: matches.slice(0, limit).map(toResult),
    }
}
