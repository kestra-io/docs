import { defineCollection } from "astro:content"
import { z } from "astro/zod"
import { file, glob } from "astro/loaders"
import generateId from "~/utils/generateId"
import { vsSchema } from "./schemas/vs"
import { orchestrationSchema } from "./schemas/orchestration"

export const collections = {
    docs: defineCollection({
        loader: glob({
            pattern: "./**/*.md{,x}",
            base: "./src/contents/docs",
            generateId,
        }),
        schema: () =>
            z.object({
                title: z.string(),
                h1: z.string().optional(),
                updated: z.coerce.date().optional(),
                sidebarTitle: z.string().optional(),
                description: z.string().optional(),
                icon: z.string().optional(),
                release: z.string().optional(),
                version: z.string().optional(),
                editions: z.array(z.enum(["OSS", "EE", "Cloud"])).optional(),
                topics: z.array(z.string()).optional(),
                stage: z.string().optional(),
                hideSubMenus: z.boolean().optional(),
                hideSidebar: z.boolean().optional(),
                deprecated: z
                    .object({
                        since: z.string(),
                        migrationGuide: z.string(),
                    })
                    .optional(),
            }),
    }),
    blogs: defineCollection({
        loader: glob({
            pattern: "./**/*.md{,x}",
            base: "./src/contents/blogs",
            generateId: (opts) => generateId(opts).toLowerCase(),
        }),
        schema: ({ image }) =>
            z.object({
                title: z.string(),
                description: z.string().optional(),
                date: z.date(),
                category: z.string(),
                author: z
                    .object({
                        name: z.string(),
                        image: z.string(),
                        twitter: z.string().optional(),
                        linkedin: z.string().optional(),
                        medium: z.string().optional(),
                        role: z.string().nullable().optional(),
                    })
                    .optional(),
                authors: z
                    .array(
                        z.object({
                            name: z.string(),
                            image: z.string(),
                            twitter: z.string().optional(),
                            linkedin: z.string().optional(),
                            medium: z.string().optional(),
                            role: z.string().nullable().optional(),
                        }),
                    )
                    .optional(),
                image: image().optional(),
                updated: z.coerce.date().optional(),
                rightBar: z.boolean().optional(),
                plugins: z.array(z.string()).optional(),
                schema: z.record(z.string(), z.unknown()).optional(),
            }),
    }),
    legal: defineCollection({
        loader: glob({
            pattern: "./*.md{,x}",
            base: "./src/contents/legal",
            generateId,
        }),
        schema: z.object({
            title: z.string(),
            description: z.string().optional(),
            icon: z.string().optional(),
        }),
    }),
    vs: defineCollection({
        loader: glob({
            pattern: "./*.{yaml,yml}",
            base: "./src/contents/vs",
        }),
        schema: vsSchema,
    }),
    orchestration: defineCollection({
        loader: glob({
            pattern: "./*.{yaml,yml}",
            base: "./src/contents/orchestration",
        }),
        schema: orchestrationSchema,
    }),
    externalBlogs: defineCollection({
        loader: glob({
            pattern: "./**/index.yml",
            base: "./src/contents/external-blogs",
            generateId,
        }),
        schema: ({ image }) =>
            z.object({
                title: z.string(),
                link: z.string(),
                image: image(),
                media: z.string(),
                author: z.string(),
                publicationDate: z.coerce.date(),
            }),
    }),
    customerStories: defineCollection({
        loader: glob({
            pattern: "./**/index.md",
            base: "./src/contents/customer-stories",
            generateId,
        }),
        schema: ({ image }) =>
            z.object({
                title: z.string(),
                description: z.string(),
                metaTitle: z.string(),
                metaDescription: z.string(),
                heroImage: image(),
                featured: z.boolean().optional().default(false),
                featuredImage: image(),
                logo: image().optional(),
                logoDark: image().optional(),
                logoIcon: image().optional(),
                rank: z.number(),
                tasks: z.array(z.string()),
                kpi1: z.string(),
                kpi2: z.string(),
                kpi3: z.string(),
                kpi4: z.string().optional(),
                quote: z.string(),
                quotePerson: z.string(),
                quotePersonTitle: z.string(),
                industry: z.string(),
                region: z.string(),
                headquarter: z.string(),
                solution: z.string(),
                tagline: z.string().optional(),
                excerpt: z.string().optional(),
                companyName: z.string(),
                intro: z.string().optional(),
                deployment: z.string().optional(),
                useCase: z.string().optional(),
                useCaseShort: z.string().optional(),
                companySize: z.string().optional(),
                cta: z.string().optional(),
            }),
    }),
    tutorialVideos: defineCollection({
        loader: glob({
            pattern: "./*.{yaml,yml}",
            base: "./src/contents/tutorial-videos",
        }),
        schema: z.object({
            title: z.string(),
            description: z.string().optional(),
            category: z.string(),
            author: z.string(),
            url: z.string(),
            publicationDate: z.coerce.date(),
            isFeatured: z.boolean().optional(),
            contentType: z.string().optional(),
        }),
    }),
    annonces: defineCollection({
        loader: file("src/contents/annonces/annonces.yml"),
        schema: z.object({
            id: z.number(),
            text: z.string(),
            href: z.string(),
            linkText: z.string(),
        }),
    }),
    redirects: defineCollection({
        loader: glob({
            pattern: "./*.{yaml,yml}",
            base: "./src/contents/redirects",
        }),
        schema: z.array(
            z.object({
                regexp: z.string(),
                to: z.string(),
            }),
        ),
    }),
    resources: defineCollection({
        loader: glob({
            pattern: "./**/*.md{,x}",
            base: "./src/contents/resources",
            generateId: (opts) => generateId(opts).toLowerCase(),
        }),
        schema: ({ image }) =>
            z.object({
                title: z.string(),
                description: z.string().optional(),
                metaTitle: z.string().optional(),
                metaDescription: z.string().optional(),
                tag: z.enum(["infrastructure", "data", "ai", "whitepapers"]),
                date: z.coerce.date().optional(),
                image: image().optional(),
                href: z.string().optional(),
                faq: z
                    .array(
                        z.object({
                            question: z.string(),
                            answer: z.string(),
                        }),
                    )
                    .optional(),
                schema: z.record(z.string(), z.unknown()).optional(),
            }),
    }),
    feeds: defineCollection({
        loader: glob({
            pattern: "./**/index.md",
            base: "./src/contents/feeds",
            generateId,
        }),
        schema: ({ image }) =>
            z.object({
                title: z.string(),
                link: z.string(),
                href: z.string(),
                image: image().optional(),
                publicationDate: z.coerce.date(),
                addedDate: z.coerce.date(),
            }),
    }),
}

