import {parseContent} from '#content/server';
import url from "node:url";
import remarkCodeImport from "remark-code-import";
import remarkFlexibleMarkers from "remark-flexible-markers";

// need to explicit import every remark plugins
if (false) {
    console.assert(remarkCodeImport !== undefined, "remark-code-import failed to load");
    console.assert(remarkFlexibleMarkers !== undefined, "remark-flexible-markers failed to load");
}

export default defineEventHandler(async (event) => {
    let relatedBlueprints = []
    let flowAsMd = '';

    const requestUrl = new url.URL("http://localhost" + event.node.req.url);
    const query = requestUrl.searchParams.get("query");
    const pageData = await $fetch(`https://api.kestra.io/v1/blueprints/${query}`)

    if (pageData) {
        if (pageData.tags && pageData.tags.length > 0) {
            const data = await $fetch(`https://api.kestra.io/v1/blueprints?tags=${pageData.tags}&size=3`)
            if (data) {
                relatedBlueprints = data.results.filter(b => b.id !== pageData.id)
            }
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