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
    /** Bold lead phrase. */
    lead: string
    body: string
}

export interface LpProofCase {
    /** Metric headline, e.g. "$3M saved over 5 years". */
    metric: string
    /** Two-line summary under the metric. */
    summary: string
    quote: string
    /** Anonymized attribution — never a client name until Gabe clears it. */
    attribution: string
}

export interface LpProofStat {
    value: string
    label: string
}

export interface LpProof {
    /**
     * Which state renders. `case` = quote card (default), `stats` = 3-stat row.
     * Both states are built; this flag picks one without a code change.
     */
    state: "case" | "stats"
    case: LpProofCase
    stats: LpProofStat[]
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
    hero: {
        h1: string
        sub: string
        /**
         * Product visual, imported from `src/components/lp/assets/`. Rendered
         * eagerly at high fetch priority — it is the LCP candidate on desktop.
         * When absent, `LpHero` draws the labelled placeholder box at the same
         * 16/10 ratio, so adding the asset shifts nothing.
         */
        image?: ImageMetadata
        /** Required whenever `image` is set: what the screenshot shows. */
        imageAlt?: string
        /**
         * How the image fills the 16/10 frame.
         * - `cover` (default) crops from the top: right for a tall topology
         *   capture, which then reads as a flow continuing past the frame.
         * - `contain` shows the whole image, for a full-UI capture whose own
         *   chrome must not be cut. The frame drops its border in this mode,
         *   since such screenshots carry their own.
         */
        imageFit?: "cover" | "contain"
    }
    problem: {
        header: string
        pains: [string, string, string]
    }
    benefits: {
        header: string
        cards: [LpBenefitCard, LpBenefitCard, LpBenefitCard]
    }
    /** YAML sample rendered in section 5. Syntax-highlighted, never an image. */
    yaml: string
    /** Per-variant override of the shared proof placeholders. */
    proof?: Partial<LpProof>
    /**
     * Objection-handling accordion. NOT part of the 9-section spec, so it is
     * OFF by default; flip `enabled` to render it between Enterprise and Proof.
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
