// @ts-check
import { defineConfig } from 'astro/config';

import * as path from 'path';
import cloudflare from '@astrojs/cloudflare';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code';

import remarkDirective from 'remark-directive';
// @ts-expect-error no types provided by package
import remarkLinkRewrite from 'remark-link-rewrite';
import remarkCustomElements from './utils/remark-custom-elements/index.mjs';
import remarkClassname from './utils/remark-classname/index.mjs';
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import generateId from './utils/generateId';

const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    imageService: 'cloudflare'
  }),

  integrations: [
    vue({
        appEntrypoint: './src/_main.ts'
    }),
    expressiveCode({
        defaultProps: {
            wrap: true,
            overridesByLang: {
                'bash,sh,zsh,shell': {
                    frame: 'none',
                }
            }
        }
    }),
    mdx()
  ],
  markdown: {
    remarkPlugins: [
      remarkClassname,
      remarkDirective,
      remarkCustomElements,
      // when internal docs links we point to real files
      // while in the docs generated we want to point to urls with generated ids
      [remarkLinkRewrite, {
        /** @param {string} url */
        replacer(url) {
          if (url.startsWith('.')) {
              return generateId({entry: url})
          }
          return url;
        }
      }]
    ],
    rehypePlugins: [
      rehypeHeadingIds,
    ],
  },
  vite: {
    resolve:{
        alias: {
            "#mdc-imports": path.resolve(__dirname, "node_modules/@kestra-io/ui-libs/stub-mdc-imports.js"),
            "#mdc-configs": path.resolve(__dirname, "node_modules/@kestra-io/ui-libs/stub-mdc-imports.js"),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                // silence invasive bootstrap warnings
                silenceDeprecations: ["color-functions", "global-builtin", "import"],
            },
        },
    },
    ssr: {
      external: [
        'node:fs/promises',
        "node:url",
        "node:path",
        "node:crypto",
      ],
    },
  },
});