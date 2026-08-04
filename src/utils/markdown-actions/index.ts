export type {
    MarkdownActionContext,
    MarkdownActionDefinition,
    MarkdownActionId,
    MarkdownUrls,
} from "./types"

export {
    KESTRA_SITE_ORIGIN,
    normalizePagePath,
    resolveDocsPagePath,
    resolveMarkdownPath,
    resolveMarkdownUrl,
    resolveMarkdownUrls,
    resolvePageUrl,
} from "./resolveMarkdownUrl"

export {
    MARKDOWN_ACTIONS,
    buildChatGptUrl,
    buildClaudeUrl,
    resolveActionUrl,
} from "./actions"
