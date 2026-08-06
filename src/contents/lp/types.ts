/**
 * Typed content contract for the Google Ads landing pages (`/lp/*`).
 *
 * These pages share ONE template (`~/components/lp/LpTemplate.astro`) and one
 * minimal layout (`~/components/lp/LpLayout.astro`). A variant may only change
 * the fields declared in `LpVariant`; everything else lives in `./shared.ts`
 * so the three pages stay structurally identical (strict message match on the
 * H1, identical funnel below it).
 */

export type LpVariantSlug =
    | "workflow-orchestration"
    | "data-orchestration"
    | "orchestration-tools"

export interface LpMeta {
    /** Full <title>. Written out in full — the LP layout adds no " | Kestra" suffix. */
    title: string
    description: string
    ogTitle: string
}

export interface LpBenefitCard {
    /** mdi icon name (same set as the rest of the site). */
    icon: string
    /** Bold lead phrase. */
    lead: string
    body: string
}

export interface LpKpi {
    /** Published figure, e.g. "< 3 Months". */
    value: string
    label: string
}

export interface LpProofCase {
    /** Key into the logo map in `LpProof.astro`. */
    logo: string
    /** Company or, where the story is published anonymously, its description. */
    company: string
    /** One line of context: what domain this proves. */
    context: string
    kpis: readonly [LpKpi, LpKpi, LpKpi]
    quote: string
    attribution: string
    /**
     * Where this exact wording is already published on kestra.io. Every figure
     * and quote on the LP must trace to a live page — that is what makes it a
     * defensible claim rather than a number we invented. Not rendered.
     */
    source: string
}

export interface LpProof {
    header: string
    intro: string
    cases: readonly LpProofCase[]
}

export interface LpUseCase {
    icon: string
    title: string
    /** Readonly: the shared content object is declared `as const`. */
    items: readonly string[]
}

export interface LpAdoptionStep {
    /** Short time marker, e.g. "Week one". */
    when: string
    title: string
    body: string
}

export interface LpRoiStat {
    /** Whether the number moves up (gain) or down (reduction). */
    direction: "up" | "down"
    /** Range as shown, e.g. "20–40%". */
    value: string
    label: string
    /** The mechanism behind the range — why it moves. */
    why: string
}

export interface LpFaqItem {
    question: string
    answer: string
}

export interface LpLogoBar {
    enabled: boolean
    /**
     * File stems of SVGs in `src/components/home/assets/companies/` — the same
     * assets the kestra.io homepage logo bar uses, so a design update to a logo
     * lands on both at once and the LP can only ever show a logo that is
     * already public on the site.
     */
    companies: string[]
}

export interface LpVariant {
    slug: LpVariantSlug
    meta: LpMeta
    /**
     * H1 + sub only. No product visual and no CTA button: the demo form itself
     * renders in the hero (see `LpHero.astro`).
     */
    hero: {
        h1: string
        sub: string
    }
    /**
     * The outcome cards — one section carrying what used to be "problem" and
     * "benefits". The rule (PR #5276 review): the visitor who clicked the ad
     * already knows their pain; every bullet states what they gain, and the
     * pain stays implicit inside it. No re-explaining, no comparative claims.
     */
    benefits: {
        header: string
        cards: [LpBenefitCard, LpBenefitCard, LpBenefitCard]
    }
    /**
     * Per-variant override of the shared proof block. Usually just `cases`,
     * picked from `LP_PROOF_CASES` so the evidence leans the way the page does.
     */
    proof?: Partial<LpProof>
    /**
     * Per-variant override of the final CTA copy. The brief gives each variant a
     * different closing line ("on your pipelines", "your migration"), so this is
     * the one shared block variants are expected to reach into.
     */
    finalCta?: {
        header?: string
        sub?: string
    }
    /**
     * Objection-handling accordion, last section before the closing CTA anchor.
     */
    faq?: {
        enabled: boolean
        items: LpFaqItem[]
    }
    /**
     * Logo bar under the trust line. Renders below the line, so turning it on
     * or off never moves anything above it.
     */
    logos?: LpLogoBar
}
