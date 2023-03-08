
export default (
    {
        Vue, // the version of Vue being used in the VuePress app
        options, // the options for the root Vue instance
        router, // the router instance for the app
        siteData // site metadata
    }) => {

    router.addRoutes([
        { path: '/blogs/2022-02-01-leroy-merlin-usage-kestra(.*)', redirect: '/blogs/2022-02-22-leroy-merlin-usage-kestra.html' },
        // 2023-03-06: redirect for the old Flowable page
        { path: '/docs/developer-guide/flowable/', redirect: '/docs/developer-guide/tasks/'},
        // 2023-03-08: redirect Helpers to cicd/helpers page
        { path: '/docs/developer-guide/helpers/', redirect: '/docs/developer-guide/cicd/helpers/'},
        // 2023-03-08: redirect Retries to the Error Handling page
        { path: '/docs/developer-guide/retries/', redirect: '/docs/developer-guide/errors-handling/'},
    ])
}