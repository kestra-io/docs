import { posix } from "node:path"
import { hashString } from "~/utils/incrementalCacheKey"
import { resolveRelativeDocLink } from "~/markdown/remark/resolve-doc-link"
import { KESTRA_SITE_ORIGIN } from "~/utils/markdown-actions/resolveMarkdownUrl"
import { isAssetShapedDocPath } from "~/utils/versionedDocs"
import { splitLinkTarget, type RelativeLinkResolver } from "~/utils/docMarkdown"

export const DOCS_CONTENT_ROOT = "src/contents/docs"

const assetUrls = import.meta.glob("/src/contents/docs/**/*.{png,jpg,jpeg,gif,webp}", {
    query: "?url&no-inline",
    import: "default",
    eager: true,
}) as Record<string, string>

export function docAssetUrl(sourcePath: string): string | undefined {
    return assetUrls[`/${sourcePath}`]
}

export function docAssetUrlsDigest(): string {
    return hashString(JSON.stringify(assetUrls))
}

export interface DocSourceFile {
    basename: string
    dirname: string
}

export function docSourceFile(filePath: string): DocSourceFile {
    return { basename: posix.basename(filePath), dirname: posix.dirname(filePath) }
}

function assetSourcePath(file: DocSourceFile, path: string): string {
    const joined = posix.normalize(posix.join(file.dirname, path))
    const root = joined.indexOf(`${DOCS_CONTENT_ROOT}/`)
    return root === -1 ? joined : joined.slice(root)
}

export function latestDocLinkResolver(
    pageUrl: string,
    file: DocSourceFile,
    assetUrl: (sourcePath: string) => string | undefined = docAssetUrl,
): RelativeLinkResolver {
    return (target) => {
        const [path, suffix] = splitLinkTarget(target)
        if (/\.mdx?$/i.test(path) || !isAssetShapedDocPath(path)) {
            return new URL(resolveRelativeDocLink(path, file) + suffix, pageUrl).href
        }
        const url = assetUrl(assetSourcePath(file, path))
        return url === undefined ? undefined : new URL(url, KESTRA_SITE_ORIGIN).href + suffix
    }
}
