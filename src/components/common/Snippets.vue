<template>
    <div
        v-if="code"
        :class="[
            'code-card',
            { 'is-expandable': isExpandable, 'is-expanded': isExpanded },
        ]"
    >
        <div class="code-inner">
            <div class="code-container">
                <!-- When the parent already parsed the snippet (SnippetsSSR
                     does it server-side), render it directly; otherwise fall
                     back to the client-side markdown renderer. -->
                <div v-if="html" class="markdown-renderer" v-html="html" />
                <MarkdownRenderer v-else :content="markdownCode" />
            </div>
            <Copy :code="props.code" class="snippet-copy" />
        </div>

        <button
            v-if="isExpandable"
            class="expand-trigger"
            @click="toggleExpand"
        >
            <DotsHorizontal v-if="!isExpanded" class="icon" />
            <span class="text">{{ expandText }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from "vue"
    import Copy from "~/components/common/Copy.vue"
    import MarkdownRenderer from "~/components/MarkdownRenderer.vue"
    import DotsHorizontal from "vue-material-design-icons/DotsHorizontal.vue"

    interface Props {
        code: string
        lang?: string
        expandThreshold?: number
        /** Pre-rendered snippet HTML (from SnippetsSSR); skips client parsing. */
        html?: string
    }

    const props = withDefaults(defineProps<Props>(), {
        lang: "bash",
        expandThreshold: 12,
        html: undefined,
    })

    const isExpanded = ref(false)

    const lineCount = computed(() =>
        props.code ? props.code.trim().split("\n").length : 0,
    )
    const isExpandable = computed(() => lineCount.value > props.expandThreshold)

    const markdownCode = computed(() => {
        return `\`\`\`${props.lang}\n${props.code}\n\`\`\``
    })

    const expandText = computed(() => {
        return isExpanded.value
            ? "See less"
            : `See all ${lineCount.value} lines`
    })

    const toggleExpand = () => {
        isExpanded.value = !isExpanded.value
    }
</script>

<style lang="scss" scoped>
    @use "/src/assets/styles/markdown-renderer" as markdown;

    // The v-html branch renders the .markdown-renderer div itself, so it needs the
    // same base styles the MarkdownRenderer component ships with.
    .markdown-renderer {
        @include markdown.markdown-renderer;
    }

    .code-card {
        position: relative;
        border: 1px solid var(--ks-border-primary);
        background: var(--ks-background-primary);
        overflow: hidden;
        border-radius: 8px;
        display: flex;
        flex-direction: column;

        .snippet-copy {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            z-index: 10;
        }

        .code-inner {
            position: relative;
            flex: 1;
            min-height: 0;

            .code-container {
                display: block;
            }

            :deep(.markdown-renderer) {
                margin-bottom: 0;

                pre {
                    background: var(--ks-background-primary) !important;
                    margin: 0;
                    overflow: hidden !important;
                    border: none;
                }

                code {
                    font-size: $font-size-sm;
                    line-height: 1.6;
                }
            }
        }

        &.is-expandable {
            .code-inner {
                max-height: 350px;
                mask-image: linear-gradient(
                    to bottom,
                    var(--ks-background-primary) 70%,
                    transparent 100%
                );
            }
        }

        &.is-expanded {
            .code-inner {
                max-height: none;
                mask-image: none;
            }
        }

        .expand-trigger {
            width: 100%;
            padding: 0.5rem 0.75rem;
            background: var(--ks-background-tertiary);
            border: none;
            border-top: $block-border;
            color: var(--ks-content-primary);
            font-size: $font-size-xs;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: start;
            gap: 0.5rem;
            transition: all 0.2s;

            &:hover {
                background: var(--ks-background-primary);
            }

            .text {
                color: var(--ks-content-secondary);
            }

            .icon {
                color: var(--ks-content-tertiary);
                font-size: 1.25rem;
            }
        }
    }
</style>
