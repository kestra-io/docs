import {parseMarkdown} from '@nuxtjs/mdc/runtime'
import url from "node:url";

export default defineEventHandler(async (event) => {
    let relatedBlueprints = []
    let flowAsMd = '';

    const requestUrl = new url.URL("http://localhost" + event.node.req.url);
    const query = requestUrl.searchParams.get("query");
    let pageData;

    try {
        pageData = await $fetch(`https://api.kestra.io/v1/blueprints/${query}`)
    } catch (e) {
        setResponseStatus(event, 404)
        return {message: "Not Found"};
    }

    if (pageData.tags && pageData.tags.length > 0) {
        const data = await $fetch(`https://api.kestra.io/v1/blueprints?tags=${pageData.tags}&size=3`)
        if (data) {
            relatedBlueprints = data.results.filter(b => b.id !== pageData.id)
        }
    }
    const flowMd = '```yaml\n' + pageData.flow + '\n```';
    flowAsMd = await parseMarkdown(flowMd);

    const graphData = await $fetch(`https://api.kestra.io/v1/blueprints/${query}/graph`)

    const descriptionAsMd = await parseMarkdown(pageData.description);

    return {
        page: pageData,
        graph: graphData,
        descriptionAsMd: descriptionAsMd,
        flowAsMd: flowAsMd,
        relatedBlueprints: relatedBlueprints,
        metaDescription: pageData.metaDescription
    }
})