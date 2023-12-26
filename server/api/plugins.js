import { parseContent } from '#content/server';
import url from "node:url";

export default defineEventHandler(async (event) => {
    try {
        const requestUrl = new url.URL("http://localhost" + event.node.req.url);
        const page = requestUrl.searchParams.get("page");
        const type = requestUrl.searchParams.get("type");

        if (type === 'definitions') {
            let pageData = await $fetch(`https://api.kestra.io/v1/plugins/definitions/${page}`);

            const descriptionAsMd = await parseContent(`virtual:description.md`, pageData.markdown);

            return {
                descriptionAsMd: descriptionAsMd,
            }
        }
        if (type === 'plugin') {
            let  pageData = await $fetch(`https://api.kestra.io/v1/plugins/${page}`);

            const descriptionAsMd = await parseContent(`virtual:plugins.md`, pageData.body);

            return {
                descriptionAsMd: descriptionAsMd,
            }
        }

    } catch (error) {
        return {
            error: 'Failed to fetch or parse data',
        };
    }
});