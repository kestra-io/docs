import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import generateId from '../utils/generateId';

export const collections = {
  docs: defineCollection({
    loader: glob({
        pattern: "./**/*.md",
        base: "./content/docs",
        generateId,
    }),
    schema: z.object({
        title: z.string(),
        icon: z.string().optional(),
        release: z.string().optional(),
        version: z.string().optional(),
        editions: z.array(z.enum(["OSS", "EE", "Cloud"])).optional(),
        topics: z.array(z.string()).optional(),
        stage: z.string().optional(),
        hideSubMenus: z.boolean().optional(),
        deprecated: z.object({
            since: z.string(),
            migrationGuide: z.string(),
        }).optional(),
      })
  }),
};