export const CUSTOMER_SUCCESS_SUBTAG = "Customer Success"
export const CUSTOMER_SUCCESS_LABEL = "Built by our Customer Success Team"

const CANONICAL_SUBTAGS = [
    "AWS Services",
    "Agents & Structured Output",
    "Approval Gates",
    "Azure Services",
    "CI/CD & Deployment",
    "CRM & Marketing Ops",
    "Classification & Moderation",
    "Cloudflare & Edge",
    "Content Generation",
    "Customer Success",
    "Data Warehouses",
    "Day 2 Operations",
    "ELT & Data Landing",
    "ELT & Warehouse Loading",
    "Failure Alerting",
    "Failure Alerting Mechanics",
    "File & Data Processing Basics",
    "Flow Control & Conditions",
    "GCP Services",
    "GDPR & Compliance AI",
    "GitOps & Flow Sync",
    "HR & Ops Automation",
    "Incident & Ticketing Notification",
    "Incident Response",
    "Infrastructure Automation",
    "Kubernetes Operations",
    "Monitoring & Alerting",
    "Multi-Cloud & CI",
    "Multimodal & Document Processing",
    "Namespace & Git Management",
    "Policy & Compliance",
    "RAG & Knowledge Retrieval",
    "Realtime & Streaming",
    "Realtime Events",
    "Reporting & Digests",
    "Scheduling",
    "ServiceNow & ITSM",
    "Spark & Big Data",
    "VM Provisioning",
    "Vector Stores & RAG",
    "dbt Transformations",
]

export function slugifySubtag(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
}

export function blueprintSubtags(blueprint: unknown): string[] {
    const b = blueprint as { subtags?: string[]; subTags?: string[] }
    const raw = b.subtags ?? b.subTags
    return Array.isArray(raw) ? raw.filter((v) => typeof v === "string") : []
}

export function blueprintHasSubtag(blueprint: unknown, name: string): boolean {
    const target = slugifySubtag(name)
    return blueprintSubtags(blueprint).some(
        (v) => slugifySubtag(v) === target,
    )
}

const LABEL_BY_SLUG = new Map(
    CANONICAL_SUBTAGS.map((name) => [slugifySubtag(name), name]),
)

export function subtagLabel(value: string): string {
    return (
        LABEL_BY_SLUG.get(slugifySubtag(value)) ??
        value
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())
    )
}
