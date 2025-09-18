// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import vue from '@astrojs/vue';
import remarkDirective from 'remark-directive';
import remarkCustomElements from './utils/remark-custom-elements/index.mjs';

import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    imageService: 'cloudflare'
  }),

  integrations: [vue(), expressiveCode({
    defaultProps: {
        wrap: true,
        overridesByLang: {
            'bash,sh,zsh,shell': {
                frame: 'none',
            }
        }
    }
  })],
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkCustomElements,
    ]
  },
  vite: {
    css: {
        preprocessorOptions: {
            scss: {
                // silence invasive bootstrap warnings
                silenceDeprecations: ["color-functions", "global-builtin", "import"],
            },
        },
    },
  },
});