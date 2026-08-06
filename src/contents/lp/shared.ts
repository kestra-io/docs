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

import type { LpProof, LpProofCase, LpRoiStat } from "./types"

export const LP_CTA_LABEL = "Book a demo"

/** Anchor target of every CTA on the page (hero button + mobile sticky bar). */
export const LP_FORM_ANCHOR = "demo"

/**
 * Cleared customer proof. Every quote, figure and attribution here is already
 * published on kestra.io — see each `source`. That is what makes the numbers
 * defensible rather than invented: the copy brief allows no figure other than
 * "1,800+ plugins" *without a defensible source*, and a live page carrying the
 * same claim is exactly that. Nothing here waits on clearance, and nothing here
 * was written by us.
 *
 * Do not add a case whose wording is not already public. A stronger story from
 * `voc-lp-enrichment.md` §5.3 needs Gabe's sign-off first.
 *
 * Deliberately absent: a Fortune 500 hosting team (VMware vRA retired, 6 months
 * of work down to 6 days, −90% licensing) is the strongest infrastructure story
 * on the homepage, but it names a competitor product, which the VoC guardrail
 * keeps out of paid copy. Add it only on Virgile's call.
 */
export const LP_PROOF_CASES = {
    jpmorgan: {
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
    pharmacy: {
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
    fila: {
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
    leroymerlin: {
        logo: "leroymerlin",
        company: "Leroy Merlin",
        context: "A data platform the whole company builds on",
        kpis: [
            { value: "+900%", label: "in data production" },
            { value: "250+", label: "active users" },
            { value: "5,000+", label: "workflows created" },
        ],
        quote: "Kestra is the unifying layer for our data and workflows. You can start small, but then there is no limit to the possibilities and scalability of such an open architecture.",
        attribution: "Julien Henrion, Head of Data Engineering",
        source: "kestra.io homepage — components/home/Testimonial.astro",
    },
    apple: {
        logo: "apple",
        company: "Apple (ML team)",
        context: "Large-scale ML pipelines, no orchestration code to maintain",
        kpis: [
            { value: "200", label: "engineers onboarded" },
            { value: "2×", label: "faster workflow creation" },
            { value: "0", label: "pipeline failures" },
        ],
        quote: "Kestra delivers end-to-end automation with the robustness we need at our scale. Few companies operate at this level, especially in AI/ML.",
        attribution: "Senior Engineering Manager, ML team @ Apple",
        source: "kestra.io homepage and /demo — components/home/Testimonial.astro",
    },
} as const satisfies Record<string, LpProofCase>

export const LP_SHARED = {
    hero: {
        /** Button label — the single conversion CTA, never reworded. */
        cta: "Book a demo",
        /**
         * Form-card heading + line. Benchmark-aligned (Stonebranch, Redwood —
         * 2026-08-06): the category says "Get/Schedule a Demo", nobody says
         * "discuss", and the ad → card → button chain should carry ONE ask.
         * "custom" carries the differentiator; "fits your architecture" is the
         * direction Martin-Pierre validated.
         */
        formTitle: "Get a custom demo",
        microcopy:
            "See where Kestra fits your architecture, on your use cases, not a generic script.",
    },

    trust: {
        line: "Run in production by enterprises across finance, public sector, and manufacturing.",
    },

    proof: {
        header: "Proof, in production",
        intro: "Three deployments, three different kinds of work, one platform underneath.",
        // Variants override `cases` to lean their own way — see LP_PROOF_CASES.
        cases: [
            LP_PROOF_CASES.jpmorgan,
            LP_PROOF_CASES.pharmacy,
            LP_PROOF_CASES.fila,
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
        // Wording from the PR #5276 review (2026-08-06) — "Unified" is the
        // positioning word Gabe wants everywhere.
        header: "Unified Orchestration Across Your Stack",
        intro: "API-first, with 1,800+ plugins for your databases, clouds, and internal systems — workflow orchestration stops being a per-team tooling decision.",
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
     * Migration effort is the second-biggest objection in the corpus (×24 orgs).
     * Kept deliberately non-technical (PR #5276 review: the earlier version
     * talked Docker/VM/Kubernetes — that conversation belongs in the FAQ):
     * three steps, each an outcome, no infrastructure vocabulary.
     */
    adoption: {
        header: "The Kestra journey",
        intro: "Nobody who moved quickly rewrote anything on day one.",
        steps: [
            {
                when: "Week one",
                title: "One workflow, running",
                body: "Start with one workflow you already have. Your scripts run as they are, in whatever language they were written in.",
            },
            {
                when: "Then",
                title: "Team by team",
                body: "Move the workflows that hurt most first. Whatever you run today keeps running alongside Kestra for as long as you need it to.",
            },
            {
                when: "Eventually",
                title: "Retire what it replaced",
                body: "When the last workflow has moved, the old tools go with it — along with their licenses, their servers, and their maintenance.",
            },
        ],
    },

    /** Closing CTA after the FAQ — anchors back up to the form (#demo). */
    midCta: {
        header: "See this on your own stack",
        body: "Get a demo tailored to your use cases and your architecture.",
    },


    /**
     * ROI. Content mirrors the "Kestra ROI — Typical Impact After Standardizing
     * Orchestration" slide of the enterprise sales deck (provided by Virgile,
     * 2026-08-05, in the PR #5276 review). ⚠️ These ranges are not published
     * anywhere public yet — this page is their first public appearance, so they
     * need Gabe's sign-off before spend starts. The "typical impact" framing is
     * load-bearing: ranges, not promises.
     */
    roi: {
        header: "The ROI of standardizing orchestration",
        intro: "Typical impact once the schedulers, cron jobs, and point tools run on one platform.",
        stats: [
            {
                direction: "up",
                value: "20–40%",
                label: "Engineering productivity",
                why: "Reuse of blueprints and plugins, plus guided authoring, reduces rework and review cycles.",
            },
            {
                direction: "down",
                value: "30–60%",
                label: "Ops effort",
                why: "Targeted replay, built-in observability, and deterministic runs reduce incidents and time-to-recovery.",
            },
            {
                direction: "down",
                value: "10–30%",
                label: "Infra waste",
                why: "Partial replays and targeted reruns cut reprocessing compute, storage, and network.",
            },
            {
                direction: "down",
                value: "15–35%",
                label: "Tool spend",
                why: "Consolidating one to three overlapping tools reduces license and run costs.",
            },
        ] satisfies readonly LpRoiStat[],
        /**
         * Auto-scrolling quote carousel. All three are already published:
         * Leroy Merlin from the enterprise deck's ROI slide, USCCA from /cloud,
         * Quadis from /use-cases/automotive — wording verbatim, logos from the
         * same repo assets those pages use.
         */
        quotes: [
            {
                logo: "leroymerlin",
                text: "Kestra allowed us to move from fragmented automation to a unified control plane — secure, scalable, and manageable by all our teams.",
                attribution: "Leroy Merlin",
            },
            {
                logo: "uscca",
                text: "We didn't have centralized orchestration. That's where Kestra plays the most important role: all the fragmented production pipelines orchestrated through it.",
                attribution: "Shilpa Pauly, Data Engineer, USCCA",
            },
            {
                logo: "quadis",
                text: "We're convinced to have chosen the right tool. The support and communication are great, it's easy to adapt to any tool, and easy for any team to understand.",
                attribution: "Rubén Boniz Martinez, Senior Engineering Manager, Quadis",
            },
        ],
    },

    /**
     * Custom-demo framing per the PR #5276 review (2026-08-06): the earlier
     * agenda promised "an engineer, not an SDR" and "we'll build it live" —
     * neither is true of the actual sales call. Every line below is a product
     * claim the demo can honour. The pricing line stays: pricing opacity is the
     * #1 friction in the call corpus (×70 orgs) and there is still no figure
     * anywhere on the page.
     */
    finalCta: {
        header: "See it on your use cases",
        sub: "Get a custom demo — event-driven orchestration, full observability, and governance across your data, infrastructure, and business processes.",
        agenda: [
            "A demo tailored to your use cases and your architecture — not a generic script.",
            "Deployment options — self-managed, air-gapped, or cloud — and the migration path from what you run today.",
            "A clear view of how Kestra fits your platform, and straight answers on how we price.",
        ],
    },

    faq: {
        header: "Questions we get on every call",
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
        sub: "Choose a slot below — we'll come prepared for your stack.",
        fallback:
            "Can't find a time that works? We'll email you within one business day to arrange one.",
        meta: {
            title: "Book your Kestra demo",
            description:
                "Your demo request is in. Pick a time with a Kestra engineer.",
        },
    },
} as const

