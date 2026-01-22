import rss from "@astrojs/rss"
import { getCollection } from "astro:content"

export async function GET(context: any) {
    const blogs = await getCollection("blogs")

    return rss({
        title: "Kestra’s Blog",
        description: "Latest news and blog posts from kestra",
        site: context.site,
        items: blogs.map((post) => ({
            title: post.data.title,
            pubDate: post.data.date,
            description: post.data.description,
            link: `/blogs/${post.id}`,
        })),
        customData: `<language>en-us</language>`,
    })
}