import type { CollectionEntry } from "astro:content"
import { slugify } from "~/utils/slugify"

type StoryEntry = CollectionEntry<"customerStories">

/** Featured carousel — editorially curated order. */
const FEATURED_ORDER = [
    "erp-transformation-smarter-faster-fully-automated",
    "apple-ml-team-orchestrates-large-scale-data-pipelines-with-kestra",
    "amdocs-delivers-integration-environments-as-a-service-with-kestra",
    "datamesh-at-scale-increased-its-data-production-by-900percent",
    "scaling-secure-infrastructure-at-credit-agricole-with-kestra",
    "orchestrating-cybersecurity-for-100-users-and-billions-of-rows",
]

const GRID_ORDER = [
    "amdocs-delivers-integration-environments-as-a-service-with-kestra",
    "apple-ml-team-orchestrates-large-scale-data-pipelines-with-kestra",
    "boosted-productivity-slashed-costs-and-accelerated-delivery",
    "building-a-government-grade-orchestration-control-plane-with-kestra",
    "datamesh-at-scale-increased-its-data-production-by-900percent",
    "erp-transformation-smarter-faster-fully-automated",
    "orchestrating-cybersecurity-for-100-users-and-billions-of-rows",
    "government-soc-team",
    "modernizing-mission-critical-e-commerce-integrations-with-kestra",
    "modernizing-mission-critical-workflows-in-a-highly-regulated-environment",
    "scaling-secure-infrastructure-at-credit-agricole-with-kestra",
    "securing-hybrid-cloud-automation-across-it-and-ot-with-kestra",
    "bouygues-immobilier-platform-orchestrate-its-marketing-data-with-kestra",
    "clever-cloud-offloading-terabytes-of-data-with-kestra-every-month",
    "cleverconnect-enhances-hr-integration-platform-with-kestra",
    "gorgias-using-declarative-data-engineering-orchestration-with-kestra",
    "governed-self-service-cloud-automation-in-regulated-environments-with-kestra",
    "riverside-orchestrates-dbt-cloud-analytics-stack-with-kestra",
    "scaling-big-data-operations",
    "sopht-scales-its-green-itops-platform-with-kestra",
    "when-your-api-writes-its-own-docs-with-kestra",
    "a-solopreneurs-journey-how-networklessons-leverage-kestra-to-automate-his-business",
    "airpaz-optimizes-travel-data-workflows-with-kestra",
    "copines-de-voyage-enhancing-travel-experiences-through-advanced-data-orchestration-with-kestra",
    "displayce-optimized-workflow-orchestration-and-enhanced-data-management",
    "htch-building-the-best-architect-collaborative-web-tool-with-kestra",
    "ntico-manage-geospatial-data-operations-with-kestra",
    "quadis-drives-innovation-transforming-car-retail-operations-with-kestra",
    "reglo-automating-etl-process-with-a-simple-slack-command",
]

export function sortForGrid(entries: StoryEntry[]): StoryEntry[] {
    const position = (e: StoryEntry): number => {
        const i = GRID_ORDER.indexOf(e.id)
        return i === -1 ? GRID_ORDER.length : i
    }
    return [...entries].sort(
        (a, b) =>
            position(a) - position(b) || a.data.rank - b.data.rank || a.id.localeCompare(b.id),
    )
}

export const HIGHLIGHTED_IDS = [
    "apple-ml-team-orchestrates-large-scale-data-pipelines-with-kestra",
    "erp-transformation-smarter-faster-fully-automated",
    "orchestrating-cybersecurity-for-100-users-and-billions-of-rows",
    "scaling-secure-infrastructure-at-credit-agricole-with-kestra",
    "riverside-orchestrates-dbt-cloud-analytics-stack-with-kestra",
]

export const toSlug = (entry: StoryEntry): string =>
    entry.data.companyName ? slugify(entry.data.companyName) : entry.id

export function toStory(entry: StoryEntry): Story {
    return {
        id: entry.id,
        slug: toSlug(entry),
        ...entry.data,
        heroImage: entry.data.heroImage.src,
        featuredImage: entry.data.featuredImage.src,
        logo: entry.data.logo?.src,
        logoDark: entry.data.logoDark?.src,
        logoIcon: entry.data.logoIcon?.src,
        content: entry.body ?? "",
    }
}

export function toStoryCard(entry: StoryEntry): Story {
    return { ...toStory(entry), content: "" }
}

export function featuredEntries(entries: StoryEntry[]): StoryEntry[] {
    return entries
        .filter((e) => FEATURED_ORDER.includes(e.id))
        .sort((a, b) => FEATURED_ORDER.indexOf(a.id) - FEATURED_ORDER.indexOf(b.id))
}

const featuredRank = (entry: StoryEntry): number => {
    const i = FEATURED_ORDER.indexOf(entry.id)
    return i === -1 ? FEATURED_ORDER.length : i
}

export function relatedEntries(entry: StoryEntry, all: StoryEntry[], limit = 3): StoryEntry[] {
    const industries = new Set(
        [entry.data.industry, entry.data.industry2].filter(Boolean) as string[],
    )

    const score = (e: StoryEntry): number => {
        let s = 0
        if (
            industries.has(e.data.industry) ||
            (e.data.industry2 && industries.has(e.data.industry2))
        )
            s += 2
        if (entry.data.useCaseShort && e.data.useCaseShort === entry.data.useCaseShort) s += 1
        return s
    }

    return all
        .filter((e) => e.id !== entry.id)
        .sort(
            (a, b) =>
                score(b) - score(a) ||
                featuredRank(a) - featuredRank(b) ||
                a.data.rank - b.data.rank ||
                a.data.title.localeCompare(b.data.title),
        )
        .slice(0, limit)
}
