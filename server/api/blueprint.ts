import { parseMarkdown } from "@nuxtjs/mdc/runtime"

interface BlueprintQuery {
    query?: string
    counts?: string
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { query, counts } = getQuery(event) as BlueprintQuery

    if (counts === 'true') {
        return await cachedEventHandler(async () => {
            try {
                const data = await $fetch<{ countByPlugins: Record<string, number> }>(
                    `${config.public.apiUrl}/blueprints/countByPlugins`
                )
                return data
            } catch (error) {
                console.warn('Failed to fetch blueprint counts', error)
                return { countByPlugins: {} }
            }
        }, {
            maxAge: 60 * 60,
            getKey: () => 'blueprints-counts'
        })(event)
    }

    if (query) {
        try {
            const [pageData, graphData] = await Promise.all([
                $fetch(`${config.public.apiUrl}/blueprints/${query}/versions/latest`),
                $fetch(`${config.public.apiUrl}/blueprints/${query}/versions/latest/graph`)
            ])

            const [descriptionAsMd, flowAsMd] = await Promise.all([
                parseMarkdown(pageData.description),
                parseMarkdown(`\`\`\`yaml\n${pageData.flow}\n\`\`\``)
            ])

            let relatedBlueprints = []
            if (pageData.tags?.length) {
                try {
                    const { results } = await $fetch(`${config.public.apiUrl}/blueprints/versions/latest?tags=${pageData.tags}`)
                    relatedBlueprints = results
                        .filter((b: any) => b.id !== pageData.id)
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3)
                } catch {}
            }

            return {
                page: pageData,
                graph: graphData,
                descriptionAsMd,
                flowAsMd,
                relatedBlueprints,
                metaDescription: pageData.metaDescription
            }
        } catch {
            setResponseStatus(event, 404)
            return { message: "Not Found" }
        }
    }

    setResponseStatus(event, 400)
    return { message: "Missing required parameter: 'query' or 'counts'" }
})
