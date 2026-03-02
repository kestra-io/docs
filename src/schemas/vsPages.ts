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
const metric = z.object({ value: z.string(), label: z.string() })
const featureRow = z.object({ feature: z.string(), kestra: z.string(), competitor: z.string() })
const strengthItem = z.object({ title: z.string(), description: z.string() })

export const vsPagesSchema = z.object({
    title: z.string(),
    description: z.string(),
    competitorName: z.string(),
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
    socialProof: z.object({
        image: z.object({ alt: z.string(), width: z.number().optional(), height: z.number().optional() }),
        quote: z.object({ text: z.string(), author: z.string() }),
        metrics: z.array(metric),
        cta: z.object({ text: z.string().optional(), link: z.string() }),
        theme: z.string().optional(),
    }),
    platformStrengths: z.object({ title: z.string(), features: z.array(strengthItem) }),
    decisionGuide: z.object({ mainTitle: z.string(), kestra: textSide, competitor: textSide }),
    commonQuestions: z.array(qaItem),
})

