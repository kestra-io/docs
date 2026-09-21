<template>
    <div
        v-if="markdownBody || lazyMarkdown"
        class="markdown-actions"
        ref="root"
        :class="{ open }"
    >
        <button
            class="markdown-actions-trigger"
            type="button"
            :aria-expanded="open"
            aria-label="Markdown actions"
            @click="toggle"
        >
            <component :is="triggerIcon" class="action-icon" />
            <span class="action-text">{{ triggerLabel }}</span>
            <ChevronDown class="chevron-icon" />
        </button>

        <ul class="markdown-actions-menu" v-show="open">
            <li v-for="action in visibleActions" :key="action.id">
                <button
                    class="markdown-actions-item"
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
    import { computed, useTemplateRef } from "vue"
    import ContentCopy from "vue-material-design-icons/ContentCopy.vue"
    import Check from "vue-material-design-icons/Check.vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline.vue"
    import OpenInNew from "vue-material-design-icons/OpenInNew.vue"
    import Github from "vue-material-design-icons/Github.vue"
    import { useMarkdownActions } from "~/composables/useMarkdownActions"
    import { useDropdown } from "~/composables/useDropdown"
    import type { MarkdownActionDefinition, MarkdownActionId } from "~/utils/markdown-actions"

    const props = withDefaults(
        defineProps<{
            markdownBody?: string
            pagePath: string
            pageTitle?: string
            pageUrl?: string
            editUrl?: string
            stem?: string
            extension?: string
            /** Action ids to omit from the menu (e.g. "edit" when there's no repo file to link to). */
            excludeActions?: MarkdownActionId[]
            /** Fetch the markdown on copy instead of passing it in `markdownBody`. */
            lazyMarkdown?: boolean
        }>(),
        { markdownBody: "" },
    )

    const context = computed(() => ({
        markdownBody: props.markdownBody,
        lazyMarkdown: props.lazyMarkdown,
        pagePath: props.pagePath,
        pageTitle: props.pageTitle,
        pageUrl: props.pageUrl,
        editUrl: props.editUrl,
        stem: props.stem,
        extension: props.extension,
    }))

    const { actions, copied, executeAction } = useMarkdownActions(context)

    const visibleActions = computed(() =>
        props.excludeActions?.length
            ? actions.filter((action) => !props.excludeActions!.includes(action.id))
            : actions,
    )

    const actionIcons: Record<MarkdownActionId, typeof ContentCopy> = {
        edit: Github,
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

    const root = useTemplateRef<HTMLElement>("root")
    const { open, close, toggle } = useDropdown(root)

    const handleAction = async (actionId: MarkdownActionId) => {
        await executeAction(actionId)
        close()
    }
</script>

<style lang="scss" scoped>
    .markdown-actions {
        display: flex;
        position: relative;
        padding: 1.25rem 0;
        @include media-breakpoint-up(lg) {
            padding: 1.25rem;
        }
    }

    .markdown-actions-trigger {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.75rem;
        border: $block-border;
        border-color: var(--ks-border-primary);
        border-radius: 0.25rem;
        background-color: var(--ks-background-input);
        color: var(--ks-content-primary);
        font-size: 0.875rem;
        font-weight: normal;
        cursor: pointer;
        transition: border-color 0.2s ease;

        &:hover {
            border-color: var(--ks-border-active);
            background-color: var(--ks-background-input);
            color: var(--ks-content-primary);
        }

        &:focus {
            border-color: var(--ks-border-active);
            box-shadow: 0 0 0 0.25rem rgba(var(--ks-border-active), 0.25);
            background-color: var(--ks-background-input);
            color: var(--ks-content-primary);
            outline: none;
        }

        &::after {
            display: none;
        }

        .action-text {
            flex-shrink: 0;
            text-align: left;
            flex: 1;
            font-size: 12px;
        }
    }

    .markdown-actions.open .markdown-actions-trigger {
        color: var(--ks-content-link);
    }

    .markdown-actions-menu {
        position: absolute;
        inset-block-start: calc(100% - 1.25rem);
        inset-inline-end: 0;
        z-index: 1000;
        margin-block-start: 0.125rem;
        list-style: none;
        background-color: var(--ks-background-input);
        border: $block-border;
        border-radius: 0.25rem;
        padding: 0;
        min-width: 12rem;
    }

    .markdown-actions-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.25rem 0.75rem;
        border: 0;
        background: transparent;
        color: var(--ks-content-primary);
        font-size: 12px;
        text-align: left;
        transition: background-color 0.2s ease;

        &:hover,
        &:focus {
            background-color: rgba(255, 255, 255, 0.1);
            color: var(--ks-content-primary);
        }

        html.light & {
            &:hover,
            &:focus {
                background-color: rgba(0, 0, 0, 0.05);
            }
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
        margin-left: auto;

        :deep(svg) {
            font-size: 20px;
            transition: transform 0.2s ease;
        }
    }

    .markdown-actions.open .chevron-icon :deep(svg) {
        transform: rotate(180deg);
    }

</style>
