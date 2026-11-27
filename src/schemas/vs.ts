import { z } from "astro/zod"

const qaItem = z.object({ question: z.string(), answer: z.string() })
const side = z.object({ title: z.string(), list: z.array(z.string()) })
const mechanics = z.object({ title: z.string(), text: z.string(), list: z.array(z.string()) })
const terminal = z.object({ title: z.string(), tag: z.string(), text: z.string(), code: z.string() })
const link = z.object({ label: z.string(), href: z.string() })

export const vsSchema = z.object({
    title: z.string(),
    description: z.string(),
    competitorName: z.string(),
    category: z.enum(["Data Orchestration", "Infrastructure Automation", "Business Automation"]),
    shortDescription: z.string(),
    brandColor: z.object({
        color: z.string(),
        gradient: z.string().optional(),
    }),
    intro: z.object({ title: z.string(), description: z.string() }),
    choose: z.object({
        title: z.string(),
        lead: z.string().optional(),
        kestra: side,
        competitor: side,
    }),
    table: z.object({
        title: z.string(),
        lead: z.string().optional(),
        rows: z.array(z.object({ label: z.string(), competitor: z.string(), kestra: z.string() })),
    }),
    proof: z
        .object({
            title: z.string(),
            stories: z.array(
                z.object({
                    story: z.string(),
                    industry: z.string(),
                    stat: z.string(),
                    label: z.string(),
                    quote: z.string().optional(),
                    author: z.string().optional(),
                }),
            ),
        })
        .optional(),
    architecture: z
        .object({
            title: z.string(),
            lead: z.string().optional(),
            competitor: mechanics,
            kestra: mechanics,
        })
        .optional(),
    compare: z
        .object({
            title: z.string(),
            lead: z.string(),
            cta: link.optional(),
            competitor: z.object({ label: z.string(), file: z.string(), lang: z.string(), code: z.string() }),
            kestra: z.object({ code: z.string() }),
        })
        .optional(),
    setup: z
        .object({
            title: z.string(),
            lead: z.string().optional(),
            competitor: terminal,
            kestra: terminal,
        })
        .optional(),
    pairs: z
        .array(
            z.object({
                title: z.string(),
                lead: z.string().optional(),
                columns: z
                    .array(
                        z.object({
                            label: z.string(),
                            brand: z.enum(["competitor", "kestra"]).optional(),
                            text: z.string(),
                        }),
                    )
                    .length(2),
            }),
        )
        .optional(),
    faqTitle: z.string().optional(),
    commonQuestions: z.array(qaItem),
    secondaryCta: link.optional(),
    guideCta: z
        .object({
            eyebrow: z.string().optional(),
            title: z.string(),
            description: z.string(),
            cta: link,
        })
        .optional(),
    logoFile: z.string().optional(),
    related: z
        .object({
            alternatives: z.string().optional(),
            comparisons: z.array(z.string()).default([]),
        })
        .optional(),
})
