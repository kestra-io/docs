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

const pipelineStageSchema = z.object({
    id: z.string(),
    label: z.string(),
    items: z.array(z.string()),
})

const pipelineSchema = z.object({
    title: z.string(),
    lead: z.string(),
    footer: z.string().optional(),
    stages: z.array(pipelineStageSchema),
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
    code: z.string(),
    plugins: z.array(z.string()),
    href: z.string().optional(),
})

const blueprintsSchema = z.object({
    title: z.string(),
    lead: z.string(),
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

const faqItemSchema = z.object({
    question: z.string(),
    answer: z.string(),
})

const seeHowSchema = z.object({
    title: z.string(),
    description: z.string(),
    cta: ctaSchema.optional(),
})

export const orchestrateSchema = z.object({
    title: z.string(),
    description: z.string(),
    tool: z.object({
        name: z.string(),
        pluginClass: z.string(),
        color: z.string().optional(),
    }),
    hero: heroSchema,
    pipeline: pipelineSchema.optional(),
    pillars: pillarsSchema,
    useCases: useCasesSchema,
    quotes: z.array(quoteSchema),
    blueprints: blueprintsSchema,
    comparison: comparisonSchema,
    faq: z.array(faqItemSchema),
    seeHow: seeHowSchema,
})

export type OrchestrateData = z.infer<typeof orchestrateSchema>
