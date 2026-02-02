// @ts-check
import { defineConfig, envField, fontProviders } from "astro/config"

import * as path from "path"
import cloudflare from "@astrojs/cloudflare"
import vue from "@astrojs/vue"
import mdx from "@astrojs/mdx"
import icon from "astro-icon"
import expressiveCode from "astro-expressive-code"

import remarkDirective from "remark-directive"
import customRemarkLinkRewrite from "./src/markdown/remark/link-rewrite.ts"
// @ts-expect-error no types provided by package
import remarkLinkRewrite from "remark-link-rewrite"
import remarkCustomElements from "./src/markdown/remark/remark-custom-elements/index.mjs"
import remarkClassname from "./src/markdown/remark/remark-classname/index.mjs"
import { rehypeHeadingIds } from "@astrojs/markdown-remark"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import generateId from "./src/utils/generateId"
import rehypeImgPlugin from "./src/markdown/rehype/img-plugin.ts"
import rehypeExternalLinks from "rehype-external-links"

const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"))

// https://astro.build/config
export default defineConfig({
    site: "https://kestra.io",
    adapter: cloudflare({
        // only use cloudflare images in production
        imageService:
            process.env.NO_IMAGE_OPTIM === "true"
                ? "passthrough"
                : "cloudflare",
    }),
    trailingSlash: "ignore",
    integrations: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => tag === "rapi-doc",
                },
            },
            appEntrypoint: "./src/vue-setup.ts",
            devtools: { launchEditor: "idea" },
        }),
        expressiveCode({
            defaultProps: {
                wrap: true,
                overridesByLang: {
                    "bash,sh,zsh,shell,twig,powershell": {
                        frame: "none",
                    },
                },
            },
            useDarkModeMediaQuery: false,
        }),
        mdx(),
        icon(),
    ],
    markdown: {
        remarkPlugins: [
            remarkClassname,
            remarkDirective,
            remarkCustomElements,
            // when internal docs links we point to real files
            // while in the docs generated we want to point to urls with generated ids
            // @ts-expect-error bad types in astro
            [
                customRemarkLinkRewrite,
                {
                    /**
                     *
                     * @param {string} url
                     * @param {{basename?: string, dirname?: string}} file
                     * @returns
                     */
                    replacer(url, file) {
                        if (url.startsWith(".")) {
                            // Extract hash fragment before processing relative URLs
                            let hash = ""
                            if (url.includes("#")) {
                                const hashIndex = url.indexOf("#")
                                hash = url.slice(hashIndex)
                                url = url.slice(0, hashIndex)
                            }

                            // if the file basename starts with index.
                            if(file.basename && file.basename.startsWith("index.")) {
                                // if the url start with ./
                                if(url.startsWith("./") && file.dirname) {
                                    // we preprend to the path the last part of the dirname
                                    url = path.join(path.basename(file.dirname), url.slice(2))
                                }

                                // if the url starts with ../
                                if(url.startsWith("../")) {
                                    // we replace ../ by ./
                                    url = "./" + url.slice(3)
                                }
                            }

                            return generateId({entry: url}) + hash
                        }
                        return url
                    }
                },
            ],
        ],
        rehypePlugins: [
            rehypeHeadingIds,
            rehypeAutolinkHeadings,
            rehypeImgPlugin,
            [
                rehypeExternalLinks,
                {
                    target: "_blank",
                    rel: ["noopener", "noreferrer"],
                },
            ],
        ],
    },
    image: {
        layout: "constrained",
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
                cssVariable: "--font-family-source-code-pro",
            },
            {
                provider: fontProviders.google(),
                name: "Mona Sans",
                weights: [400, 700],
                cssVariable: "--font-family-mona-sans",
            },
        ],
        svgo: true,
    },
    env: {
        schema: {
            PREVIEW: envField.boolean({
                context: "server",
                access: "secret",
                optional: true,
                default: false,
            }),
            API_URL: envField.string({
                context: "client",
                access: "public",
                optional: false,
                default: "https://api.kestra.io/v1",
            }),
            GTM_ID: envField.string({
                context: "client",
                access: "public",
                optional: false,
                default: "GTM-T4F85WRF",
            }),
            CLOUDFLARE_TEAM_DOMAIN: envField.string({
                context: "server",
                access: "secret",
                optional: true,
            }),
            CLOUDFLARE_POLICY_AUD: envField.string({
                context: "server",
                access: "secret",
                optional: true,
            }),
        },
    },
    // require for "/t" url
    security: {
        checkOrigin: false,
    },
    redirects: {
        "/slack": "https://api.kestra.io/v1/communities/slack/redirect",
        "/trust": "https://app.drata.com/trust/0a8e867d-7c4c-4fc5-bdc7-217f9c839604",
    },
    vite: {
        resolve: {
            alias: {
                "#mdc-imports": path.resolve(
                    __dirname,
                    "node_modules/@kestra-io/ui-libs/stub-mdc-imports.js",
                ),
                "#mdc-configs": path.resolve(
                    __dirname,
                    "node_modules/@kestra-io/ui-libs/stub-mdc-imports.js",
                ),
                "~": path.resolve("./src"),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    // silence invasive bootstrap warnings
                    silenceDeprecations: [
                        "color-functions",
                        "global-builtin",
                        "import",
                        "if-function",
                    ],
                },
            },
        },
        ssr: {
            external: [
                "node:fs/promises",
                "node:fs",
                "node:url",
                "node:path",
                "node:crypto",
            ],
        },
    },
})