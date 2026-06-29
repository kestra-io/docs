import type { MarkdownActionContext, MarkdownActionDefinition, MarkdownUrls } from "./types"
import { resolveMarkdownUrls } from "./resolveMarkdownUrl"

const CHATGPT_ORIGIN = "https://chatgpt.com"
const CLAUDE_ORIGIN = "https://claude.ai"

function buildAiPrompt(urls: MarkdownUrls, pageTitle?: string): string {
    const titleLine = pageTitle ? `"${pageTitle}"` : "this documentation page"
    return [
        `Please read and help me understand the Kestra documentation ${titleLine}.`,
        "",
        `Page: ${urls.pageUrl}`,
        `Markdown: ${urls.markdownUrl}`,
    ].join("\n")
}

/**
 * Opens ChatGPT with a pre-filled prompt referencing the page and raw markdown URL.
 *
 * ChatGPT supports the `q` query parameter to pre-fill (and may auto-submit) the
 * chat input. It does not fetch external URLs on its own — users may need web
 * search or to paste the markdown URL manually.
 *
 * @see https://community.openai.com/t/query-parameters-in-chatgpt/1027747
 */
export function buildChatGptUrl(urls: MarkdownUrls, pageTitle?: string): string {
    const url = new URL("/", CHATGPT_ORIGIN)
    url.searchParams.set("q", buildAiPrompt(urls, pageTitle))
    return url.toString()
}

/**
 * Opens Claude with a pre-filled prompt referencing the page and raw markdown URL.
 *
 * `claude.ai/new?q=` pre-fills the composer but does not auto-submit (unlike
 * ChatGPT). Claude cannot fetch arbitrary URLs from the query string alone.
 */
export function buildClaudeUrl(urls: MarkdownUrls, pageTitle?: string): string {
    const url = new URL("/new", CLAUDE_ORIGIN)
    url.searchParams.set("q", buildAiPrompt(urls, pageTitle))
    return url.toString()
}

export function resolveActionUrl(
    actionId: MarkdownActionDefinition["id"],
    context: MarkdownActionContext,
): string | undefined {
    const urls = resolveMarkdownUrls(
        context.pagePath,
        context.pageUrl,
        typeof window !== "undefined" ? window.location.origin : undefined,
    )

    switch (actionId) {
        case "view":
            return urls.markdownUrl
        case "chatgpt":
            return buildChatGptUrl(urls, context.pageTitle)
        case "claude":
            return buildClaudeUrl(urls, context.pageTitle)
        default:
            return undefined
    }
}

export const MARKDOWN_ACTIONS: MarkdownActionDefinition[] = [
    {
        id: "copy",
        label: "Copy as Markdown",
        successLabel: "Copied!",
    },
    {
        id: "view",
        label: "View as Markdown",
    },
    {
        id: "chatgpt",
        label: "Open in ChatGPT",
    },
    {
        id: "claude",
        label: "Open in Claude",
    },
]
