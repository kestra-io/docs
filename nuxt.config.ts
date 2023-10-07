import codeImport from 'remark-code-import';
import remarkFlexibleMarkers from "remark-flexible-markers";

export default defineNuxtConfig({
  modules: [
      '@nuxt/devtools',
      '@nuxt/content',
      '@nuxt/image',
      'nuxt-gtag',
      'nuxt-simple-sitemap',
      'nuxt-multi-cache'
  ],

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
              {property: 'og:image', content:'/og-image.png'}
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
      navigation: {
          fields: ["_file"]
      },
      markdown: {
          remarkPlugins: {
              'remark-flexible-markers': {
                  markerClassName: 'type-mark',
                  instance: remarkFlexibleMarkers
              },
              'remark-code-import': {
                  instance: codeImport
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
      compressPublicAssets: true,
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