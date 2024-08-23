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
      'nuxt-lazy-hydrate'
  ],
  target: 'server',
  image: {
    formats: {
        webp: {
            quality: 80
        }
    }
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
      navigation: {
          fields: ['hideSidebar'],
      },
      documentDriven: false,
      highlight: {
          langs: [
              'bash',
              'yaml',
              'sql',
              'java',
              'dockerfile',
              'systemd',
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
              'remark-code-import': {
                  rootDir: process.cwd()
              },
          }
      },
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
      '/docs/troubleshooting': {redirect: '/docs/administrator-guide/troubleshooting'},
      '/docs/developer-guide/scripts/rust': {redirect: '/docs/developer-guide/scripts/additional-languages'},
      '/docs/developer-guide/scripts/additional-languages': {redirect: '/docs/developer-guide/scripts/languages'},
      '/docs/developer-guide/best-practice': {redirect: '/docs/best-practices'},
      '/docs/developer-guide/best-practices': {redirect: '/docs/best-practices'},
      '/docs/best-practice': {redirect: '/docs/best-practices'},
      '/docs/workflow-components/trigger': {redirect: '/docs/workflow-components/triggers'},
      '/docs/workflow-components/realtime-triggers': {redirect: '/docs/workflow-components/realtime-trigger'},
      '/docs/workflow-components/triggers/conditions': {redirect: '/docs/workflow-components/triggers#conditions'},
      '/docs/workflow-components/flow-properties': {redirect: '/docs/workflow-components/flow'},
      '/docs/workflow-components/task-defaults': {redirect: '/docs/workflow-components/plugin-defaults'},
      '/docs/concepts/expression/02a.expression-types': {redirect: '/docs/concepts/expression/expression-types'},
      '/docs/concepts/expression/02b.expression-usage': {redirect: '/docs/concepts/expression/expression-usage'},
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
      '/docs/how-to-guides/google-spreadsheets': {redirect: '/docs/how-to-guides/google-sheets'},
      '/docs/flow-examples/**': {redirect: '/docs/how-to-guides'},
      '/docs/installation/troubleshooting': {redirect: '/docs/administrator-guide/troubleshooting'},
      '/docs/faq/troubleshooting': {redirect: '/docs/administrator-guide/troubleshooting'},
      '/docs/faq/flows': {redirect: '/docs/workflow-components/flows#faq'},
      '/docs/faq/variables': {redirect: '/docs/workflow-components/variables#faq'},
      '/docs/faq/enterprise': {redirect: '/docs/enterprise/faq'},
      '/docs/faq/internal-storage': {redirect: '/docs/developer-guide/storage#internal-storage-faq'},
      '/docs/faq': {redirect: '/docs/installation/troubleshooting'},
      '/videos': {redirect: '/tutorial-videos/all'},
      '/tutorial-videos': {redirect: '/tutorial-videos/all'},
      '/community-guidelines': {redirect: '/docs/getting-started/community-guidelines'},
      '/plugins/plugin-kubernetes/task-runners/io.kestra.plugin.kubernetes.runner.kubernetes': {redirect: '/plugins/plugin-ee-kubernetes/task-runners/io.kestra.plugin.ee.kubernetes.runner.kubernetes'},
      '/plugins/plugin-kubernetes/task-runners/io.kestra.plugin.ee.kubernetes.runner.kubernetes': {redirect: '/plugins/plugin-ee-kubernetes/task-runners/io.kestra.plugin.ee.kubernetes.runner.kubernetes'},
      '/plugins/plugin-aws/task-runners/io.kestra.plugin.aws.runner.batch': {redirect: '/plugins/plugin-ee-aws/task-runners//io.kestra.plugin.ee.aws.runner.batch'},
      '/plugins/plugin-aws/task-runners/io.kestra.plugin.ee.aws.runner.batch': {redirect: '/plugins/plugin-ee-aws/task-runners//io.kestra.plugin.ee.aws.runner.batch'},
      '/plugins/plugin-gcp/task-runners//io.kestra.plugin.gcp.runner.batch': {redirect: '/plugins/plugin-ee-gcp/task-runners//io.kestra.plugin.ee.gcp.runner.batch'},
      '/plugins/plugin-gcp/task-runners//io.kestra.plugin.ee.gcp.runner.batch': {redirect: '/plugins/plugin-ee-gcp/task-runners//io.kestra.plugin.ee.gcp.runner.batch'},
      '/plugins/plugin-gcp/task-runners/io.kestra.plugin.gcp.runner.cloudrun': {redirect: '/plugins/plugin-ee-gcp/task-runners/io.kestra.plugin.ee.gcp.runner.cloudrun'},
      '/plugins/plugin-gcp/task-runners/io.kestra.plugin.ee.gcp.runner.cloudrun': {redirect: '/plugins/plugin-ee-gcp/task-runners/io.kestra.plugin.ee.gcp.runner.cloudrun'},
      '/plugins/plugin-azure/task-runners/io.kestra.plugin.azure.runner.batch': {redirect: '/plugins/plugin-ee-azure/task-runners/io.kestra.plugin.ee.azure.runner.batch'},
      '/plugins/plugin-azure/task-runners/io.kestra.plugin.ee.azure.runner.batch': {redirect: '/plugins/plugin-ee-azure/task-runners/io.kestra.plugin.ee.azure.runner.batch'},
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
      timeline: {
          enabled: true
      }
  },

  compatibilityDate: '2024-07-16'
})
