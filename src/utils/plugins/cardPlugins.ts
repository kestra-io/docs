import { $fetchApiCached } from "~/utils/fetch"
import type { Plugin } from "~/utils/plugins/plugin"
import { filterPluginsWithoutDeprecated } from "~/utils/plugins/plugin"
import {
    prunePluginsForCards,
    type CardPlugin,
} from "~/utils/plugins/pruneForClient"
import { buildPluginUrlIndex } from "~/utils/plugins/canonicalUrl"
import {
    buildFamilyIndex,
    familyNameForPlugin,
    type ArtifactsResponse,
} from "~/utils/plugins/pluginFamily"
import { formatPluginName } from "~/utils/plugins/pluginUtils"

export async function fetchCardPlugins() {
    const rawPlugins = await $fetchApiCached<Plugin[]>(`/plugins/subgroups`)
    const rawPluginsData = await $fetchApiCached(`/plugins/pluginsInformation`)
    const familyIndex = buildFamilyIndex(
        await $fetchApiCached<ArtifactsResponse>(`/plugins/artifacts`),
    )

    const nonDeprecatedPlugins = filterPluginsWithoutDeprecated(rawPlugins)
    const pluginsByName = nonDeprecatedPlugins.reduce(
        (acc, p) => ((acc[p.name] ??= []).push(p), acc),
        {} as Record<string, Plugin[]>,
    )

    const filteredPlugins = Object.values(pluginsByName).flatMap((group) => {
        const subgroups = group.filter((p) => p.subGroup)
        const parent = group.find((p) => !p.subGroup)
        return subgroups.length === 1 && parent ? subgroups : group
    })

    // Multi-artifact plugin groups (Debezium, JDBC, Scripts, ...) ship one unrelated top-level
    // plugin per sub-technology (plugin-jdbc-oracle, plugin-jdbc-postgres, ...). Each still gets
    // its own Hub card as usual; this just also adds one "/plugins/<family>" overview card per
    // family, so the family page is reachable from the Hub like any other plugin.
    const familyMembers: Record<string, Plugin[]> = {}
    for (const p of filteredPlugins) {
        if (p.subGroup) continue
        const family = familyNameForPlugin(p.name, familyIndex)
        if (family) (familyMembers[family] ??= []).push(p)
    }

    const rootGroups = new Set(
        nonDeprecatedPlugins.filter((p) => !p.subGroup).map((p) => p.group),
    )
    const urlIndex = buildPluginUrlIndex(rawPlugins)
    const familyCards: CardPlugin[] = Object.entries(familyMembers).map(
        ([family, members]) => {
            const title = formatPluginName(family)
            const memberCards = prunePluginsForCards(
                members,
                rawPluginsData.byPlugin,
                urlIndex,
                rootGroups,
            )
            return {
                name: family,
                title,
                group: family,
                description: `${members.length} ${title} plugins`,
                categories: [
                    ...new Set(memberCards.flatMap((m) => m.categories ?? [])),
                ],
                // No className: none of these families have a real dedicated icon (the
                // API's own fallback for an unmatched className is a generic blank-file
                // glyph, worse than PluginCard's own /icon.svg fallback used below).
                elementCounts: memberCards.reduce(
                    (sum, m) => sum + (m.elementCounts ?? 0),
                    0,
                ),
                blueprints: memberCards.reduce(
                    (sum, m) => sum + (m.blueprints ?? 0),
                    0,
                ),
                href: `/plugins/${family}`,
            }
        },
    )
    const sourcedCards: { card: CardPlugin; source?: Plugin }[] = [
        ...prunePluginsForCards(
            filteredPlugins,
            rawPluginsData.byPlugin,
            urlIndex,
            rootGroups,
        ).map((card, i) => ({ card, source: filteredPlugins[i] })),
        ...familyCards.map((card) => ({ card })),
    ]

    return {
        rawPlugins,
        cardPlugins: sourcedCards.map(({ card }) => card),
        sourcedCards,
        urlIndex,
    }
}
