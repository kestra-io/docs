import type { LpVariant } from "./types"
import { LP_PROOF_CASES } from "./shared"

/**
 * Variant 2 — data-led, but deliberately pulling upward to infrastructure and
 * AI. Ad group: data orchestration.
 *
 * Copy source: `claude-code-briefs.md` PROMPT 2 and `lp-copy-final-v1.md` page 2,
 * which agree with each other. Used verbatim, with three exceptions that did not
 * exist in either document and are therefore new copy by us — all three are
 * marked ⚠️ DRAFT below and need Gabe/Manu's sign-off:
 *   1. the hero sub (flagged as a draft in the source docs themselves),
 *   2. the problem header,
 *   3. the benefits header.
 *
 * The requirement that this page must NOT read as pure data orchestration is
 * carried by the shared sections: the four-column use-case block covers infra,
 * business processes and AI, and benefit 3 below names ML and LLM steps.
 */
const dataOrchestration: LpVariant = {
    slug: "data-orchestration",
    meta: {
        // ⚠️ DRAFT — meta strings were not specified for this variant.
        title: "Data Orchestration Platform | Kestra",
        description:
            "Orchestrate ingestion, transformation, and the ML and AI steps around them. One engine, any language, from first pipeline to millions of runs. Book a demo.",
        ogTitle: "The Data Orchestration Platform Built for Scale",
    },
    hero: {
        h1: "The Data Orchestration Platform Built for Scale",
        h1Highlight: "Data Orchestration",
        // ⚠️ DRAFT SUB — no locked sub existed for this variant; pending sign-off.
        sub: "Orchestrate ingestion, transformation, and the ML and AI steps around them — one engine, any language, from first pipeline to millions of runs.",
    },
    /**
     * Outcomes — pains folded into the gains, per the PR #5276 review rule
     * (state what they get; the pain stays implicit). ⚠️ DRAFT header.
     */
    benefits: {
        header: "Your whole data stack, and the steps either side of it.",
        cards: [
            {
                icon: "mdi:database-cog-outline",
                lead: "Orchestrate your data stack end-to-end.",
                body: "dbt, warehouses, ELT, streaming. Ingestion finishes before the transform runs, and a failed run restarts from the point it broke, with the run history to prove what happened.",
            },
            {
                icon: "mdi:code-braces",
                lead: "Language-agnostic pipelines, not Python-only.",
                body: "SQL, Python, R, Shell: your analysts' scripts, not a rewrite. 1,800+ plugins for your warehouses, lakes, and SaaS sources.",
            },
            {
                icon: "mdi:chart-timeline-variant",
                lead: "Data-aware triggers, backfills, and observability.",
                body: "Trigger on new data or a schedule, backfill 600 days without hand-rolling a loop, and see every run, retry, and failure in one place, including the ML and LLM steps the same engine schedules.",
            },
        ],
    },
    /** Data-leaning evidence: two data platforms at scale, plus ML at Apple. */
    proof: {
        intro: "Three data platforms at very different scales, all on one engine.",
        cases: [
            LP_PROOF_CASES.leroymerlin,
            LP_PROOF_CASES.jpmorgan,
            LP_PROOF_CASES.apple,
        ],
    },

    finalCta: {
        header: "See it on your pipelines",
        sub: "Your warehouse, your dbt models, your sources, and the ML steps around them.",
    },

    logos: {
        enabled: true,
        companies: [
            "xiaomi",
            "bloomberg",
            "amdocs",
            "fila",
            "apple",
            "jpmorgan",
            "t-system",
        ],
    },

    faq: {
        enabled: true,
        items: [
            {
                question:
                    "Can it coordinate more than data — ML training, LLM and agent tasks, infra steps — in the same pipeline?",
                answer: "Yes. The same engine schedules them alongside your dbt runs.",
            },
            {
                question:
                    "Does it link ingest to transform, and let me recover a dbt run mid-way or backfill without a manual loop?",
                answer: "Yes — dependencies are explicit, a failed run restarts from the point it broke, and backfills are built in.",
            },
            {
                question: "Self-hosted, EU-hosted, or air-gapped?",
                answer: "Yes to all three. Self-hosted is a first-class deployment, and workers can run inside your own VPC or on-prem so data never leaves your environment.",
            },
            {
                question:
                    "SSO, RBAC, and secrets-manager integration with Vault, GCP or AWS?",
                answer: "Yes, in the Enterprise edition.",
            },
            {
                question:
                    "Do I need deep framework expertise, and will it run the same locally and in production?",
                answer: "No framework mastery required, and flows run consistently across environments — the same YAML and the same containers locally and in production.",
            },
            {
                question: "How is Kestra priced?",
                answer: "The open-source edition is free and self-hosted, with no commercial conversation attached. The Enterprise edition is quoted against the deployment you actually need rather than a generic tier — we'll walk you through the model on the call.",
            },
        ],
    },
}

export default dataOrchestration
