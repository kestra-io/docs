import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import { slugify, buildPluginMappings } from '@kestra-io/ui-libs'

interface BlueprintQuery {
    query?: string
    plugin?: string
    subgroup?: string
    type?: string
    page?: string
    size?: string
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { query, plugin, subgroup, type, page, size } = getQuery(event) as BlueprintQuery

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
            return { message: 'Not Found' }
        }
    }

    try {
        const { clsToSubgroup, clsToPlugin, shortNameToCls } = buildPluginMappings(
            await $fetch(`${config.public.apiUrl}/plugins/subgroups`).catch(() => [])
        )

        const { results } = await $fetch(
            `${config.public.apiUrl}/blueprints/versions/latest?page=${page ?? '1'}&size=${size ?? '50'}`
        )

        const filtered = results?.filter((blueprint: any) => {
            const candidates = (blueprint.includedTasks ?? [])
                .filter(Boolean)
                .flatMap((task: string) =>
                    task.includes('.')
                        ? [task]
                        : (shortNameToCls[task.toLowerCase()] ?? [task])
                )

            if (type) {
                const targetClasses = type.includes('.')
                    ? [type]
                    : (shortNameToCls[type.toLowerCase()] ?? [type])
                return candidates.some((c: string) => targetClasses.includes(c))
            }

            if (plugin) {
                const matchPlugin = (cls: string) => {
                    const mapped = clsToPlugin[cls]
                    return mapped && [mapped.raw, mapped.slug]
                        .map((v: string) => v.toLowerCase())
                        .includes(plugin.toLowerCase())
                }

                if (subgroup) {
                    const subgroupSlug = slugify(subgroup)
                    const matchSubgroup = (cls: string) => {
                        const mapped = clsToSubgroup[cls]
                        return mapped && (mapped === subgroupSlug || mapped.toLowerCase() === subgroup.toLowerCase())
                    }
                    return candidates.some((c: string) => matchPlugin(c) && matchSubgroup(c))
                }

                return candidates.some(matchPlugin)
            }

            return false
        }) ?? []

        return { results: filtered, total: filtered.length }
    } catch {
        setResponseStatus(event, 500)
        return { message: 'Failed to fetch blueprints' }
    }
})
