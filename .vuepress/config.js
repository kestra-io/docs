const path = require("path");
const sidebar = require("./sidebar");
const fs = require("fs");

const descriptionAppend = "The modern, scalable orchestrator & scheduler open source platform.";
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
        'vuepress-plugin-medium-zoom': {'selector' : '.content__default img'},
        'seo': {
            description:description,
            customMeta: (add, context) => {
                const {$page} = context

                add('description', description($page))
            },
        },
        'fulltext-search': {
            'topCategoryLevel': 1,
            // hooks: fs.readFileSync(path.resolve(__dirname, './searchHooks.js')),
        },
        'vuepress-plugin-child-toc': {},
        'vuepress-plugin-code-copy': {}
    },
    themeConfig: {
        logo: '/logo-white.svg',
        repo: 'kestra-io/kestra',
        repoLabel: 'GitHub',
        docsRepo: 'kestra-io/kestra.io',
        editLinks: true,
        smoothScroll: true,
        searchMaxSuggestions: 10,
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
