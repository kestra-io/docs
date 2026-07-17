import { pluginGroup } from "~/utils/orchestrationLink"
import { $fetchApiCached } from "~/utils/fetch"

export interface ToolIndexEntry {
    name: string
    pluginClass: string
    count: number
}

const CORE_PREFIX = "io.kestra.plugin.core."

const ALWAYS_EXCLUDED = new Set([
    "io.kestra.plugin.scripts",
    "io.kestra.plugin.serdes",
])

const NAME_OVERRIDES: Record<string, string> = {
    aws: "AWS",
    gcp: "GCP",
    gcs: "GCS",
    sql: "SQL",
    ai: "AI",
    kv: "KV Store",
    http: "HTTP",
    ssh: "SSH",
    ftp: "FTP",
    sftp: "SFTP",
    jdbc: "JDBC",
    api: "API",
    dbt: "dbt",
    llm: "LLM",
    rag: "RAG",
    ldap: "LDAP",
    opa: "OPA",
    dns: "DNS",
    servicenow: "ServiceNow",
    hubspot: "HubSpot",
    pagerduty: "PagerDuty",
    opsgenie: "Opsgenie",
    linkedin: "LinkedIn",
    tiktok: "TikTok",
    github: "GitHub",
    gitlab: "GitLab",
    dynamodb: "DynamoDB",
    mongodb: "MongoDB",
    mariadb: "MariaDB",
    clickhouse: "ClickHouse",
    couchbase: "Couchbase",
    elasticsearch: "Elasticsearch",
    influxdb: "InfluxDB",
    openai: "OpenAI",
    huggingface: "Hugging Face",
    dataproc: "Dataproc",
    bigquery: "BigQuery",
    vertexai: "Vertex AI",
    "vertex-ai": "Vertex AI",
}

function toolDisplayName(group: string): string {
    const last = group.split(".").pop() ?? group
    const override = NAME_OVERRIDES[last.toLowerCase()]
    if (override) return override
    return last
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function buildToolIndex(
    blueprints: { includedTasks?: string[] }[],
): ToolIndexEntry[] {
    const byGroup = new Map<string, ToolIndexEntry>()

    for (const bp of blueprints) {
        const groupsSeenInThisBlueprint = new Set<string>()
        for (const cls of bp.includedTasks ?? []) {
            const group = pluginGroup(cls)
            if (ALWAYS_EXCLUDED.has(group) || group.startsWith(CORE_PREFIX)) {
                continue
            }
            if (groupsSeenInThisBlueprint.has(group)) continue
            groupsSeenInThisBlueprint.add(group)

            const existing = byGroup.get(group)
            if (existing) {
                existing.count += 1
            } else {
                byGroup.set(group, {
                    name: toolDisplayName(group),
                    pluginClass: cls,
                    count: 1,
                })
            }
        }
    }

    return Array.from(byGroup.values()).sort((a, b) => b.count - a.count)
}

interface PluginTaskDef {
    cls: string
    deprecated?: boolean
}

interface PluginDef {
    name: string
    tasks?: PluginTaskDef[]
    triggers?: PluginTaskDef[]
}

const SUBPACKAGE_LABELS: Record<string, string> = {
    kv: "KV",
    http: "HTTP",
}

const PREFIXED_SIMPLE_NAMES = new Set([
    "Get",
    "Set",
    "Put",
    "Delete",
    "Trigger",
    "GetKeys",
])

function coreTaskDisplayName(cls: string): string {
    const segments = cls.split(".")
    const simple = segments[segments.length - 1]
    const subpackage = segments[segments.length - 2]
    if (!PREFIXED_SIMPLE_NAMES.has(simple)) return simple
    const label =
        SUBPACKAGE_LABELS[subpackage] ??
        subpackage.charAt(0).toUpperCase() + subpackage.slice(1)
    return `${label} ${simple}`
}

export async function fetchCoreToolIndex(
    blueprints: { includedTasks?: string[] }[],
): Promise<ToolIndexEntry[]> {
    let defs: PluginTaskDef[] = []
    try {
        const plugins = await $fetchApiCached<PluginDef[]>("/plugins")
        const core = plugins.find((plugin) => plugin.name === "core")
        defs = [...(core?.tasks ?? []), ...(core?.triggers ?? [])]
    } catch {
        return []
    }

    const countByClass = new Map<string, number>()
    for (const bp of blueprints) {
        for (const cls of new Set(bp.includedTasks ?? [])) {
            if (!cls.startsWith(CORE_PREFIX)) continue
            countByClass.set(cls, (countByClass.get(cls) ?? 0) + 1)
        }
    }

    return defs
        .filter((t) => !t.deprecated && t.cls.startsWith(CORE_PREFIX))
        .map((t) => ({
            name: coreTaskDisplayName(t.cls),
            pluginClass: t.cls,
            count: countByClass.get(t.cls) ?? 0,
        }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export function blueprintUsesTool(
    blueprint: { includedTasks?: string[] },
    toolPluginClass: string,
): boolean {
    if (toolPluginClass.startsWith(CORE_PREFIX)) {
        return (blueprint.includedTasks ?? []).includes(toolPluginClass)
    }
    const group = pluginGroup(toolPluginClass)
    return (blueprint.includedTasks ?? []).some(
        (t) => t === group || t.startsWith(`${group}.`),
    )
}
