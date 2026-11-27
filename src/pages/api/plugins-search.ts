import type { APIRoute } from "astro"
import { fetchCardPlugins } from "~/utils/plugins/cardPlugins"
import { pluginElementsPreview } from "~/utils/plugins/pluginElementsPreview"
import type { PluginSearchCard } from "~/utils/search/plugins"

export const prerender = false

export const GET: APIRoute = async () => {
    const { sourcedCards, urlIndex } = await fetchCardPlugins()

    const entries: PluginSearchCard[] = sourcedCards
        .filter(({ card }) => card.href)
        .map(({ card, source }) => ({
            name: card.name,
            title: card.title,
            description: card.description,
            classes: card.classes,
            group: card.group,
            subGroup: card.subGroup,
            href: card.href,
            className: card.className,
            isEnterprise: card.isEnterprise,
            categories: card.categories,
            elementCounts: card.elementCounts,
            blueprints: card.blueprints,
            usageCount: card.usageCount,
            elements: source ? pluginElementsPreview(source, urlIndex) : [],
        }))

    return new Response(JSON.stringify(entries), {
        headers: { "Content-Type": "application/json" },
    })
}
