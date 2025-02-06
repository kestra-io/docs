import url from "node:url";

export default cachedEventHandler(async e => {
    const requestUrl = new url.URL("http://localhost" + e.node.req.url);
    return (await queryCollection(e, 'docs').all()).map(e => {
        return {
            loc: e.path
        }
    })
}, {
    name: 'sitemap-dynamic-urls',
    maxAge: 60 * 10 // cache URLs for 10 minutes
})