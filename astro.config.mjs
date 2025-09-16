// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import vue from '@astrojs/vue';
import remarkDirective from 'remark-directive';
import remarkCustomElements from './utils/remark-custom-elements.mjs';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    imageService: 'cloudflare'
  }),

  integrations: [vue()],
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkCustomElements,
    ]
  }
});