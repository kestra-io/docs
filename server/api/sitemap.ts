import {slugify} from "~/utils/url.js";

export default defineSitemapEventHandler(async (e) => {

    const urls = [
        {
            pageName: '/blueprints/',
            baseUrl: 'https://api.kestra.io/v1/blueprints'
        },
        {
            pageName: '/use-cases/stories/',
            baseUrl: 'https://api.kestra.io/v1/customer-stories'
        }
    ];

    const fetchDataForPage = async (url, page) => {
        const pageSize = 20;
        const pageUrl = `${url.baseUrl}?page=${page}&size=${pageSize}`;
        const response = await $fetch(pageUrl);
        return {
            totalPages: Math.ceil(response.total / pageSize),
            data: response.results.map(page => ({
                loc: `${url.pageName}${page.id}-${slugify(page.title)}`,
            }))
        };
    };

    const fetchAllPages = async () => {
        const allData = [];

        for (const url of urls) {
            let page = 1;
            let result;

            do {
                result = await fetchDataForPage(url, page);
                allData.push(...result.data);
                page++;
            } while (page <= result.totalPages);
        }

        return allData;
    };

    return await fetchAllPages();
});
