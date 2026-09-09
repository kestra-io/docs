export interface CategoryTileMeta {
    name: string
    slug: string
    icon: string
    blurb: string
}

export const CATEGORY_TILE_META: CategoryTileMeta[] = [
    {
        name: "Getting Started",
        slug: "getting-started",
        icon: "mdi:rocket-launch-outline",
        blurb: "Six core patterns to learn Kestra's building blocks.",
    },
    {
        name: "AI",
        slug: "ai",
        icon: "mdi:brain",
        blurb: "LLM calls, RAG pipelines, and agentic workflows.",
    },
    {
        name: "Business",
        slug: "business",
        icon: "mdi:briefcase-outline",
        blurb: "Approvals, reporting, and cross-team automation.",
    },
    {
        name: "Cloud",
        slug: "cloud",
        icon: "mdi:cloud-outline",
        blurb: "AWS, GCP, and Azure services wired into one flow.",
    },
    {
        name: "Core",
        slug: "core",
        icon: "mdi:cog-outline",
        blurb: "Kestra-native mechanics: triggers, conditions, flow control.",
    },
    {
        name: "Data",
        slug: "data",
        icon: "mdi:database-outline",
        blurb: "ELT, warehouses, and dbt-driven transforms.",
    },
    {
        name: "Infrastructure",
        slug: "infrastructure",
        icon: "mdi:server-outline",
        blurb: "Provisioning, patching, and configuration management.",
    },
]

export function categoryTileMetaFor(name: string): CategoryTileMeta | undefined {
    return CATEGORY_TILE_META.find((c) => c.name === name)
}

export function categoryTileMetaForSlug(
    slug: string,
): CategoryTileMeta | undefined {
    return CATEGORY_TILE_META.find((c) => c.slug === slug)
}
