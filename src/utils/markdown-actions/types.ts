export type MarkdownActionId = "copy" | "view" | "chatgpt" | "claude"

export interface MarkdownActionContext {
    /** Canonical page path, e.g. `/docs/quickstart` or `/docs`. */
    pagePath: string
    /** Raw markdown source for clipboard copy. */
    markdownBody: string
    /** Optional page title for AI prompt context. */
    pageTitle?: string
    /** Optional absolute page URL; resolved from `pagePath` when omitted. */
    pageUrl?: string
}

export interface MarkdownUrls {
    pageUrl: string
    markdownUrl: string
    markdownPath: string
}

export interface MarkdownActionDefinition {
    id: MarkdownActionId
    label: string
    /** Shown briefly after copy succeeds. */
    successLabel?: string
}
