import { pluginGroup } from "~/utils/orchestrationLink"

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

const CORE_TOOL_GROUPS: { name: string; pluginClass: string }[] = [
    { name: "Flow Control", pluginClass: "io.kestra.plugin.core.flow.ForEach" },
    { name: "Triggers", pluginClass: "io.kestra.plugin.core.trigger.Schedule" },
    {
        name: "Trigger Conditions",
        pluginClass: "io.kestra.plugin.core.condition.Expression",
    },
    { name: "HTTP", pluginClass: "io.kestra.plugin.core.http.Request" },
    { name: "Logging", pluginClass: "io.kestra.plugin.core.log.Log" },
    { name: "KV Store", pluginClass: "io.kestra.plugin.core.kv.Get" },
    {
        name: "Execution Control",
        pluginClass: "io.kestra.plugin.core.execution.Fail",
    },
    {
        name: "Internal Storage",
        pluginClass: "io.kestra.plugin.core.storage.Write",
    },
    {
        name: "Namespace Files",
        pluginClass: "io.kestra.plugin.core.namespace.UploadFiles",
    },
    {
        name: "Outputs",
        pluginClass: "io.kestra.plugin.core.output.OutputValues",
    },
    { name: "Metrics", pluginClass: "io.kestra.plugin.core.metric.Publish" },
    { name: "Debugging", pluginClass: "io.kestra.plugin.core.debug.Return" },
    {
        name: "Templating",
        pluginClass: "io.kestra.plugin.core.templating.TemplatedTask",
    },
    {
        name: "Process Runner",
        pluginClass: "io.kestra.plugin.core.runner.Process",
    },
]

export function buildCoreToolIndex(
    blueprints: { includedTasks?: string[] }[],
): ToolIndexEntry[] {
    const countByGroup = new Map<string, number>()
    for (const bp of blueprints) {
        const groupsSeenInThisBlueprint = new Set<string>()
        for (const cls of bp.includedTasks ?? []) {
            const group = pluginGroup(cls)
            if (!group.startsWith(CORE_PREFIX)) continue
            if (groupsSeenInThisBlueprint.has(group)) continue
            groupsSeenInThisBlueprint.add(group)
            countByGroup.set(group, (countByGroup.get(group) ?? 0) + 1)
        }
    }

    return CORE_TOOL_GROUPS.map((g) => ({
        ...g,
        count: countByGroup.get(pluginGroup(g.pluginClass)) ?? 0,
    })).sort((a, b) => b.count - a.count)
}

export function blueprintUsesTool(
    blueprint: { includedTasks?: string[] },
    toolPluginClass: string,
): boolean {
    const group = pluginGroup(toolPluginClass)
    return (blueprint.includedTasks ?? []).some(
        (t) => t === group || t.startsWith(`${group}.`),
    )
}
