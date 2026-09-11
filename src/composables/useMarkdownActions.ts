import { computed, toValue, type MaybeRefOrGetter } from "vue"
import { useClipboard } from "@vueuse/core"
import {
    MARKDOWN_ACTIONS,
    resolveActionUrl,
    resolveMarkdownUrls,
    type MarkdownActionContext,
    type MarkdownActionId,
} from "~/utils/markdown-actions"

export function useMarkdownActions(context: MaybeRefOrGetter<MarkdownActionContext>) {
    const { copy, copied } = useClipboard()

    const urls = computed(() => {
        const ctx = toValue(context)
        const origin =
            typeof window !== "undefined" ? window.location.origin : undefined
        return resolveMarkdownUrls(ctx.pagePath, ctx.pageUrl, origin)
    })

    const loadMarkdown = async (): Promise<string> => {
        try {
            const response = await fetch(urls.value.markdownUrl)
            return response.ok ? await response.text() : ""
        } catch {
            return ""
        }
    }

    const executeAction = async (actionId: MarkdownActionId) => {
        const ctx = toValue(context)

        if (actionId === "copy") {
            const body =
                ctx.markdownBody?.trim() ||
                (ctx.lazyMarkdown ? (await loadMarkdown()).trim() : "")
            if (!body) {
                return
            }
            await copy(body)
            return
        }

        const targetUrl = resolveActionUrl(actionId, {
            ...ctx,
            pageUrl: urls.value.pageUrl,
        })

        if (targetUrl && typeof window !== "undefined") {
            window.open(targetUrl, "_blank", "noopener,noreferrer")
        }
    }

    return {
        actions: MARKDOWN_ACTIONS,
        copied,
        executeAction,
        urls,
    }
}
