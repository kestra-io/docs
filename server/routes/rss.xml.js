import RSS from "rss"

const SITE_URL = "https://kestra.io"

export default defineEventHandler(async (event) => {
    const blogs = await queryCollection(event, 'blogs').order("date", "DESC").select('title', 'path', 'date', 'description').all()

    const feed = new RSS({
        title: 'Kestra',
        site_url: SITE_URL,
        feed_url: `${SITE_URL}/rss.xml`,
    })

    for (const blog of blogs) {
        feed.item({
            title: blog.title,
            url: `${SITE_URL}${blog.path}`,
            date: blog.date,
            description: blog.description,
        })
    }
    const feedString = feed.xml({ indent: true })

    event.node.res.setHeader('content-type', 'text/xml')
    event.node.res.end(feedString)
})