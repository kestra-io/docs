import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"
import generateId from "~/utils/generateId"

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
}