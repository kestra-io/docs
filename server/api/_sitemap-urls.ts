import {serverQueryContent} from '#content/server'
import url from "node:url";

export default cachedEventHandler(async e => {
    const requestUrl = new url.URL("http://localhost" + e.node.req.url);
    return (await serverQueryContent(e, '/').find()).map(e => {
        return {
            loc: e._path
        }
    })
}, {
    name: 'sitemap-dynamic-urls',
    maxAge: 60 * 10 // cache URLs for 10 minutes
})