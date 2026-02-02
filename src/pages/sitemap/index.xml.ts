import type { APIRoute } from "astro"

export const GET: APIRoute = async () => {
    const xml = `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>https://kestra.io/sitemap/default.xml</loc>
    </sitemap>
    <sitemap>
        <loc>https://kestra.io/sitemap/blogs.xml</loc>
    </sitemap>
    <sitemap>
        <loc>https://kestra.io/sitemap/docs.xml</loc>
    </sitemap>
    <sitemap>
        <loc>https://kestra.io/sitemap/plugins.xml</loc>
    </sitemap>
    <sitemap>
        <loc>https://kestra.io/sitemap/blueprints.xml</loc>
    </sitemap>
    <sitemap>
        <loc>https://kestra.io/sitemap/use-cases.xml</loc>
    </sitemap>
    <sitemap>
        <loc>https://kestra.io/sitemap/misc.xml</loc>
    </sitemap>
</sitemapindex>`

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
        },
    })
}