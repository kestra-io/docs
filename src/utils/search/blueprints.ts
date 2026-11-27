import { capitalize } from "~/utils/plugins/pluginUtils"
import type { SearchResult } from "~/utils/searchResults"
import { $fetch } from "~/utils/fetch"
import { loadOnce } from "~/utils/search/loaders"
import { includesAll, MAX_RESULTS, searchTokens } from "~/utils/search/matching"
import { pluginIcon, type PluginSearchCard } from "~/utils/search/plugins"

export const ROW_ICONS = 5

// Task classes are stored without the io.kestra.plugin. package, like plugin cards' `classes`.
export type BlueprintEntry = {
    id: string
    title: string
    description: string
    tags: string[]
    tasks: string[]
}

export interface BlueprintSearchResult extends SearchResult {
    blueprint: {
        id: string
        description: string
        tags: string[]
        icons: string[]
        focusTasks: string[]
    }
}

type Popularity = { usage: number; plugin: string }

export const loadBlueprintsIndex = loadOnce(() =>
    $fetch<BlueprintEntry[]>("/api/blueprints-search"),
)

const NOT_A_NAME = new Set([
    "aws",
    "amazon",
    "google",
    "cloud",
    "gcp",
    "azure",
    "microsoft",
    "apache",
    "the",
    "and",
    "for",
    "of",
    "api",
    "ee",
    "plugins",
    "tasks",
])

const words = (text: string) =>
    new Set(text.toLowerCase().match(/[a-z0-9]+/g) ?? [])

const nameWords = (card: PluginSearchCard) =>
    [...words(card.title.replace(/\(.*?\)/g, " "))].filter(
        (word) => word.length > 1 && !NOT_A_NAME.has(word),
    )

const isKestraCore = (card: PluginSearchCard) =>
    card.group === "io.kestra.plugin.core"

const isSupporting = (card: PluginSearchCard) =>
    isKestraCore(card) ||
    (card.categories ?? []).includes("CORE") ||
    /notification/i.test(card.title)

const classIndexes = new WeakMap<
    PluginSearchCard[],
    Map<string, PluginSearchCard>
>()

// Each task class points to the most specific plugin holding it ("AWS Lambda", not "AWS").
function pluginByClass(cards: PluginSearchCard[]) {
    let index = classIndexes.get(cards)
    if (!index) {
        index = new Map()
        const size = (card: PluginSearchCard) =>
            card.classes?.split(" ").length ?? 0
        for (const card of [...cards].sort((a, b) => size(a) - size(b))) {
            for (const cls of card.classes?.split(" ") ?? []) {
                if (cls && !index.has(cls)) index.set(cls, card)
            }
        }
        classIndexes.set(cards, index)
    }
    return index
}

export function blueprintPlugins(
    entry: BlueprintEntry,
    cards: PluginSearchCard[],
) {
    const index = pluginByClass(cards)
    const plugins = [
        ...new Set(
            entry.tasks
                .filter((cls) => !cls.startsWith("ee.assets."))
                .map((cls) => index.get(cls))
                .filter((card): card is PluginSearchCard => card !== undefined),
        ),
    ]
    const candidates =
        [
            plugins.filter((card) => !isSupporting(card)),
            plugins.filter((card) => !isKestraCore(card)),
            plugins,
        ].find((list) => list.length > 0) ?? []
    const titleWords = words(entry.title)
    const named = candidates.find((card) => {
        const name = nameWords(card)
        return name.length > 0 && name.every((word) => titleWords.has(word))
    })
    const main =
        named ??
        [...candidates].sort(
            (a, b) => (a.blueprints ?? 0) - (b.blueprints ?? 0),
        )[0]
    return {
        main,
        named: named !== undefined,
        others: plugins.filter((card) => card !== main && !isKestraCore(card)),
        focusTasks: entry.tasks.filter(
            (cls) => main !== undefined && index.get(cls) === main,
        ),
    }
}

