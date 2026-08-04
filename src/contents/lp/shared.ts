/**
 * Copy shared by every `/lp/*` variant. Editing a string here changes all
 * three pages at once — that is the point: only the fields in `LpVariant`
 * (H1, hero sub, problem, benefits, YAML, meta) are allowed to differ.
 *
 * Constraints enforced in this file (do not reintroduce):
 * - no pricing anywhere, single CTA ("Book a demo"),
 * - no "governed by default" / "orchestrate anywhere" / "fast at scale",
 * - no numeric claim other than "1,800+ plugins" (see `lp-copy-final-v1.md`),
 * - no outbound links except the two footer legal links + one GitHub link.
 */

import type { LpProof } from "./types"

export const LP_CTA_LABEL = "Book a demo"

/** Anchor target of every CTA on the page (hero button + mobile sticky bar). */
export const LP_FORM_ANCHOR = "demo"

export const LP_SHARED = {
    hero: {
        cta: LP_CTA_LABEL,
        microcopy: "30 minutes with an engineer — on your stack, not a sales deck.",
        /**
         * Label of the placeholder box shown until a variant sets
         * `hero.image`. Set the image in the variant file (one line) and this
         * disappears — same 16/10 box, no layout shift.
         *
         * On preloading: the hero image is rendered eagerly with
         * `fetchpriority="high"` inside prerendered HTML, so the browser's
         * preload scanner finds it in the first bytes of the document. A
         * `<link rel="preload">` on top of that would have to mirror the exact
         * transformed srcset Astro emits, and downloads the image twice when it
         * doesn't — which is why there isn't one.
         */
        imagePlaceholderLabel: "TOPOLOGY_UI_SCREENSHOT",
    },

    trust: {
        line: "Run in production by enterprises across finance, public sector, and manufacturing.",
    },

    howItWorks: {
        header: "Declarative where it counts. Code where you want it.",
        body: "Every workflow is simple, declarative YAML — versioned in Git, editable from a full UI, executing your code in any language.",
    },

    enterprise: {
        header: "Enterprise-grade from day one",
        intro: "Everything your security and platform teams will ask about — built in, not bolted on.",
        /**
         * Order note: the brief lists SSO first, but self-hosted / air-gapped is
         * the #1 deployment requirement in the call corpus (×57 orgs — see
         * `voc-lp-enrichment.md` §5.5) and the guardrail checklist in
         * `claude-code-briefs.md` requires it first. Self-managed leads.
         * To revert to the brief's literal order, move it back to position 5.
         */
        items: [
            { label: "Self-managed & air-gapped", icon: "mdi:server-security" },
            { label: "SSO / SAML", icon: "mdi:shield-key-outline" },
            { label: "RBAC", icon: "mdi:account-lock-outline" },
            { label: "Audit logs", icon: "mdi:clipboard-text-clock-outline" },
            { label: "Secrets management", icon: "mdi:key-variant" },
            { label: "High availability", icon: "mdi:server-network" },
            { label: "Multi-tenancy", icon: "mdi:office-building-outline" },
            { label: "SLA support", icon: "mdi:face-agent" },
        ],
    },

    /**
     * Every quote, figure and attribution below is already published on
     * kestra.io — see the `source` on each case. That is deliberate: the copy
     * brief allows no number other than "1,800+ plugins" *without a defensible
     * source*, and a live page carrying the same claim is exactly that. Nothing
     * here waits on clearance, and nothing here was written by us.
     *
     * Do not add a case whose wording is not already public. If a stronger story
     * exists in `voc-lp-enrichment.md` §5.3, it needs Gabe's sign-off first.
     *
     * Also available and already public, if a fourth or a swap is wanted:
     * Apple ML team (200 engineers onboarded, 2× faster, 0 pipeline failures)
     * and Leroy Merlin (+900% data production, +250 users, +5,000 workflows) —
     * both in `components/home/Testimonial.astro`. A Fortune 500 hosting team
     * (VMware vRA retired, 6 months of work down to 6 days, −90% licensing) is
     * the strongest infrastructure story but names a competitor product, which
     * the VoC guardrail keeps out of paid copy — Virgile's call.
     */
    proof: {
        header: "Proof, in production",
        intro: "Three deployments, three different kinds of work, one platform underneath.",
        cases: [
            {
                logo: "jpmorgan",
                company: "JPMorgan Chase",
                context: "Data at scale, built by the analysts themselves",
                kpis: [
                    { value: "Billions", label: "of records processed securely" },
                    { value: "< 3 months", label: "from zero to full production" },
                    { value: "100+", label: "users building their own workflows" },
                ],
                quote: "We processed billions of rows and thousands of weekly API pulls in under 3 months. For the first time, our analysts aren't waiting for engineering — they're building the workflows themselves.",
                attribution: "VP of Cybersecurity, JPMorgan Chase",
                source: "kestra.io homepage — components/home/Testimonial.astro",
            },
            {
                logo: "pharmacy",
                company: "European pharmacy retailer",
                context: "Mission-critical operations off a 30-year-old platform",
                kpis: [
                    { value: "400+", label: "pharmacies rely on the workflows" },
                    { value: "50+", label: "critical workflows modernized" },
                    { value: "30+ years", label: "old platform, replaced in months" },
                ],
                quote: "Stability was the turning point. With Kestra, our most critical flows finally run the way they should.",
                attribution: "Infrastructure Lead",
                source: "kestra.io homepage — components/home/Testimonial.astro",
            },
            {
                logo: "fila",
                company: "FILA",
                context: "One platform carrying the whole company's automation",
                kpis: [
                    { value: "2.5M", label: "executions every month" },
                    { value: "2,000+", label: "workflows in production" },
                    { value: "25+", label: "engineers working in Kestra" },
                ],
                quote: "Kestra has changed how we handle data orchestration. Instead of spending days fixing issues, we now have full visibility and control. As we scale, having a system that grows with us is invaluable.",
                attribution: "John Kim, IT Lead, FILA",
                source: "kestra.io homepage — components/home/Testimonial.astro",
            },
        ],
    } satisfies LpProof,

    /**
     * What people actually orchestrate. This is the section that carries the
     * "entire stack" claim: in the 90-day call corpus, most prospects described
     * a first workflow spanning more than one of these four columns
     * (`voc-lp-enrichment.md` — 78 of 99 usable orgs). It is also where the
     * category vocabulary lives, so the page matches the ad group on more than
     * its H1.
     */
    useCases: {
        // "five tools" already carries the problem header; repeating it here
        // weakened both. This header states the answer instead.
        header: "One orchestrator, four kinds of work",
        // Carries the ad-group phrase a second time (after the H1) as an actual
        // argument rather than as keyword filler.
        intro: "Workflow orchestration is usually sold as a data problem. In practice most teams arrive with a first workflow that spans more than one of these columns — which is exactly where a single-domain tool stops being enough.",
        columns: [
            {
                icon: "mdi:database-cog-outline",
                title: "Data pipelines",
                items: [
                    "Ingestion from warehouses, lakes, APIs and SaaS sources",
                    "dbt runs that start only once ingestion has actually finished",
                    "Data-quality gates before anything downstream reads the table",
                    "Backfills across hundreds of days without hand-rolling a loop",
                ],
            },
            {
                icon: "mdi:server-network",
                title: "Infrastructure & platform",
                items: [
                    "VM, cluster and environment provisioning with Terraform or Ansible",
                    "Certificate rotation, patching and scheduled maintenance",
                    "Self-service platform actions your teams can trigger safely",
                    "Cron entries and legacy scheduler jobs, moved across as they are",
                ],
            },
            {
                icon: "mdi:account-cog-outline",
                title: "Business processes",
                items: [
                    "Employee onboarding and offboarding across directory, cloud and email",
                    "Order, invoice and settlement steps across internal systems",
                    "Reports generated and distributed on a schedule or an event",
                    "Approvals with a human step in the middle of the flow",
                ],
            },
            {
                icon: "mdi:brain",
                title: "AI & ML",
                items: [
                    "Model training and scoring on the same engine as the data feeding it",
                    "LLM and agent tasks with retries, timeouts and guardrails",
                    "Embedding and vector-store refreshes next to the pipelines that fill them",
                    "Human review before an AI decision reaches production",
                ],
            },
        ],
    },

    /**
     * Migration effort is the second-biggest objection in the corpus (×24 orgs),
     * and "do we need Kubernetes" the fourth (×4). This section answers both
     * before the FAQ has to. Wording traces to how customers described their own
     * rollouts — one workflow first, then team by team, then decommission.
     */
    adoption: {
        header: "Adoption doesn't have to be a migration project",
        intro: "Nobody who moved quickly rewrote anything on day one.",
        steps: [
            {
                when: "Week one",
                title: "One workflow, running",
                body: "Run Kestra with Docker on a VM — Kubernetes optional — and port one flow you already have. Your scripts run as they are, in whatever language they were written in.",
            },
            {
                when: "Then",
                title: "Team by team",
                body: "Move the workflows that hurt most first and leave the rest where they are. The old scheduler and Kestra run side by side for as long as you need them to.",
            },
            {
                when: "Eventually",
                title: "Retire what it replaced",
                body: "When the last flow has moved, the legacy scheduler goes with it — along with its licence, its server, and the person who was the only one who understood it.",
            },
        ],
    },

    /** Repeated conversion prompt mid-page. Same label and anchor as the hero. */
    midCta: {
        header: "See this on your own stack",
        body: "Bring a workflow you're stuck on and we'll build it live on the call.",
    },

    finalCta: {
        header: "See it on your use cases",
        sub: "Book a live demo with a Kestra engineer, tailored to your stack and your questions.",
        /**
         * What the visitor gets, next to the form. The third line is deliberate:
         * pricing opacity is the single most frequent friction in the call corpus
         * (×70 orgs, `voc-lp-enrichment.md` §5.5). Saying we will explain the
         * model on the call costs nothing, pre-qualifies the lead, and keeps the
         * no-pricing rule intact — there is no figure anywhere on this page.
         */
        agenda: [
            "A Kestra engineer on the call, not an SDR.",
            "30 minutes on your stack — bring a workflow you're stuck on and we'll build it live.",
            "Straight answers on deployment, security and how we price.",
        ],
    },

    faq: {
        header: "Questions we get on every call",
    },

    form: {
        email: {
            label: "Work email",
            placeholder: "name@company.com",
            errorEmpty: "Enter your work email.",
            errorInvalid: "That doesn't look like a valid email address.",
        },
        company: {
            label: "Company",
            placeholder: "Company name",
            errorEmpty: "Enter your company name.",
        },
        teamSize: {
            label: "Team size",
            placeholder: "Select team size",
            errorEmpty: "Select your team size.",
        },
        submit: LP_CTA_LABEL,
        submitting: "Sending…",
        reassurance:
            "We'll only use this to set up your demo — no newsletter, no spam.",
        // TODO(virgile): confirm the sales alias before launch (sales@kestra.io
        // is assumed — /contact-us routes to HubSpot, not to a public alias).
        errorServer:
            "Something went wrong on our side. Please try again — or email sales@kestra.io.",
    },

    footer: {
        copyright: "© 2026 Kestra Technologies",
        // The only three links on the entire page.
        privacy: { label: "Privacy Policy", href: "/privacy-policy" },
        // TODO(virgile): confirm the target. The site footer has no generic
        // /legal page; the MSLA is the closest published legal document.
        legal: { label: "Legal", href: "/master-software-licence-agreement" },
        github: {
            label: "Kestra is open source → GitHub",
            href: "https://github.com/kestra-io/kestra",
        },
    },

    thanks: {
        h1: "Request received — now pick your time",
        sub: "Choose a slot below. You'll meet a Kestra engineer, not an SDR.",
        fallback:
            "Can't find a time that works? We'll email you within one business day to arrange one.",
        meta: {
            title: "Book your Kestra demo",
            description:
                "Your demo request is in. Pick a time with a Kestra engineer.",
        },
    },
} as const

