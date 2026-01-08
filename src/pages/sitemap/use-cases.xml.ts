export const prerender = false;

import { slugify } from "@kestra-io/ui-libs";
import type { APIRoute } from 'astro';
import { $fetch } from "~/utils/fetch.ts";
import { sitemapResponse } from "~/utils/sitemap.ts";

export const GET: APIRoute = async () => {
    const data = await $fetch("https://api.kestra.io/v1/customer-stories-v2?size=9999") as {results: Array<any>, total: number}

    const urls = data.results.map(story => `https://kestra.io/use-cases/stories/${story.id}-${slugify(story.title ?? '--')}`)

    return sitemapResponse(urls);
};

