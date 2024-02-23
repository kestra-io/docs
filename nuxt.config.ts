const DEFAULT_KESTRA_API_URL = 'https://api.kestra.io/v1';
export default defineNuxtConfig({
    modules: [
        '@nuxt/devtools',
        '@nuxt/content',
        '@nuxt/image',
        '@nuxtjs/sitemap',
        'nuxt-gtag',
        'nuxt-multi-cache',
        'vue3-carousel-nuxt'
    ],
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
            script: [
                {src: 'https://js-eu1.hsforms.net/forms/embed/v2.js'}
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
            // preload: [
            //     'bash',
            //     'yaml',
            //     'sql',
            //     'java',
            //     'dockerfile',
            //     'hcl',
            //     'python',
            //     'twig',
            //     'groovy',
            //     'json5',
            // ],
            theme: 'github-dark'
        },
        markdown: {
            remarkPlugins: {
                'remark-flexible-markers': {
                    markerClassName: 'type-mark',
                },
                'remark-code-import': {
                    rootDir: process.cwd()
                },
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
        initialConsent: false
    },

    runtimeConfig: {
        public: {
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://kestra.io',
            apiUrl: process.env.NUXT_PUBLIC_API_URL || DEFAULT_KESTRA_API_URL,
        }
    },

    // if using nuxt generate
    nitro: {
        prerender: {
            routes: ['/rss.xml'],
        },
    },

    routeRules: {
        '/slack': {redirect: `${DEFAULT_KESTRA_API_URL}/communities/slack/redirect`},
        '/docs/api-guide': {redirect: '/docs/api-reference'},
        '/doc': {redirect: '/docs'},
        '/blog': {redirect: '/blogs'},
        '/docs/plugin-library': {redirect: '/docs/getting-started/plugins'},
        '/docs/troubleshooting': {redirect: '/docs/faq/troubleshooting'},
        '/docs/developer-guide/best-practice': {redirect: '/docs/developer-guide/best-practices'},
        '/api/events/**': {proxy: 'https://eu.posthog.com/**'},
    },

    build: {
        transpile: ['vue3-count-to']
    },

    multiCache: {
        data: {
            enabled: true,
        }
    },

    devtools: {
        timeline: {
            enabled: true
        }
    }
})