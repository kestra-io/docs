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

    const executeAction = async (actionId: MarkdownActionId) => {
        const ctx = toValue(context)

        if (actionId === "copy") {
            if (!ctx.markdownBody) {
                return
            }
            await copy(ctx.markdownBody.trim())
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
