const UMBRELLA_PREFIXES = [
    "io.kestra.plugin.gcp.",
    "io.kestra.plugin.jdbc.",
    "io.kestra.plugin.ee.",
    "io.kestra.plugin.microsoft.",
    "io.kestra.plugin.dbt.",
    "io.kestra.plugin.github.",
    "io.kestra.plugin.core.",
    "io.kestra.plugin.serdes.",
    "io.kestra.plugin.scripts.",
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
    data: { tool: { name: string; pluginClass: string }; description: string }
}

// /plugins and /blueprints are SSR, so they can't call getCollection("orchestration")
// (it would bundle every collection into the worker). Read the few fields they need
// straight from the raw YAML instead. Each file starts with a one-line, double-quoted
// `description:` and a `tool:` block whose first keys are `name` then `pluginClass`.
// Keep that shape when adding a page: a file that doesn't match is skipped silently.
const orchestrationFiles = import.meta.glob<string>("../contents/orchestration/*.yaml", {
    query: "?raw",
    import: "default",
    eager: true,
})

const TOOL_RE = /^tool:\s*\n\s+name:\s*"([^"]+)"\s*\n\s+pluginClass:\s*"([^"]+)"/m
const DESCRIPTION_RE = /^description:\s*"([^"]+)"\s*$/m

export function parseOrchestrationEntry(
    path: string,
    raw: string,
): OrchestrationEntryLike | undefined {
    const tool = raw.match(TOOL_RE)
    const description = raw.match(DESCRIPTION_RE)
    if (!tool || !description) return undefined
    return {
        id: path.split("/").pop()!.replace(/\.yaml$/, ""),
        data: { tool: { name: tool[1], pluginClass: tool[2] }, description: description[1] },
    }
}

let cachedEntries: OrchestrationEntryLike[] | undefined

export function getOrchestrationEntries(): OrchestrationEntryLike[] {
    cachedEntries ??= Object.entries(orchestrationFiles).flatMap(([path, raw]) => {
        const entry = parseOrchestrationEntry(path, raw)
        return entry ? [entry] : []
    })
    return cachedEntries
}

export interface PluginOrchestrationLink {
    slug: string
    toolName: string
    description: string
}

/**
 * The /orchestration pages a plugin page should point to.
 *
 * A plugin group usually maps to one orchestration page (plugin-terraform →
 * /orchestration/terraform), and every page of that plugin links to it. Groups
 * that cover several tools (plugin-gcp: BigQuery, GCS, Dataproc…, plugin-dbt:
 * dbt Core and dbt Cloud) list all of them on the root page and only the
 * matching one on a subgroup or element page.
 */
export function findPluginOrchestrationLinks(
    group: string | undefined,
    subGroup: string | undefined,
): PluginOrchestrationLink[] {
    if (!group) return []

    const entries = getOrchestrationEntries().filter((entry) =>
        entry.data.tool.pluginClass.startsWith(`${group}.`),
    )
    const scoped =
        entries.length > 1 && subGroup
            ? entries.filter((entry) => entry.data.tool.pluginClass.startsWith(`${subGroup}.`))
            : entries

    return scoped
        .map((entry) => ({
            slug: entry.id,
            toolName: entry.data.tool.name,
            description: entry.data.description,
        }))
        .sort((a, b) => a.toolName.localeCompare(b.toolName))
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
