import type { LpVariant } from "./types"
import { LP_PROOF_CASES } from "./shared"

/**
 * Variant 3 — consolidation: tool sprawl, cron and legacy-scheduler replacement,
 * one tool instead of many. Ad group: orchestration / workflow tools.
 *
 * This is the variant with the most literal support in the call corpus:
 * consolidation and legacy-scheduler migration dominate the trigger bucket.
 *
 * Copy source: `claude-code-briefs.md` PROMPT 3 and `lp-copy-final-v1.md` page 3,
 * which agree. Used verbatim, with three exceptions that existed in neither
 * document and are therefore new copy by us, all marked ⚠️ DRAFT and pending
 * Gabe/Manu's sign-off: the hero sub, the problem header, the benefits header.
 *
 * Note on incumbents: naming cron, Rundeck and "legacy scheduler" as migration
 * sources is factual and stays. Their shortcomings do not appear — the VoC
 * guardrail keeps competitor criticism out of paid copy.
 */
const orchestrationTools: LpVariant = {
    slug: "orchestration-tools",
    meta: {
        // ⚠️ DRAFT — meta strings were not specified for this variant.
        title: "Orchestration Tools: One Platform for Data, Scripts & Infrastructure | Kestra",
        description:
            "Consolidate the schedulers, cron jobs, and point tools your teams cobbled together into one orchestrator you can actually see. Any language, self-managed. Book a demo.",
        ogTitle: "One Orchestration Tool for Data, Scripts, and Infrastructure",
    },
    hero: {
        h1: "One Orchestration Tool for Data, Scripts, and Infrastructure",
        // ⚠️ DRAFT SUB — no locked sub existed for this variant; pending sign-off.
        sub: "Consolidate the schedulers, cron jobs, and point tools your teams cobbled together — into one orchestrator you can actually see.",
    },
    /**
     * Outcomes — pains folded into the gains, per the PR #5276 review rule.
     * ⚠️ DRAFT header.
     */
    benefits: {
        header: "One place to run it all, and to see it all.",
        cards: [
            {
                lead: "Consolidate schedulers, cron, and point tools.",
                body: "Retire the cron jobs, the console apps on random servers, and the per-team scheduler — one platform to license, install, and look at.",
            },
            {
                lead: "Any language, 1,800+ integrations.",
                body: "Bring the scripts you already have — Python, Shell, Java, SQL — with no rewrites. Plugins for your clouds, databases, and legacy systems.",
            },
            {
                lead: "From first workflow to millions of executions.",
                body: "Move workflows over one at a time — keep what works while you retire what doesn't. Retries, alerting, and a history of every run, so nothing fails silently.",
            },
        ],
    },
    /**
     * Consolidation-leaning evidence: a 30-year-old platform retired, one
     * platform carrying a whole company, and a fast path to production.
     */
    proof: {
        intro: "Three teams that replaced what they had, rather than adding to it.",
        cases: [
            LP_PROOF_CASES.pharmacy,
            LP_PROOF_CASES.fila,
            LP_PROOF_CASES.jpmorgan,
        ],
    },

    finalCta: {
        header: "See it on your use cases",
        sub: "Get a custom demo on your use cases — including the migration path from cron, Rundeck, or the legacy scheduler you run today.",
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
                    "Can it replace our scheduler — cron, Rundeck, Control-M, VMware vRO, a legacy mainframe, DataStage or SSIS job?",
                answer: "Yes. Those are all common migration paths, and teams usually start by porting a single job across.",
            },
            {
                question:
                    "How much work is the migration — can we move workflows one at a time?",
                answer: "Yes, and that is the recommended path. Your existing scheduler and Kestra run side by side for as long as you need them to.",
            },
            {
                question:
                    "Does it integrate with Git — GitHub, GitLab, Azure DevOps — and support dev, UAT and prod environments?",
                answer: "Yes. Flows are declarative YAML versioned in your own repository, and the same flow is promoted across environments.",
            },
            {
                question:
                    "Self-hosted, on-prem or air-gapped — and do we need Kubernetes?",
                answer: "Self-hosted is a first-class deployment, air-gapped included. Kubernetes is optional: Docker on a VM works.",
            },
            {
                question:
                    "SSO, RBAC and audit logs for a platform shared across teams?",
                answer: "Yes, in the Enterprise edition, with namespace-level permissions so each team only sees its own workflows.",
            },
            {
                question: "How is Kestra priced?",
                answer: "The open-source edition is free and self-hosted, with no commercial conversation attached. The Enterprise edition is quoted against the deployment you actually need rather than a generic tier — we'll walk you through the model on the call.",
            },
        ],
    },
}

export default orchestrationTools
