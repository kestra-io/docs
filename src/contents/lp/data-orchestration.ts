import type { LpVariant } from "./types"
import { LP_PROOF_CASES } from "./shared"
import interimHeroUi from "~/assets/landing/infrastructure/infra-ui.png"

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
        // ⚠️ DRAFT SUB — no locked sub existed for this variant; pending sign-off.
        sub: "Orchestrate ingestion, transformation, and the ML and AI steps around them — one engine, any language, from first pipeline to millions of runs.",
        image: interimHeroUi,
        imageAlt:
            "The Kestra UI: a declarative YAML flow in the editor next to its topology, with two tasks running in parallel inside a group.",
        imageFit: "contain",
    },
    problem: {
        // ⚠️ DRAFT HEADER — not in the source docs.
        header: "The pipeline runs. Nobody can say what it did.",
        pains: [
            "Pipelines held together by cron and glue scripts — no lineage, no idea what actually ran until a dashboard shows the wrong number.",
            "No link between ingest and transform — you run dbt and hope the data landed.",
            "The framework tax — your orchestrator forces everything into its way of working, and runs differently on your machine than it does in production.",
        ],
    },
    benefits: {
        // ⚠️ DRAFT HEADER — not in the source docs.
        header: "Your whole data stack, and the steps either side of it.",
        cards: [
            {
                lead: "Orchestrate your data stack end-to-end.",
                body: "dbt, warehouses, ELT, streaming. Know ingestion finished before the transform runs — and restart a failed run from the point it broke, not from the top.",
            },
            {
                lead: "Language-agnostic pipelines, not Python-only.",
                body: "SQL, Python, R, Shell — your analysts' scripts, not a rewrite. 1,800+ plugins for your warehouses, lakes, and SaaS sources.",
            },
            {
                lead: "Data-aware triggers, backfills, and observability.",
                body: "Trigger on new data or a schedule, backfill 600 days without hand-rolling a loop, and see every run, retry, and failure in one place — including the ML and LLM steps the same engine schedules.",
            },
        ],
    },
    /**
     * The ingest → transform → quality-gate → ML → notify chain, which is the
     * most common real first workflow in the call corpus (≥6 orgs). Verbatim from
     * the brief except the Slack task: `io.kestra.plugin.notifications.slack.*`
     * is deprecated in favour of `io.kestra.plugin.slack.notifications.*`
     * (checked against the live plugin registry). Every other identifier here
     * was verified as current.
     */
    yaml: `id: daily_revenue_pipeline
namespace: company.data

tasks:
  - id: ingest                     # EL — ingestion
    type: io.kestra.plugin.airbyte.cloud.jobs.Sync
    connectionId: "{{ vars.orders_conn }}"

  - id: transform                  # T — dbt (runs only after ingest succeeds)
    type: io.kestra.plugin.dbt.cli.DbtCLI
    commands:
      - dbt build --select revenue

  - id: quality_check              # data-quality gate
    type: io.kestra.plugin.scripts.python.Script
    script: |
      assert_row_count("mart.revenue", min_rows=1000)

  - id: score_churn                # ML / AI — same engine, not a separate tool
    type: io.kestra.plugin.scripts.python.Script
    script: |
      run_model("churn_v3")

  - id: alert
    type: io.kestra.plugin.slack.notifications.SlackIncomingWebhook
    url: "{{ secret('SLACK_HOOK') }}"

triggers:
  - id: nightly
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 3 * * *"`,

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
        sub: "30 minutes with a Kestra engineer. Your warehouse, your dbt models, your sources — bring a pipeline you're stuck on and we'll build it live.",
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
                answer: "Yes. The same engine schedules them alongside your dbt runs, as in the flow above.",
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
