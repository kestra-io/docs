export type MarkdownActionId = "copy" | "view" | "chatgpt" | "claude" | "edit"

export interface MarkdownActionContext {
    pagePath: string
    markdownBody: string
    lazyMarkdown?: boolean
    pageTitle?: string
    pageUrl?: string
    editUrl?: string
    stem?: string
    extension?: string
}

export interface MarkdownUrls {
    pageUrl: string
    markdownUrl: string
    markdownPath: string
}

export interface MarkdownActionDefinition {
    id: MarkdownActionId
    label: string
    successLabel?: string
}
