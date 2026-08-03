import type { LpVariant } from "./types"

/**
 * Variant 1 — broadest intent, the cross-domain "entire stack" wedge.
 * Ad group: workflow orchestration (exact-match H1 for Quality Score).
 *
 * ⚠️ COPY CONFLICT — read before editing.
 * The hero sub, problem block and benefit cards below are the ones in
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
 * Alternative problem block (lp-copy-final-v1.md §3, VoC-sourced):
 *   header: "Orchestration today: five tools, zero visibility"
 *   - "Automation sprawl — Jenkins here, cron there, scripts on a network
 *      drive. No one can see the whole picture, and when the person who knows
 *      how it all fits together goes on vacation, everything stalls."
 *   - "No framework tax — your orchestrator shouldn't force everything into
 *      Python, or make you an expert in its framework just to ship."
 *   - "No visibility or governance — anyone can hand-edit a workflow and break
 *      production, with no audit trail of who changed what."
 */
const workflowOrchestration: LpVariant = {
    slug: "workflow-orchestration",
    meta: {
        title: "Workflow Orchestration Platform | Kestra",
        description:
            "One control plane to run, see, and govern every workflow across data, infrastructure, apps, and business processes. Any language, self-managed. Book a demo.",
        ogTitle: "The Workflow Orchestration Platform for Your Entire Stack",
    },
    hero: {
        h1: "The Workflow Orchestration Platform for Your Entire Stack",
        sub: "One control plane to run, see, and govern every workflow across data, infrastructure, apps, and business processes. Any language, on your own infrastructure.",
    },
    problem: {
        header: "Orchestration today: five tools, zero visibility",
        pains: [
            "Every team runs its own scheduler — one for data, one for infra, one for everything else.",
            "Business-critical jobs still hide in cron tabs and legacy scripts nobody owns.",
            "Single-language orchestrators lock out every engineer who doesn't write Python.",
        ],
    },
    benefits: {
        header: "One platform. Every workflow. Your infrastructure.",
        cards: [
            {
                lead: "Everything as code, and from the UI.",
                body: "Declarative YAML versioned in Git, editable from a full UI, in any language with 1,800+ plugins. Every team can build, so one platform actually replaces many.",
            },
            {
                lead: "One control plane, every domain.",
                body: "Coordinate data pipelines, infrastructure jobs, and business processes in one governed flow, on top of the tools you already run. No competitor spans all of them natively.",
            },
            {
                lead: "Self-managed and governed at scale.",
                body: "Run on-prem, air-gapped, or in any cloud, with RBAC, audit logs, and multi-tenancy. Built for millions of executions with high availability.",
            },
        ],
    },
    /**
     * TODO(virgile): two task references in this sample are not real plugin
     * identifiers and a platform engineer will spot it on the page:
     *   - `io.kestra.plugin.terraform.cli.Apply` → the shipped task is
     *     `io.kestra.plugin.terraform.cli.TerraformCLI` (with `commands`).
     *   - `SlackExecution` takes a webhook `url`, not a `channel` key.
     * Kept verbatim as briefed; fix once approved (credibility risk on the one
     * section whose whole job is technical credibility).
     */
    yaml: `id: nightly-operations
namespace: company.platform

tasks:
  - id: provision_compute
    type: io.kestra.plugin.terraform.cli.Apply

  - id: transform_data
    type: io.kestra.plugin.dbt.cli.DbtCLI
    commands: ["dbt build"]

  - id: sync_crm
    type: io.kestra.plugin.scripts.python.Script
    script: "{{ read('sync_crm.py') }}"

  - id: notify_finance
    type: io.kestra.plugin.notifications.slack.SlackExecution
    channel: "#finance-ops"

triggers:
  - id: schedule
    type: io.kestra.plugin.core.trigger.Schedule
    cron: "0 2 * * *"`,

    /**
     * Objection-handling accordion, seeded from the top-5 objections in the
     * call corpus (self-hosted ×57 orgs, SSO/RBAC ×55, Kubernetes ×4,
     * lock-in ×4, one-platform ×4 — `voc-lp-enrichment.md` §5.1).
     *
     * OFF by default: the 9-section spec in Brief 1/3 does not include it.
     * Flip `enabled: true` to render it between Enterprise-grade and Proof.
     */
    faq: {
        enabled: false,
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
                answer: "One engine covers all three, as in the flow above.",
            },
        ],
    },
}

export default workflowOrchestration
