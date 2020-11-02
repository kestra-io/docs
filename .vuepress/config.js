const path = require("path");
const sidebar = require("./sidebar");

const descriptionAppend = "Kestra is a platform to build, test, schedule & monitor complex pipelines.";
const description =  ($page) => {
    return $page.frontmatter.description !== undefined ? $page.frontmatter.description + " | " + descriptionAppend : $page.title + " | " + descriptionAppend;
}

module.exports = {
    title: 'Kestra',
    plugins: {
        '@vuepress/back-to-top': {},
        '@vuepress/nprogress' : {},
        '@vuepress/last-updated': {},
        '@vuepress/google-analytics' : {'ga': 'UA-56021-9'},
        'vuepress-plugin-medium-zoom': {},
        'seo': {
            description:description,
            customMeta: (add, context) => {
                const {$page,} = context

                add('description', description($page))
            },
        },
        'fulltext-search': {}
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
