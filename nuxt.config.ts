import * as sass from "sass";
import { CollectionNames } from "./content.config.names";

const DEFAULT_KESTRA_API_URL = 'https://api.kestra.io/v1';

export default defineNuxtConfig({
    modules: [
        '@nuxt/devtools',
        '@nuxt/image',
        'nuxt-multi-cache',
        'vue3-carousel-nuxt',
        'nuxt-lazy-hydrate',
        'nuxt-aos',
        '@zadigetvoltaire/nuxt-gtm',
        '@nuxtjs/sitemap',
        '@nuxtjs/robots',
        '@nuxt/content',
    ],
    target: 'static',
    image: {
        formats: {
            webp: {
                quality: 80
            }
        },
        densities: [1, 2],
        domains: ['kestra.io']
    },
    sitemap: {
        sitemaps: {
            default: {
                includeAppSources: true,
                sources: ['/api/sitemap']
            },
            plugins: {
                sources: ['/api/sitemap']
            },
            blueprints: {
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
                {rel: 'alternate', type: 'application/rss+xml', href: '/rss.xml', title: 'Blog Articles RSS'},
                {rel: 'preconnect', href: 'https://fonts.gstatic.com'},
                {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
                {rel: 'dns-prefetch', href: 'https://eu.i.posthog.com'},
                {rel: 'dns-prefetch', href: 'https://js-eu1.hs-scripts.com'},
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
        '@/assets/styles/app.scss',
        '@/assets/styles/theme.scss'
    ],

    content: {
        build: {
            markdown: {
                remarkPlugins: {
                    'remark-flexible-markers': {
                        markerClassName: 'type-mark',
                    },
                    'remark-code-import': {
                        rootDir: process.cwd()
                    },
                },
                highlight: false,
            },
        }
    },

    devServer: {
        port: 3001
    },

    features: {
        inlineStyles: false
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
                external: [
                    'shiki/onig.wasm',
                ]
            }
        },
        optimizeDeps: {
            include: [
                "lodash",
                "debug",
            ],
            exclude: [
                '* > @kestra-io/ui-libs'
            ]
        },
        resolve: {
            alias: {
                'node:path': 'path-browserify'
            }
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern',
                    logger: sass.Logger.silent
                },
            },
        },
    },

    gtm: {
        id: 'GTM-T4F85WRF',
        enabled: false,
        debug: false,
        enableRouterSync: true,
        devtools: true,
    },

    runtimeConfig: {
        public: {
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://kestra.io',
            apiUrl: process.env.NUXT_PUBLIC_API_URL || DEFAULT_KESTRA_API_URL,
            docs: {
                sections: {
                    "Get Started with Kestra": [
                        "Getting Started",
                        "Tutorial",
                        "Architecture",
                        "Installation Guide",
                        "User Interface"
                        // "Video Tutorials"
                    ],
                    "Build with Kestra": [
                        "Concepts",
                        "Workflow Components",
                        "Multi-Language Script Tasks",
                        "Version Control & CI/CD",
                        "Plugin Developer Guide",
                        "How-to Guides"
                    ],
                    "Scale with Kestra": [
                        "Cloud & Enterprise Edition",
                        "Task Runners",
                        // "Worker Groups",
                        "Best Practices"
                    ],
                    "Manage Kestra": [
                        "Administrator Guide",
                        "Migration Guide"
                    ],
                    "Reference Docs": [
                        "Configuration",
                        "Expressions",
                        "API Reference",
                        "Terraform Provider",
                        "Server CLI",
                        "Kestra EE CLI"
                    ]
                }
            },
            CollectionNames,
            posthog: {
                enabled: process.env.POSTHOG_ENABLED !== "false"
            },
        },
    },

    nitro: {
        prerender: {
            routes: [
                '/rss.xml',
            ],
            autoSubfolderIndex: false,
        },
    },

    routeRules: {
        '/slack': {redirect: `${DEFAULT_KESTRA_API_URL}/communities/slack/redirect`},
        '/docs/api-guide': {redirect: '/docs/api-reference'},
        '/docs/administrator-guide/configuration': {redirect: '/docs/configuration-guide'},
        '/doc': {redirect: '/docs'},
        '/blog': {redirect: '/blogs'},
        '/docs/plugin-library': {redirect: '/docs/getting-started/plugins'},
        '/docs/enterprise/setup-page': {redirect: '/docs/enterprise/setup'},
        '/docs/developer-guide/plugins': {redirect: '/docs/plugin-developer-guide'},
        '/docs/troubleshooting': {redirect: '/docs/administrator-guide/troubleshooting'},
        '/docs/developer-guide/scripts/rust': {redirect: '/docs/developer-guide/scripts/additional-languages'},
        '/docs/developer-guide/scripts/additional-languages': {redirect: '/docs/developer-guide/scripts/languages'},
        '/docs/developer-guide/best-practice': {redirect: '/docs/best-practices'},
        '/docs/developer-guide/best-practices': {redirect: '/docs/best-practices'},
        '/docs/developer-guide/error-handling': {redirect: '/docs/workflow-components/errors'},
        '/docs/developer-guide/scripts/output-directory': {redirect: '/docs/developer-guide/scripts/input-output-files'},
        '/docs/best-practice': {redirect: '/docs/best-practices'},
        '/docs/best-practices/pebble-templating-with-namespace-files': {redirect: '/docs/best-practices/expressions-with-namespace-files'},
        '/docs/workflow-components/trigger': {redirect: '/docs/workflow-components/triggers'},
        '/docs/workflow-components/realtime-triggers': {redirect: '/docs/workflow-components/realtime-trigger'},
        '/docs/workflow-components/triggers/conditions': {redirect: '/docs/workflow-components/triggers#conditions'},
        '/docs/workflow-components/flow-properties': {redirect: '/docs/workflow-components/flow'},
        '/docs/workflow-components/task-defaults': {redirect: '/docs/workflow-components/plugin-defaults'},
        '/docs/concepts/expression/expression-types': {redirect: '/docs/expressions'},
        '/docs/concepts/expression/expression-usage': {redirect: '/docs/expressions'},
        '/docs/concepts/expression/filter': {redirect: '/docs/expressions'},
        '/docs/concepts/expression/function': {redirect: '/docs/expressions'},
        '/docs/concepts/expression/operator': {redirect: '/docs/expressions'},
        '/docs/concepts/expression/tag': {redirect: '/docs/expressions'},
        '/docs/concepts/expression/test': {redirect: '/docs/expressions'},
        '/docs/concepts/expression/deprecated-handlebars': {redirect: '/docs/expressions'},
        '/docs/concepts/expression': {redirect: '/docs/expressions'},
        '/docs/expression': {redirect: '/docs/expressions'},
        '/docs/migration-guide/core-script-tasks': {redirect: '/docs/migration-guide/0.11.0/core-script-tasks'},
        '/docs/migration-guide/templates': {redirect: '/docs/migration-guide/0.11.0/templates'},
        '/docs/migration-guide/listeners': {redirect: '/docs/migration-guide/0.12.0/listeners'},
        '/docs/migration-guide/recursive-rendering': {redirect: '/docs/migration-guide/0.14.0/recursive-rendering'},
        '/docs/migration-guide/inputs-name': {redirect: '/docs/migration-guide/0.15.0/inputs-name'},
        '/docs/migration-guide/micronaut4': {redirect: '/docs/migration-guide/0.15.0/micronaut4'},
        '/docs/migration-guide/schedule-conditions': {redirect: '/docs/migration-guide/0.15.0/schedule-conditions'},
        '/docs/migration-guide/subflow-outputs': {redirect: '/docs/migration-guide/0.15.0/subflow-outputs'},
        '/docs/migration-guide/local-files': {redirect: '/docs/migration-guide/0.17.0/local-files'},
        '/docs/migration-guide/plugin-discovery-mechanism': {redirect: '/docs/migration-guide/0.17.0/plugin-discovery-mechanism'},
        '/docs/migration-guide/renamed-plugins': {redirect: '/docs/migration-guide/0.17.0/renamed-plugins'},
        '/docs/migration-guide/volume-mount': {redirect: '/docs/migration-guide/0.17.0/volume-mount'},
        '/docs/how-to-guides/errors': {redirect: '/docs/workflow-components/errors'},
        '/docs/how-to-guides/python-pip': {redirect: '/docs/how-to-guides/python'},
        '/docs/how-to-guides/local-file-sync': {redirect: '/docs/how-to-guides/local-flow-sync'},
        '/docs/how-to-guides/google-spreadsheets': {redirect: '/docs/how-to-guides/google-sheets'},
        '/docs/how-to-guides/ssl-configuration': {redirect: '/docs/administrator-guide/ssl-configuration'},
        '/docs/how-to-guide': {redirect: '/docs/how-to-guides'},
        '/docs/developer-guide/': {redirect: '/docs'},
        '/docs/developer-guide/storage': {redirect: '/docs/concepts/storage'},
        '/docs/developer-guide/caching': {redirect: '/docs/concepts/caching'},
        '/docs/developer-guide/namespace-files': {redirect: '/docs/concepts/namespace-files'},
        '/docs/developer-guide/scripts': {redirect: '/docs/workflow-components/tasks/scripts'},
        '/docs/developer-guide/git': {redirect: '/docs/version-control-cicd/git'},
        '/docs/concepts/flowable-tasks': {redirect: '/docs/workflow-components/tasks/flowable-tasks'},
        '/docs/concepts/runnable-tasks': {redirect: '/docs/workflow-components/tasks/runnable-tasks'},
        '/docs/concepts/task-runners': {redirect: '/docs/task-runners'},
        '/docs/enterprise/enterprise-edition': {redirect: '/docs/enterprise/overview/enterprise-edition'},
        '/docs/enterprise/setup': {redirect: '/docs/enterprise/overview/setup'},
        '/docs/enterprise/releases': {redirect: '/docs/enterprise/overview/releases'},
        '/docs/enterprise/audit-logs': {redirect: '/docs/enterprise/governance/audit-logs'},
        '/docs/enterprise/namespace-management': {redirect: '/docs/enterprise/governance/namespace-management'},
        '/docs/enterprise/centralized-task-configuration': {redirect: '/docs/enterprise/governance/namespace-management'},
        '/docs/enterprise/custom-blueprints': {redirect: '/docs/enterprise/governance/custom-blueprints'},
        '/docs/enterprise/logshipper': {redirect: '/docs/enterprise/governance/logshipper'},
        '/docs/enterprise/secrets': {redirect: '/docs/enterprise/governance/secrets'},
        '/docs/enterprise/secrets-manager': {redirect: '/docs/enterprise/governance/secrets-manager'},
        '/docs/enterprise/tenants': {redirect: '/docs/enterprise/governance/tenants'},
        '/docs/enterprise/authentication': {redirect: '/docs/enterprise/auth/authentication'},
        '/enterprise/auth/sso': {redirect: '/enterprise/auth/sso'},
        '/docs/enterprise/api': {redirect: '/docs/enterprise/auth/api'},
        '/docs/enterprise/api-tokens': {redirect: '/docs/enterprise/auth/api-tokens'},
        '/docs/enterprise/invitations': {redirect: '/docs/enterprise/auth/invitations'},
        '/docs/enterprise/rbac': {redirect: '/docs/enterprise/auth/rbac'},
        '/docs/enterprise/scim': {redirect: '/docs/enterprise/auth/scim'},
        '/docs/enterprise/service-accounts': {redirect: '/docs/enterprise/auth/service-accounts'},
        '/docs/enterprise/apps': {redirect: '/docs/enterprise/scalability/apps'},
        '/docs/enterprise/task-runners': {redirect: '/docs/enterprise/scalability/task-runners'},
        '/docs/enterprise/worker-group': {redirect: '/docs/enterprise/scalability/worker-group'},
        '/docs/enterprise/worker-isolation': {redirect: '/docs/enterprise/governance/worker-isolation'},
        '/docs/enterprise/scalability/worker-isolation': {redirect: '/docs/enterprise/governance/worker-isolation'},
        '/docs/enterprise/announcements': {redirect: '/docs/enterprise/instance/announcements'},
        '/docs/enterprise/dashboard': {redirect: '/docs/enterprise/instance/dashboard'},
        '/docs/enterprise/maintenance-mode': {redirect: '/docs/enterprise/instance/maintenance-mode'},
        '/docs/enterprise/governance/centralized-task-configuration': {redirect: '/docs/enterprise/governance/namespace-management'},
        '/docs/faq/enterprise': {redirect: '/docs/enterprise/ee-faq'},
        '/docs/user-interface-guide/blueprints': {redirect: '/docs/ui/blueprints'},
        '/docs/administrator-guide/server-cli': {redirect: '/docs/server-cli'},
        '/docs/configuration-guide': {redirect: '/docs/configuration'},
        '/docs/configuration-guide/**': {redirect: '/docs/configuration'},
        '/docs/ui/dashboards': {redirect: '/docs/ui/dashboard'},
        '/docs/flow-examples/**': {redirect: '/docs/how-to-guides'},
        '/docs/installation/troubleshooting': {redirect: '/docs/administrator-guide/troubleshooting'},
        '/docs/faq/troubleshooting': {redirect: '/docs/administrator-guide/troubleshooting'},
        '/docs/faq/flows': {redirect: '/docs/workflow-components/flows#faq'},
        '/docs/faq/variables': {redirect: '/docs/workflow-components/variables#faq'},
        '/docs/faq/internal-storage': {redirect: '/docs/developer-guide/storage#internal-storage-faq'},
        '/docs/faq': {redirect: '/docs/installation/troubleshooting'},
        '/docs/enterprise/kestra-identity': {redirect: '/docs/brand-assets'},
        '/plugin': {redirect: '/plugins'},
        '/videos': {redirect: '/tutorial-videos/all'},
        '/tutorial-videos': {redirect: '/tutorial-videos/all'},
        '/community-guidelines': {redirect: '/docs/getting-started/community-guidelines'},
        '/docs/tutorial/docker': {redirect: '/docs/tutorial/scripts'},
        '/docs/workflow-components/tasks/scripts': {redirect: '/docs/scripts'},
        '/t/**': {proxy: 'https://eu.posthog.com/**'},
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
            enabled: process.env.NUXT_CACHE_ENABLED !== 'false',
        },
    },

    aos: {
        offset: 0, // offset (in px) from the original trigger point
        once: false, // whether animation should happen only once - while scrolling down
    },

    devtools: {
        timeline: {
            enabled: true
        }
    },

    compatibilityDate: '2024-07-16'
})
