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
         * Product visual. `image` is intentionally null: the topology UI asset
         * is pending (see TODO below). While null, a labelled placeholder box
         * with the same 16/10 aspect ratio renders, so dropping the asset in
         * causes zero layout shift.
         *
         * TODO(virgile): when the asset lands, set `image` to the imported
         * asset in each variant file (or here, if shared) — `LpHero.astro`
         * already renders it with `loading="eager"`, `fetchpriority="high"`
         * and a `<link rel="preload">` emitted from `LpLayout.astro`.
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

    proof: {
        header: "Proof, in production",
        /**
         * Default state is the case-study card with placeholder strings.
         * NOTHING here is cleared for publication.
         * TODO(virgile): replace with the cleared case study + metric from
         * `voc-lp-enrichment.md` §5.3 once Gabe signs off, then delete the
         * PENDING_CLEARANCE markers. Until then this section must not ship live.
         */
        state: "case",
        case: {
            metric: "PENDING_CLEARANCE — metric headline",
            summary:
                "PENDING_CLEARANCE — two-line summary of the deployment: what it replaced, what it now runs, at what scale.",
            quote: "PENDING_CLEARANCE — one approved sentence in the customer's own words.",
            attribution:
                "— Head of Platform Engineering, Global Financial Services Company",
        },
        stats: [
            { value: "PENDING_CLEARANCE", label: "Stat 1 label" },
            { value: "PENDING_CLEARANCE", label: "Stat 2 label" },
            { value: "PENDING_CLEARANCE", label: "Stat 3 label" },
        ],
    } satisfies LpProof & { header: string },

    finalCta: {
        header: "See it on your use cases",
        sub: "Book a live demo with a Kestra engineer, tailored to your stack and your questions.",
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
 * PostHog; `employees` is the mapped value for the HubSpot
 * `number_of_employees` enum, which also drives meeting routing
 * (`tierFromEmployees` in `~/composables/useMeeting.js`).
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
    { value: "Just me", employees: "below 100" },
    { value: "2–10", employees: "below 100" },
    { value: "11–50", employees: "below 100" },
    { value: "51–200", employees: "between 100 and 999" },
    { value: "201–1,000", employees: "between 100 and 999" },
    { value: "1,000+", employees: "1000+" },
] as const

export type LpTeamSize = (typeof LP_TEAM_SIZES)[number]["value"]
