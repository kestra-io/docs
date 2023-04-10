export default defineNuxtConfig({
    modules: [
        '@nuxt/devtools',
        '@nuxt/content'
    ],
    app: {
        baseURL: "/",
        // pageTransition: {name: 'page', mode: 'out-in'},
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
            theme: {
                // Default theme (same as single string)
                default: 'github-light',
                // Theme used if `html.dark`
                dark: 'github-dark',
                // Theme used if `html.sepia`
                sepia: 'monokai'
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
    // routeRules: {
    //     '/**': {swr: true},
    // }
})
