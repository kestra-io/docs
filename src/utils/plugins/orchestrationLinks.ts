import { getCollection } from "astro:content"

export interface OrchestrationLink {
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
export async function findOrchestrationLinks(
    group: string | undefined,
    subGroup: string | undefined,
): Promise<OrchestrationLink[]> {
    if (!group) return []

    const entries = (await getCollection("orchestration")).filter((entry) =>
        entry.data.tool.pluginClass.startsWith(`${group}.`),
    )
    const scoped =
        entries.length > 1 && subGroup
            ? entries.filter((entry) =>
                  entry.data.tool.pluginClass.startsWith(`${subGroup}.`),
              )
            : entries

    return scoped
        .map((entry) => ({
            slug: entry.id,
            toolName: entry.data.tool.name,
            description: entry.data.description,
        }))
        .sort((a, b) => a.toolName.localeCompare(b.toolName))
}
