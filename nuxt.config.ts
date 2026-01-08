import * as sass from "sass";
import { CollectionNames } from "./content.config.names";
import contentSecurityPolicy from "./content-security-policy.config";

const DEFAULT_KESTRA_API_URL = 'https://api.kestra.io/v1';

export default defineNuxtConfig({
    modules: [
        '@nuxt/devtools',
        '@nuxt/image',
        'nuxt-multi-cache',
        'vue3-carousel-nuxt',
        'nuxt-lazy-hydrate',
        'nuxt-aos',
        '@saslavik/nuxt-gtm',
        '@nuxtjs/sitemap',
        '@nuxtjs/robots',
        '@nuxt/content',
        "nitro-cloudflare-dev",
        "nuxt-security"
    ],
    security: {
        enabled: true,
        strict: false,
        hidePoweredBy: true,
        sri: false,
        rateLimiter: false,
        headers: {
            referrerPolicy: 'strict-origin-when-cross-origin',
            crossOriginEmbedderPolicy: false,
            permissionsPolicy: {
                // ✅ allow fullscreen on your own pages and for YouTube iframes
                fullscreen: ['*'],
            },
            // ✅ CSP directives
            contentSecurityPolicy
        },
    },
    image: {
        dir: 'public',
        provider: process.env.CF_PAGES_BRANCH === 'main' ? 'cloudflare' : 'ipx',
        format: ['webp', 'avif', 'png'],
        cloudflare: {
            modifiers: {
                format: 'webp'
            },
        },
        ipx: {
            modifiers: {
                format: 'webp'
            },
        },
        quality: 80,
        densities: [1, 2],
        domains: ['kestra.io', '*.kestra-io.pages.dev'],
    },
    sitemap: {
        autoLastmod: true,
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
    robots: {
        disallow: ['/slack'],
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
        server: {
            fs: {
                allow: [
                    "../ui-libs"
                ]
            }
        },
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
            currentSHA: (process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_COMMIT_SHA && process.env.CF_PAGES_BRANCH === 'main')
                ? process.env.CF_PAGES_COMMIT_SHA
                : 'dev',
            docs: {
                sections: {
                    "Get Started with Kestra": [
                        "Quickstart",
                        "Tutorial",
                        "Architecture",
                        "Installation Guide",
                        "Contribute to Kestra",
                        "User Interface"
                        // "Video Tutorials"
                    ],
                    "Build with Kestra": [
                        "Concepts",
                        "Workflow Components",
                        "Multi-Language Script Tasks",
                        "AI Tools",
                        "No-Code",
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
                        "Migration Guide",
                        "Performance"
                    ],
                    "Reference Docs": [
                        "Configuration",
                        "Releases & LTS Policy",
                        "Expressions",
                        "API Reference",
                        "Terraform Provider",
                        "Kestra CLI",
                        "Glossary"
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
        storage: {
            kv: {
                driver: "cloudflare-kv-binding",
                binding: "CLOUDFLARE_KVSTORAGE"
            }
        },
        devStorage: {
            kv: {
                driver: "fs",
                base: './.data/db'
            }
        },
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
        '/docs/developer-guide/concurrency': {redirect: '/docs/workflow-components/concurrency'},
        //typo "errors"
        '/docs/developer-guide/errors-handling': {redirect: '/docs/workflow-components/errors'},
        '/docs/developer-guide/ci-cd': {redirect: '/docs/version-control-cicd'},
        '/docs/developer-guide/cicd/terraform': {redirect: '/docs/version-control-cicd/cicd/terraform'},
        '/docs/developer-guide/cicd/gitlab': {redirect: '/docs/version-control-cicd/cicd/gitlab'},
        '/docs/developer-guide/triggers': {redirect: '/docs/workflow-components/triggers'},
        '/docs/developer-guide/triggers/flow': {redirect: '/docs/workflow-components/triggers/flow-trigger'},
        '/docs/developer-guide/inputs': {redirect: '/docs/workflow-components/inputs'},
        '/docs/developer-guide/tasks': {redirect: '/docs/workflow-components/tasks'},
        '/docs/developer-guide/flow': {redirect: '/docs/workflow-components/flow'},
        //'/docs/developer-guide/conditions': {redirect: '/docs/???'},
        '/docs/version-control-cicd/developer-guide/ci-cd': {redirect: '/docs/version-control-cicd'},
        '/docs/concepts/flowable-tasks': {redirect: '/docs/workflow-components/tasks/flowable-tasks'},
        '/docs/concepts/runnable-tasks': {redirect: '/docs/workflow-components/tasks/runnable-tasks'},
        '/docs/concepts/task-runners': {redirect: '/docs/task-runners'},
        '/docs/enterprise/enterprise-edition': {redirect: '/docs/enterprise/overview/enterprise-edition'},
        '/docs/enterprise/setup': {redirect: '/docs/enterprise/overview/setup'},
        '/docs/enterprise/releases': {redirect: '/docs/releases'},
        '/docs/enterprise/audit-logs': {redirect: '/docs/enterprise/governance/audit-logs'},
        '/enterprise/governance/audit-logs': {redirect: '/docs/enterprise/governance/audit-logs'},
        '/docs/enterprise/namespace-management': {redirect: '/docs/enterprise/governance/namespace-management'},
        '/docs/enterprise/centralized-task-configuration': {redirect: '/docs/enterprise/governance/namespace-management'},
        '/docs/enterprise/custom-blueprints': {redirect: '/docs/enterprise/governance/custom-blueprints'},
        '/docs/enterprise/logshipper': {redirect: '/docs/enterprise/governance/logshipper'},
        '/docs/enterprise/secrets': {redirect: '/docs/enterprise/governance/secrets'},
        '/enterprise/governance/secrets': {redirect: '/docs/enterprise/governance/secrets'},
        '/docs/enterprise/secrets-manager': {redirect: '/docs/enterprise/governance/secrets-manager'},
        '/enterprise/secrets-manager': {redirect: '/docs/enterprise/governance/secrets-manager'},
        '/docs/enterprise/tenants': {redirect: '/docs/enterprise/governance/tenants'},
        '/docs/enterprise/authentication': {redirect: '/docs/enterprise/auth/authentication'},
        '/enterprise/auth/authentication': {redirect: '/docs/enterprise/auth/authentication'},
        '/enterprise/auth/sso': {redirect: '/enterprise/auth/sso'},
        '/docs/enterprise/sso': {redirect: '/docs/enterprise/auth/sso'},
        '/docs/enterprise/api': {redirect: '/docs/enterprise/auth/api'},
        '/docs/enterprise/api-tokens': {redirect: '/docs/enterprise/auth/api-tokens'},
        '/docs/enterprise/invitations': {redirect: '/docs/enterprise/auth/invitations'},
        '/docs/enterprise/rbac': {redirect: '/docs/enterprise/auth/rbac'},
        '/docs/enterprise/scim': {redirect: '/docs/enterprise/auth/scim'},
        '/docs/enterprise/scim/keycloak': {redirect: '/docs/enterprise/auth/scim/keycloak'},
        '/docs/enterprise/service-accounts': {redirect: '/docs/enterprise/auth/service-accounts'},
        '/docs/enterprise/apps': {redirect: '/docs/enterprise/scalability/apps'},
        '/docs/enterprise/task-runners': {redirect: '/docs/enterprise/scalability/task-runners'},
        '/docs/enterprise/worker-group': {redirect: '/docs/enterprise/scalability/worker-group'},
        '/docs/enterprise/worker-isolation': {redirect: '/docs/enterprise/governance/worker-isolation'},
        '/docs/enterprise/scalability/worker-isolation': {redirect: '/docs/enterprise/governance/worker-isolation'},
        '/docs/enterprise/announcements': {redirect: '/docs/enterprise/instance/announcements'},
        '/docs/enterprise/dashboard': {redirect: '/docs/enterprise/instance/dashboard'},
        '/enterprise/instance/dashboard': {redirect: '/docs/enterprise/instance/dashboard'},
        '/enterprise/instance': {redirect: '/docs/enterprise/instance'},
        '/docs/enterprise/maintenance-mode': {redirect: '/docs/enterprise/instance/maintenance-mode'},
        '/docs/enterprise/governance/centralized-task-configuration': {redirect: '/docs/enterprise/governance/namespace-management'},
        '/enterprise/auth-rbac-user-management/api-tokens': {redirect: '/docs/enterprise/auth/api-tokens'},
        '/docs/enterprise/auth-rbac-user-management/api-tokens': {redirect: '/docs/enterprise/auth/api-tokens'},
        '/docs/enterprise/auth-rbac-user-management/service-accounts': {redirect: '/docs/enterprise/auth/service-accounts'},
        '/docs/enterprise/enterprise/service-accounts': {redirect: '/docs/enterprise/auth/service-accounts'},
        '/docs/enterprise/concepts/system-flows': {redirect: '/docs/concepts/system-flows'},
        '/docs/enterprise/administrator-guide/purge': {redirect: '/docs/administrator-guide/purge'},
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
        '/docs/scripts/runners': {redirect: '/docs/scripts/task-runners'},
        '/plugin': {redirect: '/plugins'},
        '/videos': {redirect: '/tutorial-videos/all'},
        '/tutorial-videos': {redirect: '/tutorial-videos/all'},
        '/community-guidelines': {redirect: '/docs/contribute-to-kestra/community-guidelines'},
        '/docs/tutorial/docker': {redirect: '/docs/tutorial/scripts'},
        '/docs/workflow-components/tasks/scripts': {redirect: '/docs/scripts'},
        '/t/**': {proxy: 'https://eu.posthog.com/**'},
        '/trust': {redirect: 'https://app.drata.com/trust/0a8e867d-7c4c-4fc5-bdc7-217f9c839604'},
        '/docs/ui/administration/stats': {redirect: '/docs/ui/administration/system-overview'},
        '/docs/architecture/executor': {redirect: '/docs/architecture/server-components#executor'},
        '/docs/architecture/worker': {redirect: '/docs/architecture/server-components#worker'},
        '/docs/architecture/scheduler': {redirect: '/docs/architecture/server-components#scheduler'},
        '/docs/architecture/indexer': {redirect: '/docs/architecture/server-components#indexer'},
        '/docs/architecture/webserver': {redirect: '/docs/architecture/server-components#webserver'},
        '/docs/architecture/internal-storage': {redirect: '/docs/architecture/main-components#internal-storage'},
        '/docs/ee-server-cli': {redirect: '/docs/server-cli'},
        '/docs/ui/administration/workers': {redirect: '/docs/architecture/server-components#worker'},
        '/docs/ui/administration/users': {redirect: '/docs/enterprise/auth/rbac'},
        '/docs/how-to-guides/synchonous-executions-api': {redirect: '/docs/how-to-guides/synchronous-executions-api'},
        '/docs/getting-started/quickstart': {redirect: '/docs/quickstart'},
        '/docs/getting-started/contributing': {redirect: '/docs/contribute-to-kestra/contributing'},
        '/docs/getting-started/docs-contributor-guide': {redirect: '/docs/contribute-to-kestra/docs-contributor-guide'},
        '/docs/getting-started/community-guidelines': {redirect: '/docs/contribute-to-kestra/community-guidelines'},
        '/docs/getting-started/': {redirect: '/docs/quickstart'},
        '/docs/getting-started/selected-plugin-installation': {redirect: '/docs/how-to-guides/selected-plugin-installation'},
        '/docs/getting-started/plugins': {redirect: '/plugins'},
        '/docs/getting-started/workflow-components': {redirect: '/docs/workflow-components'},
        '/docs/getting-started/migration-guide': {redirect: '/docs/migration-guide'},
        '/docs/getting-started/installation': {redirect: '/docs/installation'},
        '/docs/getting-started/ui': {redirect: '/docs/ui'},
        '/docs/getting-started/tutorial': {redirect: '/docs/tutorial'},
        '/docs/tutorial/scripts': {redirect: '/docs/scripts'},
        '/docs/ui/ee': {redirect: '/docs/ui'},
        '/docs/workflow-components/tasks/scripts/input-output-files': {redirect: '/docs/scripts/input-output-files'},
        '/docs/workflow-components/tasks/scripts/bind-mount': {redirect: '/docs/scripts/bind-mount'},
        '/docs/workflow-components/tasks/scripts/runners': {redirect: '/docs/scripts/task-runners'},
        '/docs/administrator-guide/deployment/manual': {redirect: '/docs/administrator-guide/upgrades'},
        '/docs/workflow-components/tasks/scripts/outputs-metrics': {redirect: '/docs/scripts/outputs-metrics'},
        '/docs/workflow-components/tasks/scripts/logging': {redirect: '/docs/scripts/logging'},
        '/docs/expressions/filter/yaml': {redirect: '/docs/expressions#yaml-filters'},
        '/docs/configuration/index.md': {redirect: '/docs/configuration'},
        '/docstutorialflowable': {redirect: '/docs/tutorial/flowable'},
        '/docs/workflow-components/tasks/scripts/git-clone	': {redirect: '/docs/scripts/git-clone'},
        '/docs/workflow-components/tasks/scripts/commands-vs-scripts': {redirect: '/docs/scripts/commands-vs-scripts'},
        '/docs/workflow-components/tasks/scripts/custom-docker-image': {redirect: '/docs/scripts/custom-docker-image'},
        '/docs/08.architecture': {redirect: '/docs/architecture'},
        '/docs/ee': {redirect: '/docs/enterprise'},
        'docs/workflow-components/tasks/scripts/working-directory': {redirect: '/docs/scripts/working-directory'},
        '/docs/governance/audit-logs': {redirect: '/docs/enterprise/governance/audit-logs'},
        '/docs/instance/maintenance-mode': {redirect: '/docs/enterprise/instance/maintenance-mode'},
        '/docs/tasks': {redirect: '/docs/workflow-components/tasks'},
        '/docs/executions': {redirect: '/docs/workflow-components/executions'},
        '/docs/administrator-guide/servers': {redirect: '/docs/administrator-guide/server-lifecycle'},
        '/docs/governance/namespace-management': {redirect: '/docs/enterprise/governance/namespace-management'},
        '/docs/governance/centralized-task-configuration': {redirect: '/docs/enterprise/governance/namespace-management'},
        '/docs/governance/secrets': {redirect: '/docs/enterprise/governance/secrets'},
        '/docs/workflow-components/tasks/scripts/installing-dependencies': {redirect: '/docs/scripts/installing-dependencies'},
        '/docs/workflow-components/tasks/scripts/languages': {redirect: '/docs/scripts/languages'},
        '/docs/concepts/labels': {redirect: '/docs/workflow-components/labels'},
        '/docs/use-cases/pushnamespacefiles': {redirect: '/docs/how-to-guides/push-namespace-files'},
        '/docs/schedule-trigger': {redirect: '/docs/workflow-components/triggers/schedule-trigger'},
        '/docs/concepts/subflows': {redirect: '/docs/workflow-components/subflows'},
        '/docs/workflow-components/.triggers': {redirect: '/docs/workflow-components/triggers'},
        '/docs/user-interface-guide': {redirect: '/docs/ui'},
        '/docs/07.triggers': {redirect: '/docs/workflow-components/triggers'},
        '/docs/ui/administration/service-accounts': {redirect: '/docs/enterprise/auth/service-accounts'},
        '/docs/ui/administration/roles': {redirect: '/docs/enterprise/auth/rbac'},
        '/docs/ui/administration/groups': {redirect: '/docs/enterprise/auth/rbac'},
        '/docs/01.getting-started/03.contributing.md': {redirect: '/docs/contribute-to-kestra/contributing'},
        '/docs/concepts/worker-groups': {redirect: '/docs/enterprise/scalability/worker-group'},
        '/docs/ui/task-runs': {redirect: '/docs/workflow-components/tasks/taskruns'},
        '/docs/ui/administration/triggers': {redirect: '/docs/workflow-components/triggers'},
        '/docs/cicd/gitlab': {redirect: '/docs/version-control-cicd/cicd/gitlab'},
        '/docs/task-runners/types/...': {redirect: '/docs/task-runners/types'},
        '/docs/ui/administration/system-overview': {redirect: '/docs/enterprise/instance'},
        '/docs/ui/administration': {redirect: '/docs/enterprise/instance'},
        '/docs/helpers': {redirect: '/docs/version-control-cicd/cicd/helpers'},
        '/docs/ui/administration/audit-logs': {redirect: '/docs/enterprise/governance/audit-logs'},
        '/docs/plugin-developer-guide/flowable-task': {redirect: '/docs/workflow-components/tasks/flowable-tasks'},
        '/docs/plugin-developer-guide/runnable-task': {redirect: '/docs/workflow-components/tasks/runnable-tasks'},
        '/docs/administrator-guide/configuration/enterprise-edition/secrets/vault': {redirect: '/docs/enterprise/governance/secrets-manager'},
        '/docs/enterprise/google-oidc': {redirect: '/docs/enterprise/auth/sso/google-oidc'},
        '/docs/finally': {redirect: '/docs/workflow-components/finally'},
        '/docs/data-components': {redirect: '/docs/architecture/data-components'},
        '/docs/main-components': {redirect: '/docs/architecture/main-components'},
        '/docs/disabled': {redirect: '/docs/workflow-components/disabled'},
        '/docs/concepts/executions': {redirect: '/docs/workflow-components/execution'},
        '/docs/kubernetes-azure-aks': {redirect: '/docs/installation/kubernetes-azure-aks'},
        '/docs/prometheus-metrics': {redirect: '/docs/administrator-guide/prometheus-metrics'},
        '/docs/retries': {redirect: '/docs/workflow-components/retries'},
        '/docs/tasks/flowable-tasks': {redirect: '/docs/workflow-components/tasks/flowable-tasks'},
        '/docs/realtime-trigger': {redirect: '/docs/workflow-components/triggers/realtime-trigger'},
        '/docs/developer-guide/conditions': {redirect: '/docs/plugin-developer-guide/condition'},
        '/docs/kubernetes': {redirect: '/docs/installation/kubernetes'},
        '/docs/server-components': {redirect: '/docs/architecture/server-components'},
        '/docs/inputs': {redirect: '/docs/workflow-components/inputs'},
        '/docs/flow-trigger': {redirect: '/docs/workflow-components/triggers/flow-trigger'},
        '/docs/monitoring': {redirect: '/docs/administrator-guide/monitoring'},
        '/docs/task-runners/azure-batch-task-runner': {redirect: '/docs/task-runners/types/azure-batch-task-runner'},
        '/docs/workflow-components/flow-trigger': {redirect: '/docs/workflow-components/triggers/flow-trigger'},
        '/docs/workflow-components/webhook-trigger': {redirect: '/docs/workflow-components/triggers/webhook-trigger'},
        '/docs/workflow-components/schedule-trigger': {redirect: '/docs/workflow-components/triggers/schedule-trigger'},
        '/docs/errors': {redirect: '/docs/workflow-components/errors'},
        '/docs/languages': {redirect: '/docs/scripts/languages'},
        '/docs/outputs-metrics': {redirect: '/docs/scripts/outputs-metrics'},
        '/docs/overview': {redirect: '/docs'},
        '/docs/docker-task-runner': {redirect: '/docs/task-runners/types/docker-task-runner'},
        '/docs/process-task-runner': {redirect: '/docs/task-runners/types/process-task-runner'},
        '/docs/internal-storage': {redirect: '/docs/concepts/storage'},
        '/docs/plugins': {redirect: '/plugins'},
        '/docs/developer-guide/outputs': {redirect: '/docs/workflow-components/outputs'},
        '/docs/webhook-trigger': {redirect: '/docs/workflow-components/triggers/webhook-trigger'},
        '/docs/tenant-migration-oss': {redirect: '/docs/migration-guide/0.23.0/tenant-migration-oss'},
        '/docs/enterprise-namespace-pages': {redirect: '/docs/enterprise/governance/namespace-management'},
        '/docs/workflow-components/realtime-trigger': {redirect: '/docs/workflow-components/triggers/realtime-trigger'},
        '/docs/workflow-components/polling-trigger': {redirect: '/docs/workflow-components/triggers/polling-trigger'},
        '/docs/cicd/': {redirect: '/docs/version-control-cicd/cicd'},
        '/docs/concepts/task-properties': {redirect: '/docs/workflow-components/tasks'},
        '/docs/concepts/worker-group': {redirect: '/docs/enterprise/scalability/worker-group'},
        '/docs/how-to-guides/kestra/flows': {redirect: '/docs/how-to-guides/kestra/flow-sync'},
        '/docs/enterprise/auth-users/api-tokens': {redirect: '/docs/enterprise/auth/api-tokens'},
        '/docs/enterprise/auth/microsoft-oidc': {redirect: '/docs/enterprise/auth/sso/microsoft-oidc'},
        '/docs/auth/api-tokens': {redirect: '/docs/enterprise/auth/api-tokens'},
        '/docs/docs': {redirect: '/docs'},
        '/docs/version-control-cicd/github-action': {redirect: '/docs/version-control-cicd/cicd/github-action'},
        '/docs/enterprise/api-reference': {redirect: '/docs/api-reference/enterprise'},
        '/docs/version-control-cicd/gitlab': {redirect: '/docs/version-control-cicd/cicd/gitlab'},
        '/docs/enterprise/auth/scim/providers': {redirect: '/docs/enterprise/auth/scim'},
        '/docs/auth/sso/ldap': {redirect: '/docs/enterprise/auth/sso/ldap'},
        '/docs/auth/rbac': {redirect: '/docs/enterprise/auth/rbac'},
        '/docs/task-runners/aws-batch-task-runner': {redirect: '/docs/task-runners/types/aws-batch-task-runner'},
        '/docs/enterprise/keycloak': {redirect: '/docs/enterprise/auth/sso/keycloak'},
        '/docs/task-runners/google-batch-task-runner': {redirect: '/docs/task-runners/types/google-batch-task-runner'},
        '/docs/.architecture': {redirect: '/docs/architecture'},
        '/docs/webserver': {redirect: '/docs/architecture/server-components#webserver'},


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
        disableCacheOverviewLogMessage: true,
        data: {
            enabled: true,
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
