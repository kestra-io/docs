import { z } from "astro/zod"

const ctaSchema = z.object({
    label: z.string(),
    href: z.string(),
})

const heroSchema = z.object({
    title: z.string(),
    description: z.string(),
    cta: ctaSchema,
    secondaryCta: ctaSchema.optional(),
})

const pillarSchema = z.object({
    icon: z.string(),
    title: z.string(),
    description: z.string(),
})

const pillarsSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    items: z.array(pillarSchema),
})

const useCaseStepSchema = z.object({
    node: z.string(),
    label: z.string().optional(),
    gate: z.boolean().optional(),
    pluginClass: z.string().optional(),
})

const useCaseItemSchema = z.object({
    title: z.string(),
    description: z.string(),
    wide: z.boolean().optional(),
})

const useCaseSchema = z.object({
    badge: z.string(),
    badgeIcon: z.string().optional(),
    title: z.string(),
    description: z.string(),
    flow: z.array(useCaseStepSchema),
    items: z.array(useCaseItemSchema).optional(),
    signal: z.string().optional(),
})

const useCasesSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    items: z.array(useCaseSchema),
})

const quoteSchema = z.object({
    quote: z.string(),
    author: z.string(),
    storyLink: z.string().optional(),
    sourceUrl: z.string().optional(),
    sourceLabel: z.string().optional(),
    logoFile: z.string().optional(),
    kpis: z
        .array(
            z.object({
                name: z.string(),
                value: z.string(),
            }),
        )
        .optional(),
})

const blueprintSchema = z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    blueprintId: z.string(),
})

const blueprintsSchema = z.object({
    title: z.string(),
    items: z.array(blueprintSchema),
})

const comparisonRowSchema = z.object({
    feature: z.string(),
    kestra: z.string(),
    values: z.array(z.string()),
})

const competitorSchema = z.object({
    name: z.string(),
    pluginClass: z.string().optional(),
    logoAsset: z.string().optional(),
})

const comparisonSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    competitors: z.array(competitorSchema),
    rows: z.array(comparisonRowSchema),
})

const postCompareCtaSchema = z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    description: z.string(),
    cta: ctaSchema,
})

const faqItemSchema = z.object({
    question: z.string(),
    answer: z.string(),
})

const seeHowSchema = z.object({
    title: z.string(),
    description: z.string(),
    cta: ctaSchema.optional(),
})

const resourceItemSchema = z.object({
    kind: z.enum([
        "how-to",
        "blueprint",
        "story",
        "blog",
        "plugin",
        "docs",
        "resource",
    ]),
    title: z.string(),
    description: z.string(),
    href: z.string(),
    image: z.string().optional(),
})

const resourcesSchema = z.object({
    title: z.string(),
    lead: z.string().optional(),
    items: z.array(resourceItemSchema),
})

/** A literal, quotable answer to the page's main question, shown under the hero. */
const answerSchema = z.object({
    question: z.string(),
    text: z.string(),
})

/** Step-by-step "how do I" section with one complete, copyable flow. */
const howToSchema = z.object({
    title: z.string(),
    intro: z.string().optional(),
    steps: z.array(
        z.object({
            title: z.string(),
            description: z.string(),
        }),
    ),
    flow: z
        .object({
            caption: z.string().optional(),
            code: z.string(),
        })
        .optional(),
})

/** Tool categories, in the order the /orchestration filter tabs show them. */
export const ORCHESTRATION_CATEGORIES = [
    "Infrastructure",
    "Cloud",
    "Data",
    "Business",
    "AI",
] as const

export const orchestrationSchema = z.object({
    title: z.string(),
    description: z.string(),
    tool: z.object({
        name: z.string(),
        pluginClass: z.string(),
        category: z.enum(ORCHESTRATION_CATEGORIES),
        color: z.string().optional(),
    }),
    hero: heroSchema,
    answer: answerSchema.optional(),
    howTo: howToSchema.optional(),
    /** Last content review, shown on the page and emitted as dateModified. */
    updated: z.coerce.date().optional(),
    nutshell: z.string().optional(),
    pillars: pillarsSchema,
    useCases: useCasesSchema,
    quotes: z.array(quoteSchema),
    blueprints: blueprintsSchema,
    comparison: comparisonSchema,
    postCompareCta: postCompareCtaSchema.optional(),
    guideCta: postCompareCtaSchema.optional(),
    faq: z.array(faqItemSchema),
    seeHow: seeHowSchema,
    resources: resourcesSchema.optional(),
})

export type OrchestrationData = z.infer<typeof orchestrationSchema>
