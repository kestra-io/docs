import type { LpVariant } from "./types"

/**
 * Variant 1 — broadest intent, the cross-domain "entire stack" wedge.
 * Ad group: workflow orchestration (exact-match H1 for Quality Score).
 *
 * ⚠️ COPY CONFLICT — read before editing.
 * The hero sub below is the one in
 * `claude-code-briefs.md` "Brief 1/3 §6" (marked "use verbatim, no rewording").
 * `lp-copy-final-v1.md` carries a *different* hero sub, marked 🔒 LOCKED, plus a
 * different problem/benefit set. Both cannot be verbatim. The Brief 1/3 object
 * ships; the LOCKED alternative is preserved below so Gabe/Manu can swap it in
 * a single edit.
 *
 * TODO(virgile): confirm which of the two sub-lines is the signed-off one.
 *
 * Alternative hero sub (lp-copy-final-v1.md §1, marked LOCKED):
 *   "Orchestrate data pipelines, scripts, and business-critical processes from
 *    one control plane — in any language, on any infrastructure."
 *
 * (The former standalone problem section was removed in the PR #5276 review —
 * pains are folded into the outcome cards below.)
 */
const workflowOrchestration: LpVariant = {
    slug: "workflow-orchestration",
    meta: {
        title: "Unified Workflow Orchestration Platform | Kestra",
        description:
            "One control plane to run, see, and govern every workflow across data, infrastructure, apps, and business processes. Any language, self-managed. Book a demo.",
        ogTitle: "The Unified Workflow Orchestration Platform for Your Entire Stack",
    },
    hero: {
        h1: "The Unified Workflow Orchestration Platform for Your Entire Stack",
        h1Highlight: "Workflow Orchestration",
        sub: "One control plane to run, see, and govern every workflow across data, infrastructure, apps, and business processes. Any language, on your own infrastructure.",
    },
    /**
     * Outcomes — one section carrying what were "problem" and "benefits".
     * The three leads are the PR #5276 review's reformulations, verbatim: same
     * information as the old pain bullets, stated as what the visitor gains.
     * Removed with that review: "No competitor spans all of them natively"
     * (unverifiable comparative claim on a paid page) and the Python-only pain
     * (factually wrong — plenty of orchestrators aren't Python).
     */
    benefits: {
        header: "One platform. Every workflow. Your infrastructure.",
        cards: [
            {
                icon: "mdi:monitor-dashboard",
                lead: "One control plane for data, infra, AI, and business processes.",
                body: "Replace your legacy schedulers with one governed platform, running on top of the tools you already have: on-prem, air-gapped, or in any cloud.",
            },
            {
                icon: "mdi:eye-check-outline",
                lead: "Every job visible, owned, and audited.",
                body: "Including the ones that used to live in cron tabs and legacy scripts. Declarative workflows versioned in Git, editable from a full UI, with RBAC and audit logs built in.",
            },
            {
                icon: "mdi:code-braces",
                lead: "Any language. Every engineer builds.",
                body: "Python, Java, Shell, Node, and 1,800+ plugins for your databases, clouds, and SaaS tools. No rewrites to adopt, so one platform actually replaces many.",
            },
        ],
    },
    /**
     * Customer logo bar under the trust line — same seven companies, same
     * order, same asset files as the kestra.io homepage bar, so nothing appears
     * here that is not already public on the site.
     *
     * Note for the record: "already on the homepage" is not automatically the
     * same permission as "usable in paid advertising" — some logo agreements
     * separate the two. Worth one confirmation from Gabe before spend starts.
     */
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

    /**
     * Objection-handling accordion, seeded from the top-5 objections in the
     * call corpus (self-hosted ×57 orgs, SSO/RBAC ×55, Kubernetes ×4,
     * lock-in ×4, one-platform ×4 — `voc-lp-enrichment.md` §5.1).
     *
     * ON: the page needs the words, and these are the five things every call
     * opens with. Set `enabled: false` to drop the section entirely.
     */
    faq: {
        enabled: true,
        items: [
            {
                question:
                    "Can we run it fully self-hosted, on-prem, or air-gapped, with our data never leaving our network?",
                answer: "Yes — self-hosted is a first-class deployment. Workers run inside your VPC or on-prem, so data stays in your environment.",
            },
            {
                question:
                    "Does it support SSO/SAML, RBAC, audit logs, and multi-tenant isolation?",
                answer: "Yes, in the Enterprise edition.",
            },
            {
                question: "Do we need Kubernetes?",
                answer: "No — run on a VM with Docker, or on Kubernetes if you prefer.",
            },
            {
                question: "How do we avoid lock-in?",
                answer: "Workflows are declarative YAML in your own Git repository, and the engine is open source.",
            },
            {
                question:
                    "Can one platform run data, infra, and business workflows — or do we end up with two orchestrators?",
                answer: "One engine covers all three — that is the whole point of a single control plane.",
            },
            /**
             * Pricing opacity is the single most frequent friction in the call
             * corpus (×70 orgs: "there's no pricing online", "just give me a
             * ballpark"), and the VoC pack recommends addressing the *model*
             * rather than staying silent. Phrased the way prospects ask it —
             * an earlier draft asked "why isn't there pricing on this page?",
             * which pointed at the absence instead of answering. No figure
             * appears, so the page still carries no pricing, but the question
             * stops being a reason to bounce and it pre-qualifies whoever books.
             *
             * Only claims that are already true on /pricing: the open-source
             * edition is free and self-hosted, and the Enterprise edition is
             * quoted. Do not add a model description we cannot source.
             */
            {
                question: "How is Kestra priced?",
                answer: "The open-source edition is free and self-hosted, with no commercial conversation attached. The Enterprise edition is quoted against the deployment you actually need rather than a generic tier — we'll walk you through the model on the call.",
            },
        ],
    },
}

export default workflowOrchestration
