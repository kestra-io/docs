// Derives a searchable "tool" index (distinct plugins referenced across the
// catalog) from a sample of blueprints' includedTasks, for the search bar's
// tool chips. Reuses the same plugin-group grouping as the orchestration
// cross-link logic, so "Slack" groups every io.kestra.plugin.slack.* task
// under one entry instead of one per task class.
import { pluginGroup } from "~/utils/orchestrationLink"

export interface ToolIndexEntry {
    name: string
    pluginClass: string
    count: number
}

// Core Kestra mechanics aren't "tools" a visitor would search for by brand
// name, so they're excluded from the index entirely.
const EXCLUDED_GROUPS = new Set([
    "io.kestra.plugin.core",
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
    const byGroup = new Map<
        string,
        { name: string; pluginClass: string; count: number }
    >()

    for (const bp of blueprints) {
        const groupsSeenInThisBlueprint = new Set<string>()
        for (const cls of bp.includedTasks ?? []) {
            const group = pluginGroup(cls)
            if (EXCLUDED_GROUPS.has(group)) continue
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

// True when the blueprint actually uses the tool's plugin (any task class
// under the same plugin group), as opposed to merely mentioning it in text.
export function blueprintUsesTool(
    blueprint: { includedTasks?: string[] },
    toolPluginClass: string,
): boolean {
    const group = pluginGroup(toolPluginClass)
    return (blueprint.includedTasks ?? []).some(
        (t) => t === group || t.startsWith(`${group}.`),
    )
}
