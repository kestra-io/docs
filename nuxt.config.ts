export default defineNuxtConfig({
    modules: [
        '@nuxt/devtools',
        '@nuxt/content',
        'nuxt-gtag'
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
        // https://content.nuxtjs.org/api/configuration
        // TODO: remove document driven
        documentDriven: {
            navigation: false,
            page: true,
            surround: true,
            injectPage: false
        },
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
    // routeRules: {
    //     '/**': {swr: true},
    // }
})
