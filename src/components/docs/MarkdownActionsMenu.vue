<template>
    <div v-if="markdownBody" class="markdown-actions dropdown">
        <button
            class="markdown-actions-trigger"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            aria-label="Markdown actions"
        >
            <div class="markdown-actions-trigger-content">
                <component :is="triggerIcon" class="action-icon" />
                <span class="action-text">{{ triggerLabel }}</span>
                <ChevronDown class="chevron-icon" />
            </div>
        </button>

        <ul class="dropdown-menu markdown-actions-menu">
            <li v-for="action in actions" :key="action.id">
                <button
                    class="dropdown-item markdown-actions-item"
                    type="button"
                    @click="handleAction(action.id)"
                >
                    <component :is="actionIcons[action.id]" class="action-icon" />
                    <span>{{ actionLabel(action) }}</span>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import ContentCopy from "vue-material-design-icons/ContentCopy.vue"
    import Check from "vue-material-design-icons/Check.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline.vue"
    import OpenInNew from "vue-material-design-icons/OpenInNew.vue"
    import { useMarkdownActions } from "~/composables/useMarkdownActions"
    import type { MarkdownActionDefinition, MarkdownActionId } from "~/utils/markdown-actions"

    const props = defineProps<{
        markdownBody: string
        pagePath: string
        pageTitle?: string
        pageUrl?: string
    }>()

    const context = computed(() => ({
        markdownBody: props.markdownBody,
        pagePath: props.pagePath,
        pageTitle: props.pageTitle,
        pageUrl: props.pageUrl,
    }))

    const { actions, copied, executeAction } = useMarkdownActions(context)

    const actionIcons: Record<MarkdownActionId, typeof ContentCopy> = {
        copy: ContentCopy,
        view: FileDocumentOutline,
        chatgpt: OpenInNew,
        claude: OpenInNew,
    }

    const triggerIcon = computed(() => (copied.value ? Check : ContentCopy))
    const triggerLabel = computed(() => (copied.value ? "Copied!" : "Copy Page"))

    const actionLabel = (action: MarkdownActionDefinition) => {
        if (action.id === "copy" && copied.value && action.successLabel) {
            return action.successLabel
        }
        return action.label
    }

    const handleAction = async (actionId: MarkdownActionId) => {
        await executeAction(actionId)
    }
</script>

<style lang="scss" scoped>
    .markdown-actions {
        display: flex;
        padding: 1.25rem 0;
        @include media-breakpoint-up(lg) {
            padding: 1.25rem;
        }
    }

    .markdown-actions-trigger {
        display: flex;
        padding: 0;
        border: 0;
        background: transparent;
        cursor: pointer;
        color: var(--ks-content-primary);

        &:hover,
        &:focus,
        &:focus-visible {
            color: var(--ks-content-link);
            outline: none;
        }

        .markdown-actions-trigger-content {
            display: flex;
            align-items: center;
            gap: 6px;
            border: $block-border;
            padding: 0.35rem $rem-1;
            border-radius: 0.25rem;
            font-size: $font-size-xs;
        }
    }

  .show .markdown-actions-trigger {
        color: var(--ks-content-link);
    }

    .markdown-actions-menu {
        background-color: var(--ks-background-input);
        border: $block-border;
        border-radius: 0.25rem;
        padding: 0.25rem 0;
        min-width: 12rem;
    }

    .markdown-actions-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.35rem 0.75rem;
        border: 0;
        background: transparent;
        color: var(--ks-content-primary);
        font-size: $font-size-xs;
        text-align: left;

        &:hover,
        &:focus {
            background-color: rgba(255, 255, 255, 0.08);
            color: var(--ks-content-link);
        }
    }

    .action-icon {
        display: flex;
        flex-shrink: 0;

        :deep(svg) {
            width: 16px;
            height: 16px;
        }
    }

    .chevron-icon {
        display: flex;
        margin-left: 0.125rem;
        transition: transform 0.3s;

        :deep(svg) {
            width: 14px;
            height: 14px;
        }
    }

    .show .chevron-icon {
        transform: rotate(180deg);
    }
</style>
