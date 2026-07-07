import type { MarkdownUrls } from "./types"

export const KESTRA_SITE_ORIGIN = "https://kestra.io"

export function normalizePagePath(pagePath: string): string {
    const trimmed = pagePath.trim()
    if (!trimmed || trimmed === "/") {
        return "/"
    }
    const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`
    return withLeadingSlash.replace(/\/+$/, "") || "/"
}

/** Appends `.md` to a docs page path, e.g. `/docs/foo` → `/docs/foo.md`. */
export function resolveMarkdownPath(pagePath: string): string {
    const normalized = normalizePagePath(pagePath)
    return normalized === "/" ? "/.md" : `${normalized}.md`
}

export function resolvePageUrl(pagePath: string, origin = KESTRA_SITE_ORIGIN): string {
    const normalized = normalizePagePath(pagePath)
    return new URL(normalized, origin).toString().replace(/\/$/, normalized === "/" ? "/" : "")
}

export function resolveMarkdownUrl(pagePath: string, origin = KESTRA_SITE_ORIGIN): string {
    const markdownPath = resolveMarkdownPath(pagePath)
    return new URL(markdownPath, origin).toString()
}

export function resolveDocsPagePath(docId: string): string {
    if (docId === "<index>") {
        return "/docs"
    }
    return `/docs/${docId}`
}

export function resolveMarkdownUrls(
    pagePath: string,
    pageUrl?: string,
    origin = KESTRA_SITE_ORIGIN,
): MarkdownUrls {
    const resolvedOrigin = pageUrl ? new URL(pageUrl).origin : origin
    return {
        pageUrl: pageUrl ?? resolvePageUrl(pagePath, resolvedOrigin),
        markdownPath: resolveMarkdownPath(pagePath),
        markdownUrl: resolveMarkdownUrl(pagePath, resolvedOrigin),
    }
}
