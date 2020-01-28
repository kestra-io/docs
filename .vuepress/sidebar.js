const glob = require('glob');

const getChildren = function (parent_path, dir) {
    return glob
        .sync(parent_path + '/' + dir + '/**/*.md')
        .map(path => {
            // remove "parent_path" and ".md"
            path = path.slice(0, -3);
            // remove README
            if (path.endsWith('README')) {
                path = path.slice(0, -6)
            }
            return path
        })
        .sort()
};

module.exports = {
    '/docgen/': [
        {
            title: 'docgen Doc',   // required
            path: '/docgen',      // optional, which should be a absolute path.
            collapsable: false, // optional, defaults to true
            sidebarDepth: 1,    // optional, defaults to 1
            children: [
                '/docgen/overview',
                {
                    title: 'Webui',
                    path: '/docs/webui/',
                    collapsable: false,
                    sidebarDepth: 2,
                },
            ]
        }
    ],
    '/docs/': [
        {
            title: 'Documentation',   // required
            path: '/docs',      // optional, which should be a absolute path.
            collapsable: false, // optional, defaults to true
            sidebarDepth: 1,    // optional, defaults to 1
            children: [
                {
                    title: 'Getting Started',
                    path: '/docs/getting-started/',
                    collapsable: false,
                    sidebarDepth: 2,
                },
                {
                    title: 'Concepts',
                    collapsable: true,
                    path: '/docs/concepts/',
                    children: [
                        '/docs/concepts/flows',
                        '/docs/concepts/executions',
                        '/docgen/overview',
                    ]
                },
                {
                    title: 'Architecture',
                    path: '/docs/architecture/',
                    collapsable: false,
                    sidebarDepth: 2,
                },
                {
                    title: 'Developer guide',
                    path: '/docs/developer-guide/',
                    collapsable: false,
                    sidebarDepth: 2,
                },
                {
                    title: 'Administrator guide',
                    path: '/docs/administrator-guide/',
                    collapsable: false,
                    sidebarDepth: 2,
                },
                {
                    title: 'User interface guide',
                    path: '/docs/user-interface-guide/',
                    collapsable: false,
                    sidebarDepth: 2,
                },
                {
                    title: 'Plugins',
                    path: '/docs/plugins/',
                    collapsable: false,
                    sidebarDepth: 2,
                    children: [
                        '/docs/plugins/flow-model/',
                        '/docs/plugins/dynamic-fields/',
                        '/docs/plugins/inputs/',
                        '/docs/plugins/repository/',
                    ]
                },
            ]
        }
    ]
};