import { getCollection } from "astro:content"
import { getNavigationTree } from "./getNavigationTree"

export async function buildDocsNavigation() {
    const docsPages = await getCollection("docs")
    docsPages.sort((a, b) => {
        if (a.filePath && b.filePath) {
            return a.filePath.localeCompare(b.filePath)
        }
        return a.id.localeCompare(b.id)
    })

    return [
        {
            title: "Documentation",
            children: getNavigationTree(docsPages),
        },
    ]
}