/**
 * Team-size options. `value` is what the user picks and what we send to
 * PostHog; `companySize` is the mapped value for the HubSpot
 * `number_of_employees` enum, which also drives meeting routing
 * (`tierFromEmployees` in `~/composables/useMeeting.js`).
 *
 * Named `companySize` rather than `employees` on purpose: it is a size bucket
 * string, not employee data, and CodeQL's clear-text-storage rule treats an
 * identifier called `employees` as personal data wherever it gets persisted.
 *
 * TODO(virgile): confirm HubSpot property + values. Two open points:
 *  1. `number_of_employees` (company object) only accepts the three strings
 *     below — a raw "11–50" submission is rejected by the Forms API, hence the
 *     mapping. A dedicated `lp_team_size` contact property would let us store
 *     the exact answer; add it in HubSpot and uncomment the field in
 *     `LpDemoForm.vue`.
 *  2. The buckets below are *team* size, while HubSpot's property is *company*
 *     size. Confirm this is acceptable or split the two.
 */
export const LP_TEAM_SIZES = [
    { value: "Just me", companySize: "below 100" },
    { value: "2–10", companySize: "below 100" },
    { value: "11–50", companySize: "below 100" },
    { value: "51–200", companySize: "between 100 and 999" },
    { value: "201–1,000", companySize: "between 100 and 999" },
    { value: "1,000+", companySize: "1000+" },
] as const

export type LpTeamSize = (typeof LP_TEAM_SIZES)[number]["value"]
