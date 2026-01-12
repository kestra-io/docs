// @ts-check
import { defineConfig, envField } from "astro/config";

import * as path from "path";
import cloudflare from "@astrojs/cloudflare";
import vue from "@astrojs/vue";
import mdx from "@astrojs/mdx";
import expressiveCode from "astro-expressive-code";

import remarkDirective from "remark-directive";
// @ts-expect-error no types provided by package
import remarkLinkRewrite from "remark-link-rewrite";
import remarkCustomElements from "./utils/remark-custom-elements/index.mjs";
import remarkClassname from "./utils/remark-classname/index.mjs";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import generateId from "./utils/generateId";
import rehypeImgPlugin from "./src/markdown/rehype/img-plugin.ts";

const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

// https://astro.build/config
export default defineConfig({
    site: "https://kestra.io",
    adapter: cloudflare({
        imageService: "cloudflare"
    }),
    trailingSlash: "never",
    integrations: [
        vue({
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
            }]
        ],
        rehypePlugins: [
            rehypeHeadingIds,
            rehypeImgPlugin
        ]
    },
    env: {
        schema: {
            API_URL: envField.string({ context: "client", access: "public", optional: false, default: "https://api.kestra.io/v1" }),
            GTM_ID: envField.string({ context: "client", access: "public", optional: false, default: "GTM-T4F85WRF" }),
        }
    },
    vite: {
        resolve: {
            alias: {
                "#mdc-imports": path.resolve(__dirname, "node_modules/@kestra-io/ui-libs/stub-mdc-imports.js"),
                "#mdc-configs": path.resolve(__dirname, "node_modules/@kestra-io/ui-libs/stub-mdc-imports.js")
                // FIXME: required for vue js but conflict with astro imports, need to move all to src
                // '~': path.resolve('./src')
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    // silence invasive bootstrap warnings
                    silenceDeprecations: ["color-functions", "global-builtin", "import"]
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