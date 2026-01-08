import type { APIRoute } from 'astro';
import { getCollection } from "astro:content";
import { sitemapResponse } from "~/utils/sitemap.ts";

export const GET: APIRoute = async () => {
    const allBlogPosts = await getCollection('misc');
    const urls = allBlogPosts.map(content => `https://kestra.io/${content.id}`)

    return sitemapResponse(urls);
};

