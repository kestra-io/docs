const path = require("path");
const sidebar = require("./sidebar");

module.exports = {
    title: 'Kestra',
    description: "Kestra is a platform to build, test, schedule & monitor complex pipelines.",
    plugins: {
        '@vuepress/back-to-top': {},
        '@vuepress/nprogress' : {},
        '@vuepress/last-updated': {},
        '@vuepress/google-analytics' : {'ga': 'UA-56021-9'},
        'vuepress-plugin-medium-zoom': {}
    },
    themeConfig: {
        logo: '/logo.svg',
        // repo: 'kestra-io/kestra.io',
        // repoLabel: 'Contribute !',
        // docsDir: 'docs',
        // editLinks: true,
        smoothScroll: true,
        nav: [
            {text: 'Documentation', link: '/docs/'},
            {text: 'Plugins & Tasks', link: '/plugins/'},
        ],
        sidebar: {
            '/plugins/': [
                {
                    title: 'Plugins & Tasks',
                    collapsable: true,
                    sidebarDepth: 1,
                    children: sidebar(`${__dirname}/../plugins/`, '/plugins/')
                }
            ],
            '/docs/': [
                {
                    title: 'Documentation',
                    path: '/docs',
                    collapsable: false,
                    sidebarDepth: 1,
                    children: sidebar(`${__dirname}/../docs/`, '/docs/')
                }
            ]
        },
    },
    markdown: {
        extendMarkdown: md => {
            md.set({ breaks: true })
            md.use(require('markdown-it-mark'))
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@kestraui': path.resolve(__dirname, '../ui')
            }
        }
    }
};
