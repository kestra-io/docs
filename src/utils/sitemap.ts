export const sitemapResponse = (urls: string[]): Response => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
    ${urls.map((r) => `<url><loc>${r}</loc></url>`).join("\n    ")}
</urlset>`

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
        },
    })
}