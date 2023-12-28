import url from 'node:url';
import {findAll} from "highlight-words-core";

export default defineEventHandler(async(event) => {
    const requestUrl = new url.URL("http://localhost" + event.node.req.url);
    const q = requestUrl.searchParams.get("q");
    const type = requestUrl.searchParams.get("type") || '';
    try {
        let searchResult = await $fetch(`https://api.kestra.io/v1/search?q=${q}&type=${type}`);
        if (q) {
            searchResult.results = searchResult.results.map(value => {
                const content = value.highlight;
                const summary = findAll({
                    searchWords: q.split(" "),
                    textToHighlight: content
                })
                    .map(chunk => {
                        const {end, highlight, start} = chunk;
                        const highlighted = content.substring(start, end);
                        if (highlight) {
                            return content.replaceAll(highlighted,`<mark>${highlighted}</mark>`);
                        }
                    })
                    .filter(value => value)

                return {
                    url: value.url,
                    title: value.title,
                    type: value.type,
                    highlight: summary,
                };
            });
        }
        return searchResult
    } catch (error) {
        throw createError({statusCode: 404, message: error.toString(), data: error, fatal: true})
    }
})
