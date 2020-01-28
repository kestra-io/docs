const path = require("path");
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
    title: 'Kestra',
    description: "Kestra is a platform to build, test, schedule & monitor complex pipelines.",
    plugins: [
        '@vuepress/back-to-top',
        '@vuepress/nprogress',
        '@vuepress/last-updated',
        '@vuepress/google-analytics',
        {
            'ga': 'UA-00000000-0'
        },
        'vuepress-plugin-medium-zoom',
    ],
    themeConfig: {
        logo: '/logo.svg',
        repo: 'kestra-io/kestra',
        repoLabel: 'Contribute !',
        docsDir: 'docs',
        editLinks: true,
        smoothScroll: true,
        sidebar: require("./sidebar"),
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@kestraui': path.resolve(__dirname, '../ui')
            }
        }
    }
};
