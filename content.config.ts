import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { CollectionNames } from './content.config.names'

export default defineContentConfig({
  collections: {
    [CollectionNames.docs]: defineCollection({
      type: 'page',
      source: 'docs/**/*.md',
      schema: z.object({
        title: z.string(),
        icon: z.string(),
        release: z.string().optional(),
        version: z.string().optional(),
        editions: z.array(z.enum(["OSS", "EE"])).optional(),
        topics: z.array(z.string()).optional(),
        stage: z.string().optional(),
        hideSubMenus: z.boolean().optional(),
        deprecated: z.object({
            since: z.string(),
            migrationGuide: z.string(),
        }).optional(),
      })
    }),
    [CollectionNames.blogs]: defineCollection({
      type: 'page',
      source: 'blogs/**/*.md',
      schema: z.object({
        date: z.date(),
        category: z.string(),
        author: z.object({
            name: z.string(),
            image: z.string(),
            twitter: z.string(),
        }),
        image: z.string(),
      })
    }),
    [CollectionNames.careers]: defineCollection({
        type: 'page',
        source: 'careers/**/*.md',
        schema: z.object({
            type: z.string(),
        })
    }),
    [CollectionNames.misc]: defineCollection({
        type: 'page',
        source: '*.md',
    }),
  }
})