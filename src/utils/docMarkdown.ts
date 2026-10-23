import YAML from "yaml"
import { frontmatterField } from "~/utils/versionedDocs"

export interface DocMarkdownMeta {
    title: string
    h1?: string
    description?: string
    url: string
}

const FRONTMATTER_BLOCK_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const META_KEYS = ["title", "h1", "description"] as const

/**
 * The page metadata in a raw markdown source's frontmatter, parsed as YAML so
 * block scalars (`description: >`) and quoted values come through intact.
 * Falls back to the line-based frontmatterField when the block isn't valid
 * YAML or a value isn't a plain string.
 */
export function parseDocFrontmatter(
    markdown: string,
): Partial<Pick<DocMarkdownMeta, (typeof META_KEYS)[number]>> {
    let parsed: Record<string, unknown> = {}
    try {
        const block = FRONTMATTER_BLOCK_RE.exec(markdown)?.[1]
        const value = block === undefined ? undefined : YAML.parse(block)
        if (value && typeof value === "object") parsed = value as Record<string, unknown>
    } catch {
        // Malformed frontmatter: the per-line fallback below still finds what it can.
    }
    const meta: Partial<Pick<DocMarkdownMeta, (typeof META_KEYS)[number]>> = {}
    for (const key of META_KEYS) {
        const value = parsed[key]
        const text = typeof value === "string" ? value.trim() : frontmatterField(markdown, key)
        if (text) meta[key] = text
    }
    return meta
}

export type RelativeLinkResolver = (target: string) => string | undefined

export function splitLinkTarget(target: string): [path: string, suffix: string] {
    const cut = target.search(/[?#]/)
    return cut === -1 ? [target, ""] : [target.slice(0, cut), target.slice(cut)]
}

const RELATIVE_LINK_RE = /\]\((\.\.?\/[^\s)]*)((?:\s+"[^"]*")?)\)/g
const FENCE_RE = /^ {0,3}(`{3,}|~{3,})/

export function rewriteRelativeLinks(body: string, resolve: RelativeLinkResolver): string {
    let fence: string | undefined
    return body
        .split("\n")
        .map((line) => {
            const marker = FENCE_RE.exec(line)?.[1]
            if (marker) {
                if (!fence) {
                    fence = marker
                } else if (marker[0] === fence[0] && marker.length >= fence.length) {
                    fence = undefined
                }
                return line
            }
            if (fence) return line
            return line.replace(RELATIVE_LINK_RE, (written, target, title) => {
                const resolved = resolve(target)
                return resolved === undefined ? written : `](${resolved}${title})`
            })
        })
        .join("\n")
}

export function buildDocMarkdown(
    meta: DocMarkdownMeta,
    body: string,
    resolveLink?: RelativeLinkResolver,
): string {
    const frontmatter = YAML.stringify(
        { title: meta.title, description: meta.description, url: meta.url },
        { lineWidth: 0 },
    )
    const heading = meta.h1 ?? meta.title
    // A body straight from a stripped source keeps the blank line that followed
    // its frontmatter; the heading already provides that separation.
    const trimmed = body.replace(/^(?:[ \t]*\r?\n)+/, "")
    const content = resolveLink ? rewriteRelativeLinks(trimmed, resolveLink) : trimmed
    return `---\n${frontmatter}---\n\n# ${heading}\n\n${content}`
}
