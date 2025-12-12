import { slugify, buildPluginMappings } from "@kestra-io/ui-libs"

interface BlueprintsByPluginQuery {
    plugin?: string
    subgroup?: string
    type?: string
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const { plugin, subgroup, type } = getQuery(event) as BlueprintsByPluginQuery

    if (!plugin && !type) {
        setResponseStatus(event, 400)
        return { message: "Either 'plugin' or 'type' parameter is required" }
    }

    try {
        const [subgroupsData, blueprintsData] = await Promise.all([
            $fetch(`${config.public.apiUrl}/plugins/subgroups`).catch(() => []),
            $fetch<{ results: any[] }>(`${config.public.apiUrl}/blueprints/versions/latest?size=500`)
        ])

        const { clsToSubgroup, clsToPlugin, shortNameToCls } = buildPluginMappings(subgroupsData)
        const results = blueprintsData?.results ?? []

        const filtered = results.filter((blueprint: any) => {
            const candidates = (blueprint.includedTasks ?? [])
                .filter(Boolean)
                .flatMap((task: string) =>
                    task.includes(".")
                        ? [task]
                        : (shortNameToCls[task.toLowerCase()] ?? [task])
                )

            if (type) {
                const targetClasses = type.includes(".")
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
        })

        return { results: filtered, total: filtered.length }
    } catch {
        setResponseStatus(event, 500)
        return { message: "Failed to fetch blueprints" }
    }
})