const popularities = new WeakMap<PluginSearchCard[], Map<string, Popularity>>()

// Blueprints carry no usage of their own, so they borrow their main plugin's;
// a helper (Python, Shell) only lends it to blueprints whose title names it.
export function blueprintPopularity(
    entry: BlueprintEntry,
    cards: PluginSearchCard[],
) {
    let cache = popularities.get(cards)
    if (!cache) {
        cache = new Map()
        popularities.set(cards, cache)
    }
    let popularity = cache.get(entry.id)
    if (!popularity) {
        const { main, named } = blueprintPlugins(entry, cards)
        const counts = main !== undefined && (named || !isSupporting(main))
        popularity = {
            usage: counts ? (main.usageCount ?? 0) : 0,
            plugin: counts ? main.title : "",
        }
        cache.set(entry.id, popularity)
    }
    return popularity
}

const byPopularity =
    (popularity: (entry: BlueprintEntry) => Popularity) =>
    (a: BlueprintEntry, b: BlueprintEntry) =>
        popularity(b).usage - popularity(a).usage ||
        a.title.length - b.title.length ||
        a.title.localeCompare(b.title)

// One blueprint per tool, round after round, so no single tool fills the list.
function rotateByPlugin(
    entries: BlueprintEntry[],
    popularity: (entry: BlueprintEntry) => Popularity,
) {
    const queues = new Map<string, BlueprintEntry[]>()
    for (const entry of [...entries].sort(byPopularity(popularity))) {
        const key = popularity(entry).plugin || entry.id
        queues.set(key, [...(queues.get(key) ?? []), entry])
    }
    const rotated: BlueprintEntry[] = []
    for (let round = 0; rotated.length < entries.length; round++) {
        for (const queue of queues.values()) {
            if (queue[round]) rotated.push(queue[round])
        }
    }
    return rotated
}

function rankBlueprints(
    entries: BlueprintEntry[],
    tokens: string[],
    popularity: (entry: BlueprintEntry) => Popularity,
) {
    const tier = (entry: BlueprintEntry) => {
        if (includesAll(entry.title, tokens)) return 3
        return includesAll(`${entry.title} ${entry.tasks.join(" ")}`, tokens)
            ? 2
            : 1
    }
    return entries
        .filter((entry) =>
            includesAll(
                [
                    entry.title,
                    ...entry.tasks,
                    ...entry.tags,
                    entry.description,
                ].join(" "),
                tokens,
            ),
        )
        .map((entry) => ({ entry, tier: tier(entry) }))
        .sort(
            (a, b) =>
                b.tier - a.tier || byPopularity(popularity)(a.entry, b.entry),
        )
        .map(({ entry }) => entry)
}

const toResult = (
    entry: BlueprintEntry,
    cards: PluginSearchCard[],
): BlueprintSearchResult => {
    const { main, others, focusTasks } = blueprintPlugins(entry, cards)
    return {
        url: `blueprints/${entry.id}`,
        type: "BLUEPRINTS",
        title: capitalize(entry.title),
        blueprint: {
            id: entry.id,
            description: entry.description,
            tags: entry.tags.map(capitalize),
            icons: [
                ...new Set([
                    main ? pluginIcon(main) : "/icon.svg",
                    ...others.map(pluginIcon),
                ]),
            ],
            focusTasks,
        },
    }
}

export function blueprintsSearchResults(
    entries: BlueprintEntry[],
    cards: PluginSearchCard[],
    query: string,
) {
    const popularity = (entry: BlueprintEntry) =>
        blueprintPopularity(entry, cards)
    const tokens = searchTokens(query)
    const matches = tokens.length
        ? rankBlueprints(entries, tokens, popularity)
        : rotateByPlugin(entries, popularity)
    return {
        total: matches.length,
        results: matches
            .slice(0, MAX_RESULTS)
            .map((entry) => toResult(entry, cards)),
    }
}
