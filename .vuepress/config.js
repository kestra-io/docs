const path = require("path");
const sidebar = require("./sidebar");
const fs = require("fs");

const descriptionAppend = "Kestra, infinitely scalable open source orchestration & scheduling platform.";
const description = ($page) => {
    return $page.frontmatter.description !== undefined ? $page.frontmatter.description + " | " + descriptionAppend : $page.title + " | " + descriptionAppend;
}

module.exports = {
    title: 'Kestra',

    plugins: {
        '@vuepress/back-to-top': {},
        '@vuepress/nprogress' : {},
        '@vuepress/last-updated': {},
        '@vuepress/google-analytics' : {'ga': 'UA-56021-9'},
        'vuepress-plugin-medium-zoom': {'selector' : '.content__default img'},
        'seo': {
            description: description,
            author: ($page, $site) => $page.frontmatter.author || $site.themeConfig.author,
            image: ($page, $site) => {
                return $site.themeConfig.domain + ($page.frontmatter.image ? $page.frontmatter.image : "/og-image.png");
            }
        },
        'fulltext-search': {
            'topCategoryLevel': 1,
            // hooks: fs.readFileSync(path.resolve(__dirname, './searchHooks.js')),
        },
        'vuepress-plugin-child-toc': {},
        'vuepress-plugin-code-copy': {}
    },
    head: [
        ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
        ['link', { rel: 'manifest',  href: '/site.webmanifest' }],
        ['link', { rel: 'mask-icon',  href: '/safari-pinned-tab.svg', color: '#192a4e' }],
        ['meta', { name: 'msapplication-TileColor',  content: '#192a4e' }],
        ['meta', { name: 'theme-color',  content: '#192a4e' }],
    ],
    themeConfig: {
        domain: 'https://kestra.io',
        logo: '/logo-white.svg',
        repo: 'kestra-io/kestra',
        repoLabel: 'GitHub',
        docsRepo: 'kestra-io/kestra.io',
        editLinks: true,
        smoothScroll: true,
        searchMaxSuggestions: 10,
        author: {
            'name': 'Kestra',
            'twitter': '@kestra_io'
        },
        sidebar: {
            '/plugins/': [
                {
                    title: 'Plugins',
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
            md.set({breaks: true})
            md.use(require('markdown-it-mark'))

            md.renderer.rules.table_open = function(tokens, idx) {
                return '<div class="table-responsive"><table class="table table-bordered table-hover table-striped">';
            };

            md.renderer.rules.table_close = function(tokens, idx) {
                return '</table></div>';
            };
        }
    }
};
