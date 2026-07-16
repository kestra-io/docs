import { getCollection } from "astro:content"
import { getNavigationTree } from "./getNavigationTree"

export async function buildDocsNavigation() {
    const docsPages = await getCollection("docs")

    return [
        {
            title: "Documentation",
            children: getNavigationTree(docsPages),
        },
    ]
}