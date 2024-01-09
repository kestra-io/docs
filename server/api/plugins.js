import {parseMarkdown} from '@nuxtjs/mdc/runtime'
import url from "node:url";

function toNuxtContent(parsedMarkdown) {
    return {
        body: {
            toc: parsedMarkdown.toc,
            ...parsedMarkdown.body
        },
        description: parsedMarkdown.data.description,
        title: parsedMarkdown.data.title,
    };
}

export default defineEventHandler(async (event) => {
    try {
        const requestUrl = new url.URL("http://localhost" + event.node.req.url);
        const page = requestUrl.searchParams.get("page");
        const type = requestUrl.searchParams.get("type");
        const config = useRuntimeConfig();

        if (type === 'definitions') {
            let pageData = await $fetch(`${config.public.apiUrl}/plugins/definitions/${page}`);

            const parsedMarkdown = await parseMarkdown(pageData.markdown);

            return toNuxtContent(parsedMarkdown);
        }
        if (type === 'plugin') {
            let pageData = await $fetch(`${config.public.apiUrl}/plugins/${page}`);

            const parsedMarkdown = await parseMarkdown(pageData.body);

            return toNuxtContent(parsedMarkdown);
        }

    } catch (error) {
        return {
            message: 'Failed to fetch or parse data',
            error: error,
        };
    }
});