// Maps a blueprint's included task plugin classes back to the matching
// /orchestration/<tool> page, if one exists. Each orchestration entry's
// tool.pluginClass is truncated to its plugin "group" (everything but the
// final class name), except for umbrella vendors (gcp, jdbc, ee, microsoft,
// dbt, github) where the next segment names the actual product and must be
// kept so sibling tools under the same vendor don't collide
// (e.g. io.kestra.plugin.gcp.bigquery vs io.kestra.plugin.gcp.gcs,
// io.kestra.plugin.dbt.cli vs io.kestra.plugin.dbt.cloud).
const UMBRELLA_PREFIXES = [
    "io.kestra.plugin.gcp.",
    "io.kestra.plugin.jdbc.",
    "io.kestra.plugin.ee.",
    "io.kestra.plugin.microsoft.",
    "io.kestra.plugin.dbt.",
    "io.kestra.plugin.github.",
]

export function pluginGroup(pluginClass: string): string {
    const segments = pluginClass.split(".")
    const isUmbrella = UMBRELLA_PREFIXES.some((p) => pluginClass.startsWith(p))
    const depth = isUmbrella ? 5 : 4
    return segments.slice(0, Math.min(depth, segments.length - 1)).join(".")
}

function matchesGroup(taskClass: string, group: string): boolean {
    return taskClass === group || taskClass.startsWith(`${group}.`)
}

export interface OrchestrationEntryLike {
    id: string
    data: { tool: { name: string; pluginClass: string } }
}

export function findOrchestrationLinks(
    includedTasks: string[] | undefined,
    entries: OrchestrationEntryLike[],
): { slug: string; name: string }[] {
    if (!includedTasks?.length) return []

    const groups = entries.map((e) => ({
        slug: e.id,
        name: e.data.tool.name,
        group: pluginGroup(e.data.tool.pluginClass),
    }))

    const seen = new Set<string>()
    const matches: { slug: string; name: string }[] = []

    for (const task of includedTasks) {
        for (const g of groups) {
            if (seen.has(g.slug)) continue
            if (matchesGroup(task, g.group)) {
                seen.add(g.slug)
                matches.push({ slug: g.slug, name: g.name })
            }
        }
    }

    return matches
}
