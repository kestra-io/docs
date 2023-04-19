import codeImport from 'remark-code-import';
export default defineNuxtConfig({
    modules: [
        '@nuxt/devtools',
        '@nuxt/content',
        'nuxt-gtag',
        'nuxt-simple-sitemap',
    ],
    app: {
        baseURL: "/",
        // pageTransition: {name: 'page', mode: 'out-in'}
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
        }
    },
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
        navigation: {
            fields: ["_file"]
        },
        markdown: {
            remarkPlugins: {
                'remark-flexible-markers': {
                    markerClassName: 'type-mark'
                },
                'remark-code-import': {
                    instance: codeImport
                },
            }
        }
    },
    router: {
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
    gtag: {
        id: 'G-EYVNS03HHR',
        initialConsent: false
    },
    runtimeConfig: {
        public: {
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://kestra.io',
        }
    },
    // if using nuxt generate
    nitro: {
        prerender: {
            routes: ['/rss.xml'],
        },
    },
    routeRules: {
        // 2023-04-17 : defines old site redirects
        '/features/usages.html': {redirect: '/use-cases'},
        '/features/features.html': {redirect: '/features'},
        '/features/enterprise.html': {redirect: '/enterprise'},
        '/company/privacy-policy.html': {redirect: '/privacy-policy'},
        '/company/cookie-policy.html': {redirect: '/cookie-policy'},
        '/company/contact.html': {redirect: '/contact-us'},
        '/company/careers.html': {redirect: '/careers'},
        '/company/company/about-us.html': {redirect: '/about-us'},
        '/community.html': {redirect: '/community'},
        '/slack': {redirect: 'https://api.kestra.io/v1/communities/slack/redirect'},

    },
    build: {
        transpile: ['vue3-count-to']
    },
})
