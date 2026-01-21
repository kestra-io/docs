// @ts-check
import {defineConfig, envField, fontProviders} from "astro/config";

import * as path from "path";
import cloudflare from "@astrojs/cloudflare";
import vue from "@astrojs/vue";
import mdx from "@astrojs/mdx";
import expressiveCode from "astro-expressive-code";

import remarkDirective from "remark-directive";
// @ts-expect-error no types provided by package
import remarkLinkRewrite from "remark-link-rewrite";
import remarkCustomElements from "./src/utils/remark-custom-elements/index.mjs";
import remarkClassname from "./src/utils/remark-classname/index.mjs";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import generateId from "./src/utils/generateId";
import rehypeImgPlugin from "./src/markdown/rehype/img-plugin.ts";
import rehypeExternalLinks from "rehype-external-links";

const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

// https://astro.build/config
export default defineConfig({
    site: "https://kestra.io",
    adapter: cloudflare({
        // only use cloudflare images in production
        imageService: process.env.NO_IMAGE_OPTIM === "true" ? "passthrough" : "cloudflare"
    }),
    trailingSlash: "ignore",
    integrations: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag === "rapi-doc"
                }
            },
            appEntrypoint: "./src/vue-setup.ts",
            devtools: { launchEditor: "idea" }
        }),
        expressiveCode({
            defaultProps: {
                wrap: true,
                overridesByLang: {
                    "bash,sh,zsh,shell": {
                        frame: "none"
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
                    if (url.startsWith(".")) {
                        return generateId({ entry: url });
                    }
                    return url;
                }
            }],
        ],
        rehypePlugins: [
            rehypeHeadingIds,
            rehypeAutolinkHeadings,
            rehypeImgPlugin,
            [rehypeExternalLinks, {
                target: '_blank',
                rel: ['noopener', 'noreferrer']
            }],
        ],
    },
    image: {
        layout: "constrained"
    },
    experimental: {
        fonts: [
            {
                provider: fontProviders.google(),
                name: "Public Sans",
                weights: [100, 400, 600, 700, 800],
                cssVariable: "--font-family-public-sans",

            },
            {
                provider: fontProviders.google(),
                name: "Source Code Pro",
                weights: [400, 700],
                cssVariable: "--font-family-source-code-pro"
            },
            {
                provider: fontProviders.google(),
                name: "Mona Sans",
                weights: [400, 700],
                cssVariable: "--font-family-mona-sans"
            }
        ],
        svgo: true
    },
    env: {
        schema: {
            API_URL: envField.string({ context: "client", access: "public", optional: false, default: "https://api.kestra.io/v1" }),
            GTM_ID: envField.string({ context: "client", access: "public", optional: false, default: "GTM-T4F85WRF" }),
            CLOUDFLARE_TEAM_DOMAIN: envField.string({ context: "server", access: "secret", optional: true }),
            CLOUDFLARE_POLICY_AUD: envField.string({ context: "server", access: "secret", optional: true }),
        }
    },
    vite: {
        resolve: {
            alias: {
                "#mdc-imports": path.resolve(__dirname, "node_modules/@kestra-io/ui-libs/stub-mdc-imports.js"),
                "#mdc-configs": path.resolve(__dirname, "node_modules/@kestra-io/ui-libs/stub-mdc-imports.js"),
                '~': path.resolve('./src')
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    // silence invasive bootstrap warnings
                    silenceDeprecations: ["color-functions", "global-builtin", "import", "if-function"]
                }
            }
        },
        optimizeDeps: {
            include: ["vue3-count-to"]
        },
        ssr: {
            noExternal: [
                "vue3-count-to"
            ],
            external: [
                "node:fs/promises",
                "node:fs",
                "node:url",
                "node:path",
                "node:crypto"
            ]
        }
    }
});