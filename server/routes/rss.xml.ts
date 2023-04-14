import { serverQueryContent } from '#content/server'
import RSS from 'rss'

const SITE_URL = "https://kestra.io"

export default defineEventHandler(async (event) => {
    const pages = await serverQueryContent(event).sort({ date: -1 }).where({ _partial: false }).find()
    const blogs = pages.filter((page) => page?._path?.includes('/blogs/'))


    const feed = new RSS({
        title: 'Kestra',
        site_url: SITE_URL,
        feed_url: `${SITE_URL}/rss.xml`,
    })

    for (const blog of blogs) {
        feed.item({
            title: blog.title,
            url: `${SITE_URL}${blog._path}`,
            date: blog.date,
            description: blog.description,
        })
    }
    const feedString = feed.xml({ indent: true })

    event.res.setHeader('content-type', 'text/xml')
    event.res.end(feedString)
})