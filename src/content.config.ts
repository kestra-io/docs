import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"
import generateId from "~/utils/generateId"
import { vsPagesSchema } from "./schemas/vsPages"

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
            generateId,
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
                        role: z.string().nullable().optional(),
                    })
                    .optional(),
                authors: z
                    .array(
                        z.object({
                            name: z.string(),
                            image: z.string(),
                            twitter: z.string().optional(),
                            role: z.string().nullable().optional(),
                        }),
                    )
                    .optional(),
                image: image().optional(),
                rightBar: z.boolean().optional(),
                plugins: z.array(z.string()).optional(),
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
            pattern: "./*.md{,x}",
            base: "./src/contents/vs",
            generateId,
        }),
        schema: z.object({
            title: z.string(),
            headerTitle: z.string().optional(),
            description: z.string().optional(),
            competitorName: z.string(),
            logo: z.string(),
        }),
    }),
    vsPages: defineCollection({
        loader: glob({
            pattern: "./*.{yaml,yml}",
            base: "./src/contents/vs-pages",
        }),
        schema: vsPagesSchema,
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
                featuredImage: image(),
                logo: image().optional(),
                logoDark: image().optional(),
                tasks: z.array(z.string()),
                kpi1: z.string(),
                kpi2: z.string(),
                kpi3: z.string(),
                quote: z.string(),
                quotePerson: z.string(),
                quotePersonTitle: z.string(),
                industry: z.string(),
                headquarter: z.string(),
                solution: z.string(),
                companyName: z.string(),
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
}