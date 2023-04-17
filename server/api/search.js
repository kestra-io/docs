import url from 'node:url';
import pkg from 'flexsearch/dist/flexsearch.bundle.js';
const { Document } = pkg;
import {findAll} from "highlight-words-core";
import {serverQueryContent, parseContent} from '#content/server'

function renderToText(node) {
    if (node.type === "text") {
        return node.value + "\n";
    }

    return `${node.children?.map(renderToText).join("") || ""}\n`;
}


export default defineEventHandler(async(event) => {
    const requestUrl = new url.URL("http://localhost" + event.node.req.url);
    const search = requestUrl.searchParams.get("query");
    const limit = requestUrl.searchParams.get("limit") || 20;

        let collection = Object.fromEntries((await serverQueryContent(event, '/').find())
        .map(value => {
            const key = value._path;

            try {
                return [
                    key,
                    {
                        slug: key,
                        title: value.title,
                        content: renderToText(value.body)
                    }
                ]
            } catch (e) {
                return null;
            }
        })
    );

    const index = new Document({
        language: "en",
        charset: "latin:simple",
        tokenize: 'forward',
        document: {
            id: "slug",
            index: ["title", "content"]
        }
    });

    Object
        .values(collection)
        .forEach((value) => index.add(value));
    const around = 50;
    const searchResult1 = [...new Set(index
        .search([
            {
                field: 'title',
                query: search,
                limit: limit,
                boost: 10,
            },
            {
                field: 'content',
                query: search,
                limit: limit,
            },
        ])
        .flatMap(value => {
            return value.result;
        }))]
        .map(value => collection[value])
        .map(value => {
            const content = value.content;

            value.content = findAll({
                searchWords: search.split(" "),
                textToHighlight: content
            })
                .map(chunk => {
                    const {end, highlight, start} = chunk;
                    const startText = start > around ? "..." : "";
                    const endText = content.length - end > around ? "..." : "";
                    const text = content.substring(start - around, end + around);
                    const highlighted = content.substring(start, end);
                    if (highlight) {
                        return startText + text.replaceAll(highlighted,`<mark>${highlighted}</mark>`) + endText;
                    }
                })
                .filter(value => value)
            return value;
        })
    return searchResult1;
})
