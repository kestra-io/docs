// Use-case tags added alongside the original vertical tags (AI, Business, Cloud,
// Core, Data, Infrastructure, Getting Started) so a blueprint can be browsed by
// what it does, not just what domain it's in. Matched by name since the tag API
// returns a flat list with no axis field.
export interface PatternTag {
    name: string
    slug: string
    icon: string
    description: string
}

export const PATTERN_TAGS: PatternTag[] = [
    {
        name: "Failure Alerting",
        slug: "failure-alerting",
        icon: "mdi:bell-alert-outline",
        description:
            "Catch a failed flow and page the right channel: Slack, email, Teams, Zendesk, and more.",
    },
    {
        name: "ELT & Data Landing",
        slug: "elt-data-landing",
        icon: "mdi:database-arrow-down-outline",
        description:
            "Move data from a source into a warehouse, lake, or CRM, ready for the next step.",
    },
    {
        name: "Scheduling",
        slug: "scheduling",
        icon: "mdi:calendar-clock-outline",
        description:
            "Trigger flows on cron schedules or conditions instead of running them by hand.",
    },
    {
        name: "Realtime Events",
        slug: "realtime-events",
        icon: "mdi:lightning-bolt-outline",
        description:
            "React to events as they happen: message queues, CDC streams, and pub/sub topics.",
    },
    {
        name: "Approval Gates",
        slug: "approval-gates",
        icon: "mdi:shield-check-outline",
        description:
            "Pause a flow for a human sign-off before it continues.",
    },
    {
        name: "Infrastructure Automation",
        slug: "infrastructure-automation",
        icon: "mdi:server-network-outline",
        description:
            "Provision, patch, and drift-check VMs and infra without hand-running scripts.",
    },
]

const USE_CASE_TAG_NAMES = new Set(PATTERN_TAGS.map((p) => p.name))

export function isUseCaseTag(name: string): boolean {
    return USE_CASE_TAG_NAMES.has(name)
}

export function splitTagsByAxis<T extends { name: string }>(
    tags: T[],
): { categoryTags: T[]; patternTags: T[] } {
    const categoryTags: T[] = []
    const patternTags: T[] = []
    for (const tag of tags) {
        if (isUseCaseTag(tag.name)) {
            patternTags.push(tag)
        } else {
            categoryTags.push(tag)
        }
    }
    return { categoryTags, patternTags }
}
