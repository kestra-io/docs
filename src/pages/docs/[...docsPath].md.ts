import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import { entryCacheKey } from "~/utils/incrementalCacheKey"
import { buildDocMarkdown } from "~/utils/docMarkdown"
import { resolveDocsPagePath, resolvePageUrl } from "~/utils/markdown-actions"
import {
    docAssetUrlsDigest,
    docSourceFile,
    latestDocLinkResolver,
} from "~/utils/latestDocLinks"

export async function getStaticPaths() {
    const docsPages = await getCollection("docs")
    const assetsDigest = docAssetUrlsDigest()
    return docsPages.map((doc) => ({
        params: { docsPath: doc.id },
        props: {
            title: doc.data.title,
            h1: doc.data.h1,
            description: doc.data.description,
            url: resolvePageUrl(resolveDocsPagePath(doc.id)),
            filePath: doc.filePath,
            source: doc.body,
        },
        cacheKey: entryCacheKey(doc, assetsDigest),
    }))
}

/**
 * respond with the markdown content of the doc page: frontmatter, the page's
 * real H1, then the source body with its relative links resolved.
 * to be used by AI or other tools that want to consume the markdown content directly.
 */
export const GET: APIRoute = ({ props }) => {
    const { title, h1, description, url, filePath, source } = props
    const resolveLink = filePath ? latestDocLinkResolver(url, docSourceFile(filePath)) : undefined
    return new Response(buildDocMarkdown({ title, h1, description, url }, source ?? "", resolveLink), {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
        },
    })
}
