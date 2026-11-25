import { z } from "astro/zod"

const textSide = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    list: z.array(z.string()).optional(),
    subCardText: z.string().optional(),
    shadowColor: z.string().optional(),
    subCardBg: z.string().optional(),
    bulletColor: z.string().optional(),
})

const codeSide = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    shadowColor: z.string().optional(),
    code: z.string().optional(),
    lang: z.string().optional(),
})

const timedSide = z.object({
    title: z.object({ one: z.string(), two: z.string() }),
    description: z.string().optional(),
    shadowColor: z.string().optional(),
    subCardBg: z.string().optional(),
    command: z.string().optional(),
    lang: z.string().optional(),
})

const qaItem = z.object({ question: z.string(), answer: z.string() })
const featureRow = z.object({ feature: z.string(), kestra: z.string(), competitor: z.string() })
const strengthItem = z.object({ title: z.string(), description: z.string() })
const textCard = z.object({ title: z.string(), body: z.string() })

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
    philosophy: z.object({ mainTitle: z.string(), kestra: textSide, competitor: textSide }).optional(),
    businessValue: z.object({ mainTitle: z.string(), kestra: textSide, competitor: textSide, footerText: z.string().optional() }).optional(),
    setupSpeed: z.object({ title: z.string(), subtitle: z.string().optional(), kestra: timedSide, competitor: timedSide }).optional(),
    easeOfUse: z.object({ title: z.string(), kestra: codeSide, competitor: codeSide }).optional(),
    // Optional text-only section of side-by-side cards (markdown body), rendered after easeOfUse.
    cardSection: z.object({ title: z.string(), cards: z.array(textCard) }).optional(),
    visualPreview: z.object({
        mainTitle: z.string(),
        kestra: z.object({ description: z.string() }),
        competitor: z.object({ description: z.string(), shadowColor: z.string().optional() }),
    }).optional(),
    featureGrid: z.object({ title: z.string(), tableData: z.array(featureRow) }).optional(),
    testimonials: z.array(
        z.object({
            quote: z.string(),
            author: z.string(),
            kpis: z.array(z.object({ name: z.string(), value: z.string() })),
            storyLink: z.string().optional(),
        })
    ).optional(),
    platformStrengths: z.object({ title: z.string(), features: z.array(strengthItem) }).optional(),
    decisionGuide: z.object({ mainTitle: z.string(), kestra: textSide, competitor: textSide }).optional(),
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
    table: z
        .object({
            title: z.string(),
            lead: z.string().optional(),
            rows: z.array(z.object({ label: z.string(), competitor: z.string(), kestra: z.string() })),
        })
        .optional(),
    compare: z
        .object({
            title: z.string(),
            lead: z.string(),
            cta: z.object({ label: z.string(), href: z.string() }).optional(),
            competitor: z.object({ label: z.string(), file: z.string(), lang: z.string(), code: z.string() }),
            kestra: z.object({ code: z.string() }),
        })
        .optional(),
    choose: z
        .object({
            title: z.string(),
            lead: z.string().optional(),
            kestra: z.object({ title: z.string(), list: z.array(z.string()) }),
            competitor: z.object({ title: z.string(), list: z.array(z.string()) }),
        })
        .optional(),
    architecture: z
        .object({
            title: z.string(),
            lead: z.string().optional(),
            competitor: z.object({ title: z.string(), text: z.string(), list: z.array(z.string()) }),
            kestra: z.object({ title: z.string(), text: z.string(), list: z.array(z.string()) }),
        })
        .optional(),
    setup: z
        .object({
            title: z.string(),
            lead: z.string().optional(),
            competitor: z.object({ title: z.string(), tag: z.string(), text: z.string(), code: z.string() }),
            kestra: z.object({ title: z.string(), tag: z.string(), text: z.string(), code: z.string() }),
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
    seeHowTitle: z.string().optional(),
    seeHowBody: z.string().optional(),
    secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
    guideCta: z
        .object({
            eyebrow: z.string().optional(),
            title: z.string(),
            description: z.string(),
            cta: z.object({ label: z.string(), href: z.string() }),
        })
        .optional(),
    logoFile: z.string().optional(),
    imgFile: z.string().optional(),
})