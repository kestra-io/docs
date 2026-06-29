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
    philosophy: z.object({ mainTitle: z.string(), kestra: textSide, competitor: textSide }),
    businessValue: z.object({ mainTitle: z.string(), kestra: textSide, competitor: textSide, footerText: z.string().optional() }),
    setupSpeed: z.object({ title: z.string(), subtitle: z.string().optional(), kestra: timedSide, competitor: timedSide }),
    easeOfUse: z.object({ title: z.string(), kestra: codeSide, competitor: codeSide }),
    visualPreview: z.object({
        mainTitle: z.string(),
        kestra: z.object({ description: z.string() }),
        competitor: z.object({ description: z.string(), shadowColor: z.string().optional() }),
    }),
    featureGrid: z.object({ title: z.string(), tableData: z.array(featureRow) }),
    testimonials: z.array(
        z.object({
            quote: z.string(),
            author: z.string(),
            kpis: z.array(z.object({ name: z.string(), value: z.string() })),
            storyLink: z.string().optional(),
        })
    ),
    platformStrengths: z.object({ title: z.string(), features: z.array(strengthItem) }),
    decisionGuide: z.object({ mainTitle: z.string(), kestra: textSide, competitor: textSide }),
    commonQuestions: z.array(qaItem),
    seeHowTitle: z.string().optional(),
    seeHowBody: z.string().optional(),
    secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
    logoFile: z.string().optional(),
    imgFile: z.string().optional(),
})