const path = require("path");
module.exports = {
    themeConfig: {
        logo: '/logo.svg',
        repo: 'kestra-io/kestra',
        repoLabel: 'Contribute !',
        docsDir: 'docs',
        smoothScroll: true,
        sidebar: [
            {
                title: 'Documentation',   // required
                path: '/',      // optional, which should be a absolute path.
                collapsable: false, // optional, defaults to true
                sidebarDepth: 1,    // optional, defaults to 1
                children: [
                    {
                        title: 'Terminology',
                        path: '/terminology/',
                        collapsable: false,
                        sidebarDepth: 2,
                    },
                    {
                        title: 'Webui',
                        path: '/webui/',
                        collapsable: false,
                        sidebarDepth: 2,
                    },
                    {
                        title: 'Task model',
                        path: '/task/',
                        collapsable: false,
                        sidebarDepth: 2,
                    },
                    {
                        title: 'Dynamic fields',
                        path: '/dynamic-fields/',
                        collapsable: false,
                        sidebarDepth: 2,
                    },
                    {
                        title: 'Plugins',
                        path: '/plugins/',
                        collapsable: false,
                        sidebarDepth: 2,
                    },
                    {
                        title: 'Technical architecture',
                        path: '/technical-architecture/',
                        collapsable: false,
                        sidebarDepth: 2,
                    },
                    {
                        title: 'Inputs',
                        path: '/inputs/',
                        collapsable: false,
                        sidebarDepth: 2,
                    },
                ]
            }
        ]
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@kestraui': path.resolve(__dirname, '../ui')
            }
        }
    }
}