import {} from '#nuxt-multi-cache/composables'

import {parseContent} from '#content/server';
import url from "node:url";


export default defineEventHandler(async (event) => {

    let relatedBlueprints = []
    let flowAsMd = '';

    const requestUrl = new url.URL("http://localhost" + event.node.req.url);
    const query = requestUrl.searchParams.get("query");
    const pageData = await $fetch(`https://api.kestra.io/v1/blueprints/${query}`)
    if (pageData) {

        const data = await $fetch(`https://api.kestra.io/v1/blueprints?tags=${pageData.tags}&size=3`)
        if (data) {
            relatedBlueprints = data.results.filter(b => b.id !== pageData.id)
        }
        const flowMd = '```yaml\n' + pageData.flow + '\n```';
        flowAsMd = await parseContent(`virtual:flow.md`, flowMd);
    }

    const graphData = await $fetch(`https://api.kestra.io/v1/blueprints/${query}/graph`)

    const descriptionAsMd = await parseContent(`virtual:description.md`, pageData.description);

    return {
        page: pageData,
        graph: graphData,
        descriptionAsMd: descriptionAsMd,
        flowAsMd: flowAsMd,
        relatedBlueprints: relatedBlueprints
    }
})