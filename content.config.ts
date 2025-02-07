import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: 'docs/**/*.md',
      schema: z.object({
        title: z.string(),
        icon: z.string(),
        release: z.string().optional(),
        version: z.string().optional(),
        editions: z.array(z.enum(["OSS", "EE"])).optional(),
      })
    }),
    blogs: defineCollection({
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
    careers: defineCollection({
        type: 'page',
        source: 'careers/**/*.md',
        schema: z.object({
            type: z.string(),
        })
    })
  }
})