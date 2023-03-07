
export default (
    {
        Vue, // the version of Vue being used in the VuePress app
        options, // the options for the root Vue instance
        router, // the router instance for the app
        siteData // site metadata
    }) => {

    router.addRoutes([
        { path: '/blogs/2022-02-01-leroy-merlin-usage-kestra(.*)', redirect: '/blogs/2022-02-22-leroy-merlin-usage-kestra.html' },
        { path: '/docs/developer-guide/flowable/', redirect: '/docs/developer-guide/tasks/#flowable-tasks'}
    ])
}