export interface SubCategory {
    name: string
    matcher: (id: string) => boolean
}

const infra: SubCategory[] = [
    {
        name: "VM Provisioning",
        matcher: (id) =>
            /^kvm-provision-vm$|^vmware-provision-configure-register$|^netbox-vm-provision-register$|^create-vm-gcp-terraform$|^netbox-ansible-by-role-site$/.test(
                id,
            ),
    },
    {
        name: "Monitoring & Alerting",
        matcher: (id) =>
            /^kvm-self-healing-monitor$|^azure-eventhub-volume-alert$|^prometheus-k8s-cpu-spike-alerts$|^ssl-certificate-expiry-monitor$|^website-monitoring-with-alerts$|^sentry-alert$|^k8s-ai-incident-monitor$|^nutanix-inventory-chargeback$|^datadog-log-shipper$|^splunk-log-shipper$/.test(
                id,
            ),
    },
    {
        name: "Day 2 Operations",
        matcher: (id) =>
            /patch|drift|maintenance-window|node-drain|ahv-migration|backup-restore/.test(
                id,
            ),
    },
    {
        name: "CI/CD & Deployment",
        matcher: (id) =>
            /^docker-|^argocd-|^jenkins-|^ci-cd-|canary-deploy|^build-.*-image$|^python-.*-ecr$|^python-docker-artifact-registry|^github-cross-repo-dispatch$|^github-dispatch-deploy-on-dbt$|^github-push-and-create-pr$|^gitlab-ci-trigger-on-event$/.test(
                id,
            ),
    },
    {
        name: "GitOps & Flow Sync",
        matcher: (id) =>
            /^git-flows-files-kv-sync|^git-push-flows-dryrun-review$|^git-scripts$|^git-sync-flows-source-of-truth$|^git-terraform$|^push-to-git$|^sync-from-git$|^copy-flows-to-new-tenant$|^namespace-sync-from-git$|^tenant-sync-from-git$|^git-backup-flows-to-github$/.test(
                id,
            ),
    },
    {
        name: "Kubernetes Operations",
        matcher: (id) =>
            /^k8-pod-lifecycle$|^k8s-namespace-logs-and-events$|^kubernetes-gpu-pod-artifact$|^kubernetes-multicluster-apply$|^kubernetes-script-runner$|^kubernetes-vault-rotation-restart$|^on-demand-cluster-job$/.test(
                id,
            ),
    },
    {
        name: "Incident Response",
        matcher: (id) =>
            /create-.*-ticket-on-failure|create-pagerduty-alert-on-failure|create-github-issue-on-failure|failure-alert-(discord|zenduty)|gitlab-issue-on-failure|incident-response-jira-slack|opsgenie-notify-on-failure|sendgrid-notify-on-failure|zenduty-failure-alert/.test(
                id,
            ),
    },
    {
        name: "Policy & Compliance",
        matcher: (id) => /^opa-|^ldap-/.test(id),
    },
]

const data: SubCategory[] = [
    {
        name: "ELT & Warehouse Loading",
        matcher: (id) =>
            /^airbyte-|^fivetran-|^dlt-|^extract-load-|^gcs-|azure-blob-to-bigquery|oracle-extract-load-batch|hubspot-to-bigquery|gsheet-to-bigquery|cassandra-to-bigquery|pinot-to-bigquery|hightouch-|dlt-/.test(
                id,
            ),
    },
    {
        name: "dbt Transformations",
        matcher: (id) => /^dbt-|^sqlmesh$/.test(id),
    },
    {
        name: "Realtime & Streaming",
        matcher: (id) =>
            /^kafka-|^debezium-|realtime-trigger|realtime-record-processing|^pubsub-|^produce-|^listen-debezium$|snowflake-query-trigger|oracle-incremental-sync-trigger|vertica-trigger-on-new-rows|^nats-/.test(
                id,
            ),
    },
    {
        name: "Data Warehouses",
        matcher: (id) =>
            /^snowflake|^query-clickhouse$|^clickhouse-|^vertica-|^sap-hana-|^sql-server-|^databricks-|^redshift/.test(
                id,
            ),
    },
    {
        name: "Vector Stores & RAG",
        matcher: (id) =>
            /^weaviate-|vertex-ai-gemini-rag-ingestion|chat-with-your-data/.test(
                id,
            ),
    },
    {
        name: "Spark & Big Data",
        matcher: (id) =>
            /^dataproc-|aws-emr-serverless-spark|^beam-|^git-spark$/.test(id),
    },
]

