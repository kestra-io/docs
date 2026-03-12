<template>
    <div v-if="code" :class="['code-card', { 'is-expandable': isExpandable, 'is-expanded': isExpanded }]">
        <div class="code-inner">
            <div class="code-container">
                <MDCParserAndRenderer :content="markdownCode" />
            </div>
            <Copy :code="props.code" class="snippet-copy" />
        </div>

        <button v-if="isExpandable" class="expand-trigger" @click="toggleExpand">
            <DotsHorizontal v-if="!isExpanded" class="icon" />
            <span class="text">{{ expandText }}</span>
        </button>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from "vue"
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"
    import DotsHorizontal from "vue-material-design-icons/DotsHorizontal.vue"
    import Copy from "~/components/common/Copy.vue"

    interface Props {
        code: string
        lang?: string
        expandThreshold?: number
    }

    const props = withDefaults(defineProps<Props>(), {
        lang: "bash",
        expandThreshold: 12,
    })

    const isExpanded = ref(false)

    const lineCount = computed(() => (props.code ? props.code.trim().split("\n").length : 0))
    const isExpandable = computed(() => lineCount.value > props.expandThreshold)

    const markdownCode = computed(() => {
        return `\`\`\`${props.lang}\n${props.code}\n\`\`\``
    })

    const expandText = computed(() => {
        return isExpanded.value ? "See less" : `See all ${lineCount.value} lines`
    })

    const toggleExpand = () => {
        isExpanded.value = !isExpanded.value
    }
</script>

<style lang="scss" scoped>


    .code-card {
        position: relative;
        border: 1px solid var(--ks-border-primary);
        background: var(--ks-background-primary);
        overflow: hidden;
        border-radius: 8px;

        .snippet-copy {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            z-index: 10;
        }

        .code-inner {
            position: relative;

            .code-container {
                display: block;
            }

            :deep(.mdc-renderer) {
                margin-bottom: 0;

                :deep(pre) {
                    background: var(--ks-background-primary) !important;
                    margin: 0;
                    overflow: hidden !important;
                    border: none;
                }

                :deep(code) {
                    font-size: $font-size-sm;
                    line-height: 1.6;
                }
            }
        }

        &.is-expandable {
            .code-inner {
                max-height: 350px;
                mask-image: linear-gradient(to bottom, var(--ks-background-primary) 70%, transparent 100%);
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
            background: var(--ks-background-secondary);
            border: none;
            border-top: 1px solid var(--ks-border-primary);
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
                background: var(--ks-background-tertiary);
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
