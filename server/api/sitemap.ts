import {slugify} from "~/utils/url.js";
import type {SitemapUrlInput} from "nuxt-simple-sitemap/dist/runtime/types";

export default defineSitemapEventHandler(async () => {
    type SitemapsToGenerate = { rootUrl: string, apiUrl: string };
    const sitemapsToGenerate: Array<SitemapsToGenerate> = [
        {
            rootUrl: '/blueprints/',
            apiUrl: 'https://api.kestra.io/v1/blueprints'
        },
        {
            rootUrl: '/use-cases/stories/',
            apiUrl: 'https://api.kestra.io/v1/customer-stories'
        }
    ];

    type PaginatedSitemapData = { totalPages: number, data: Array<SitemapUrlInput> };
    const fetchPageToSitemapFormat = async (sitemapInput: SitemapsToGenerate, page: number): Promise<PaginatedSitemapData> => {
        const pageSize = 20;
        const pageUrl = `${sitemapInput.apiUrl}?page=${page}&size=${pageSize}`;
        const response = await $fetch<{ total: number, results: [{id: string, title: string}] }>(pageUrl);
        return {
            totalPages: Math.ceil(response.total / pageSize),
            data: response.results.map(page => asSitemapUrl({
                loc: `${sitemapInput.rootUrl}${page.id}-${slugify(page.title)}`,
            }))
        };
    };

    const promises = sitemapsToGenerate.map(async sitemapInput => {
        let page = 1;
        let result;

        let data: Array<SitemapUrlInput> = [];

        do {
            result = await fetchPageToSitemapFormat(sitemapInput, page);
            data = data.concat(result.data);
            page++;
        } while (page <= result.totalPages);

        return data;
    });

    return (await Promise.all(promises)).flat();
});
