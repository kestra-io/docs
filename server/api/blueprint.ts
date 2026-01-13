    import { parseMarkdown } from "@nuxtjs/mdc/runtime"

    export default defineEventHandler(async (event) => {
        const config = useRuntimeConfig()
        const { query, counts, plugin } = getQuery(event)

        const API_URL = config.public.apiUrl
        const mode = counts === "true" ? "counts" : plugin ? "plugin-blueprints" : query ? "query" : null

        try {
            switch (mode) {
                case "counts": {
                    const data = await $fetch<{ countByPlugins: Record<string, number> }>(
                        `${API_URL}/blueprints/countByPlugins`
                    )
                    return data
                }

                case "plugin-blueprints": {
                    const data = await $fetch<any[]>(
                        `${API_URL}/blueprints/plugin/${plugin}/version/latest`
                    )
                    return { results: data, total: data.length }
                }

                case "query": {
                    const [pageData, graphData] = await Promise.all([
                        $fetch(`${API_URL}/blueprints/${query}/versions/latest`),
                        $fetch(`${API_URL}/blueprints/${query}/versions/latest/graph`)
                    ])

                    const [descriptionAsMd, flowAsMd] = await Promise.all([
                        parseMarkdown(pageData.description),
                        parseMarkdown(`\`\`\`yaml\n${pageData.flow}\n\`\`\``)
                    ])

                    let relatedBlueprints = []
                    if (pageData.tags?.length) {
                        const { results } = await $fetch(`${API_URL}/blueprints/versions/latest?tags=${pageData.tags}`)
                        relatedBlueprints = results
                            .filter((b: any) => b.id !== pageData.id)
                            .sort(() => Math.random() - 0.5)
                            .slice(0, 3)
                    }

                    return {
                        page: pageData,
                        graph: graphData,
                        descriptionAsMd,
                        flowAsMd,
                        relatedBlueprints,
                        metaDescription: pageData.metaDescription
                    }
                }

                default:
                    setResponseStatus(event, 400)
                    return { message: "Missing required parameter: 'query', 'counts', or 'plugin'" }
            }
        } catch (error) {
            console.error("Failed to fetch blueprint data", error)
            setResponseStatus(event, 500)
            return { message: "Failed to fetch or parse data", error }
        }
    })
