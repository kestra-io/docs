const DEFAULT_KESTRA_API_URL = 'https://api.kestra.io/v1';
export default defineNuxtConfig({
    modules: [
        '@nuxt/devtools',
        '@nuxt/content',
        '@nuxt/image',
        '@nuxtjs/sitemap',
        'nuxt-gtag',
        'nuxt-multi-cache',
        'vue3-carousel-nuxt',
        'nuxt-lazy-hydrate',
        '@nuxtjs/mdc'
    ],
    mdc: {
        components: {
            prose: false, // Disable predefined prose components
        },
    },
    sitemap: {
        sitemaps: {
            default: {
                includeAppSources: true,
                sources: ['/api/sitemap']
            },
            plugins: {
                sources: ['/api/sitemap']
            }
        },
    },
    app: {
        baseURL: "/",
        // pageTransition: {name: 'page', mode: 'out-in'}
        head: {
            link: [
                {rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png'},
                {rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png'},
                {rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png'},
                {rel: 'manifest', href: '/site.webmanifest'},
                {rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#2c0059'},
                {name: 'msapplication-TileColor', content: '#2c0059'},
                {rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml', title: 'Sitemap'},
                {rel: 'alternate', type: 'application/rss+xml', href: '/rss.xml', title: 'Blog Articles RSS'}
            ],
            meta: [
                {name: 'msapplication-TileColor', content: '#2c0059'},
                {name: 'theme-color', content: '#2c0059'},
                {property: 'og:image', content: '/og-image.png'}
            ],
        }
    },

    css: [
        '@/assets/styles/vendor.scss',
        '@/assets/styles/app.scss'
    ],

    content: {
        documentDriven: false,
        highlight: {
            preload: [
                'bash',
                'yaml',
                'sql',
                'java',
                'dockerfile',
                'hcl',
                'python',
                'twig',
                'groovy',
                'json5',
            ],
            theme: 'github-dark'
        },
        markdown: {
            remarkPlugins: {
                'remark-flexible-markers': {
                    markerClassName: 'type-mark',
                },
                // 'remark-code-import': {
                //     rootDir: process.cwd()
                // },
            }
        },
    },

    router: {
        trailingSlash: false,
        options: {
            strict: true
        }
    },

    devServer: {
        port: 3001
    },

    vue: {
        compilerOptions: {
            isCustomElement: (tag) => {
                return tag === "rapi-doc";
            }
        }
    },

    vite: {
        build: {
            rollupOptions: {
                external: ['shiki/onig.wasm'],
            }
        },
        optimizeDeps: {
            include: [
                "humanize-duration",
                "lodash",
                "dagre"
            ],
            exclude: [
                '* > @kestra-io/ui-libs'
            ]
        },
        resolve: {
            alias: {
                'node:path': 'path-browserify'
            }
        }
    },

    gtag: {
        id: 'G-EYVNS03HHR',
        enabled: false
    },

    runtimeConfig: {
        public: {
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://kestra.io',
            apiUrl: process.env.NUXT_PUBLIC_API_URL || DEFAULT_KESTRA_API_URL,
        }
    },

    nitro: {
        prerender: {
            routes: ['/rss.xml'],
        },
    },

    routeRules: {
        '/slack': {redirect: `${DEFAULT_KESTRA_API_URL}/communities/slack/redirect`},
        '/docs/api-guide': {redirect: '/docs/api-reference'},
        '/docs/administrator-guide/configuration': {redirect: '/docs/configuration-guide'},
        '/doc': {redirect: '/docs'},
        '/blog': {redirect: '/blogs'},
        '/docs/plugin-developer-guide': {redirect: '/docs/developer-guide/plugins'},
        '/docs/plugin-library': {redirect: '/docs/getting-started/plugins'},
        '/docs/enterprise/setup-page': {redirect: '/docs/enterprise/setup'},
        '/docs/troubleshooting': {redirect: '/docs/faq/troubleshooting'},
        '/docs/developer-guide/best-practice': {redirect: '/docs/best-practices'},
        '/docs/developer-guide/best-practices': {redirect: '/docs/best-practices'},
        '/docs/best-practice': {redirect: '/docs/best-practices'},
        '/docs/workflow-components/flow-trigger': {redirect: '/docs/workflow-components/triggers#flow-trigger'},
        '/docs/workflow-components/schedule-trigger': {redirect: '/docs/workflow-components/triggers#schedule-trigger'},
        '/docs/workflow-components/webhook-trigger': {redirect: '/docs/workflow-components/triggers#webhook-trigger'},
        '/docs/workflow-components/triggers/flow-trigger': {redirect: '/docs/workflow-components/triggers#flow-trigger'},
        '/docs/workflow-components/triggers/schedule-trigger': {redirect: '/docs/workflow-components/triggers#schedule-trigger'},
        '/docs/workflow-components/triggers/webhook-trigger': {redirect: '/docs/workflow-components/triggers#webhook-trigger'},
        '/docs/workflow-components/triggers/conditions': {redirect: '/docs/workflow-components/triggers#conditions'},
        '/docs/workflow-components/flow-properties': {redirect: '/docs/workflow-components/flow'},
        '/docs/concepts/expression/02a.expression-types': {redirect: '/docs/concepts/expression/expression-types'},
        '/docs/concepts/expression/02b.expression-usage': {redirect: '/docs/concepts/expression/expression-usage'},
        '/docs/how-to-guides/errors': {redirect: '/docs/workflow-components/errors'},
        '/docs/how-to-guides/python-pip': {redirect: '/docs/how-to-guides/python'},
        '/docs/flow-examples/**': {redirect: '/docs/how-to-guides'},
        '/docs/faq/troubleshooting': {redirect: '/docs/installation/troubleshooting'},
        '/docs/faq/flows': {redirect: '/docs/workflow-components/flows#faq'},
        '/docs/faq/variables': {redirect: '/docs/workflow-components/variables#faq'},
        '/docs/faq/enterprise': {redirect: '/docs/enterprise/faq'},
        '/docs/faq/internal-storage': {redirect: '/docs/developer-guide/storage#internal-storage-faq'},
        '/docs/faq': {redirect: '/docs/installation/troubleshooting'},
        '/api/events/**': {proxy: 'https://eu.posthog.com/**'},
    },

    build: {
        transpile: ['vue3-count-to'],
        extractCSS: true
    },

    optimization: {
        minimize: true,
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '.',
            name: true,
            maxSize: 144000,
            cacheGroups: {
                vendor: {
                    name: 'node_vendors',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    maxSize: 144000
                }
            }
        }
    },

    multiCache: {
        data: {
            enabled: true,
        }
    },

    devtools: {
        enabled: true,
        timeline: {
            enabled: true
        }
    }
})