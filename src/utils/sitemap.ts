type SitemapEntry = string | { loc: string; lastmod?: string | null }

export const formatLastMod = (d?: string | Date | null): string | null => {
    if (!d) return null
    const date = d instanceof Date ? d : new Date(d)
    if (Number.isNaN(date.getTime())) return null
    // Use full datetime in ISO 8601. Convert trailing Z to +00:00 for readability.
    const iso = date.toISOString()
    return iso.endsWith("Z") ? iso.replace(/Z$/, "+00:00") : iso
}

export const sitemapResponse = (entries: SitemapEntry[]): Response => {
    const normalized = entries.map((e) => (typeof e === "string" ? { loc: e } : e))

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
    ${normalized
        .map((r) =>
            r.lastmod
                ? `<url><loc>${r.loc}</loc><lastmod>${r.lastmod}</lastmod></url>`
                : `<url><loc>${r.loc}</loc></url>`,
        )
        .join("\n    ")}
</urlset>`

    return new Response(xml, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
        },
    })
}