const ai: SubCategory[] = [
    {
        name: "RAG & Knowledge Retrieval",
        matcher: (id) =>
            /rag-daily-ingestion|rag-ingest-and-query|web-data-to-rag|vertex-ai-gemini-rag-ingestion|^chat-with-your-data$/.test(
                id,
            ),
    },
    {
        name: "Agents & Structured Output",
        matcher: (id) =>
            /agent-calling-flows|ai-model-router|text-to-sql|agent-text-summarizer|check-weather-gemini|model-fallback-resilience/.test(
                id,
            ),
    },
    {
        name: "GDPR & Compliance AI",
        matcher: (id) => /gdpr/.test(id),
    },
    {
        name: "Content Generation",
        matcher: (id) =>
            /blog-post-generator|book-summary-perplexity|daily-digest-email-anthropic|notion-summary-perplexity|rss-news-digest|dall-e-create-image|generate-seo-summary/.test(
                id,
            ),
    },
    {
        name: "Classification & Moderation",
        matcher: (id) =>
            /batch-review-moderation|message_classification|event-classification-guardrail/.test(
                id,
            ),
    },
    {
        name: "Multimodal & Document Processing",
        matcher: (id) =>
            /document-data-extraction|multimodal-receipt-extraction/.test(id),
    },
]

const business: SubCategory[] = [
    {
        name: "Incident & Ticketing Notification",
        matcher: (id) =>
            /create-.*-ticket-on-failure|incident-response-jira-slack|discord-alert|^line-|^tencent-qq-|zulip-failure-alert/.test(
                id,
            ),
    },
    {
        name: "CRM & Marketing Ops",
        matcher: (id) =>
            /stripe-to-crm-sync|^klaviyo-|algolia-index-sync|google-sheet-airtable-sync|google-sheets-to-mailchimp-sync/.test(
                id,
            ),
    },
    {
        name: "ServiceNow & ITSM",
        matcher: (id) => /^service-now-|^servicenow-/.test(id),
    },
    {
        name: "Reporting & Digests",
        matcher: (id) =>
            /odoo-daily-sales-digest|weekly-confluence-recap|weekly-notion-recap|klaviyo-campaign-performance-report|dropbox-report-distribution|slack-snowflake-canvas|zulip-data-pipeline-digest|tencent-qq-pipeline-digest/.test(
                id,
            ),
    },
    {
        name: "HR & Ops Automation",
        matcher: (id) =>
            /dropbox-hr-resume-intake|odoo-create-leads-from-webhook|odoo-export-invoices-to-warehouse/.test(
                id,
            ),
    },
]

const cloud: SubCategory[] = [
    {
        name: "AWS Services",
        matcher: (id) =>
            /^aws-|^s3-|scan-dynamodb-table|react-to-sqs-trigger|cloudquery-aws|build-aws-ecr-image|python-aws-ecr/.test(
                id,
            ),
    },
    {
        name: "GCP Services",
        matcher: (id) =>
            /^gcs-|^dataproc-|build-gcp-artifact-registry-image|python-docker-artifact-registry-gcp|^pubsub-/.test(
                id,
            ),
    },
    {
        name: "Azure Services",
        matcher: (id) => /^azure-/.test(id),
    },
    {
        name: "Cloudflare & Edge",
        matcher: (id) => /^cloudflare-/.test(id),
    },
    {
        name: "Multi-Cloud & CI",
        matcher: (id) =>
            /^multi-cloud-deployment$|^on-demand-cluster-job$/.test(id),
    },
]

const core: SubCategory[] = [
    {
        name: "Flow Control & Conditions",
        matcher: (id) =>
            /^flow-condition-|^schedule-condition-|^switch$|runif-task-attribute|^retries$|^parallel-|pass-data-between-/.test(
                id,
            ),
    },
    {
        name: "Failure Alerting Mechanics",
        matcher: (id) =>
            /^failure-alert-(discord|email|gmail|googlechat|sentry|sentry-1|slack|teams|twilio|zenduty)$|^on-failure-alert$|^slack-failure-alert$|^telegram-notify-on-failure$|^whatsapp-notify-on-failure$|^sendgrid-notify-on-failure$|^zenduty-failure-alert$/.test(
                id,
            ),
    },
    {
        name: "Namespace & Git Management",
        matcher: (id) =>
            /^namespace-sync-from-git$|^tenant-sync-from-git$|^copy-flows-to-new-tenant$|^git-backup-flows-to-github$|^get-all-namespaces$|^system-readonly-label$/.test(
                id,
            ),
    },
    {
        name: "File & Data Processing Basics",
        matcher: (id) =>
            /^file-processing$|^parse-pdf$|^parse-twitter-json-payload$|^zip-to-parquet$|^webhook-xml-response$|^regex-input$/.test(
                id,
            ),
    },
]

export const SUB_CATEGORIES: Record<string, SubCategory[]> = {
    Infrastructure: infra,
    Data: data,
    AI: ai,
    Business: business,
    Cloud: cloud,
    Core: core,
}

export function subCategoriesFor(categoryName: string): SubCategory[] {
    return SUB_CATEGORIES[categoryName] ?? []
}

export const SUB_CATEGORY_TAG_NAMES: string[] = Object.values(
    SUB_CATEGORIES,
).flatMap((subs) => subs.map((s) => s.name))

export function blueprintInSubCategory(
    sc: SubCategory,
    blueprint: { id: number | string; tags?: string[] },
    subCategoryTagId?: string,
): boolean {
    if (subCategoryTagId && blueprint.tags?.includes(subCategoryTagId)) {
        return true
    }
    return sc.matcher(String(blueprint.id))
}
