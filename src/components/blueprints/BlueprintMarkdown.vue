<template>
    <section class="markdown">
        <div class="container-xxl">
            <div class="bd-markdown">
                <MDCParserAndRenderer :content="description" />
            </div>
            <div class="side-panel">
                <div class="item">
                    <h6>Tasks</h6>
                    <div v-if="page.includedTasks?.length" class="tasks">
                        <a
                            v-for="icon in page.includedTasks"
                            :key="icon"
                            :href="'/plugins/' + icon"
                            class="task"
                        >
                            <div class="box">
                                <TaskIcon :cls="icon" />
                            </div>
                            <span class="task-label">
                                {{ getLastWord(icon) }}
                            </span>
                        </a>
                    </div>
                </div>
                <Share
                    :title="page.title"
                    :url="pageUrl"
                    title-text="Share this Blueprint"
                />
                <div class="item">
                    <h6 class="mb-0">Create a Blueprint</h6>
                    <a
                        href="/docs/plugin-developer-guide"
                        external
                        target="_blank"
                        class="link"
                    >
                        Go to the developer platform
                        <OpenInNew class="ms-1" />
                    </a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"
    import TaskIcon from "~/components/common/TaskIcon.vue"
    import Share from "~/components/common/Share.vue"
    import OpenInNew from "vue-material-design-icons/OpenInNew.vue"

    defineProps<{
        page: { title: string; includedTasks?: string[] }
        description: string
    }>()

    const getLastWord = (value: string) =>
        value
            ?.split(".")
            .pop()
            ?.replace(/([a-z])([A-Z])/g, "$1 $2") ?? ""

    const pageUrl = computed(() =>
        typeof window !== "undefined" ? window.location.href : "",
    )
</script>

<style lang="scss" scoped>


    .markdown {
        padding: 0 $rem-1;
        background-color: var(--ks-background-primary);
        border-top: $block-border;
        border-bottom: $block-border;

        .container-xxl {
            display: flex;

            @include media-breakpoint-down(xl) {
                flex-direction: column-reverse;
                padding: 0;
            }
        }

        .bd-markdown {
            flex: 1;
            padding: $rem-2;

            @include media-breakpoint-down(sm) {
                padding: $rem-2 $rem-1;
            }

            @include media-breakpoint-up(xl) {
                padding: $rem-4;
            }

            border-right: $block-border;
            border-left: $block-border;

            :deep(pre) {
                border: $block-border;
                padding: $rem-1;
                border-radius: $border-radius-lg;
                background-color: var(--ks-background-secondary);
            }
        }

        .side-panel {
            min-width: 294px;
            min-height: fit-content;
            gap: 1rem;
            display: flex;
            flex-direction: column;
            padding-top: 4rem;
            border-right: $block-border;

            @include media-breakpoint-down(xl) {
                border-left: $block-border;
                padding-top: $rem-2;
            }

            :deep(.section) {
                padding: 0 2rem 1.5rem 2rem;
                border-bottom: $block-border;
            }

            .item {
                width: 100%;
                height: fit-content;
                gap: 0.5rem;
                border-bottom: $block-border;
                padding: 0 2rem 1.5rem 2rem;
                display: flex;
                flex-direction: column;

                .tasks {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.5rem;

                    .task {
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        text-decoration: none;
                        color: inherit;
                        transition: all 0.2s ease;

                        &:hover {
                            .box {
                                border-color: var(--ks-border-active);
                                background-color: #f1efff;
                            }
                        }

                        .box {
                            width: 2.5rem;
                            height: 2.5rem;
                            padding: 0.3125rem;
                            border-radius: 0.5rem;
                            border: $block-border;
                            background-color: $white;
                        }

                        .task-label {
                            font-size: $font-size-sm;
                            font-weight: 500;
                            color: var(--ks-content-link);
                            transition: color 0.2s ease;
                        }
                    }
                }

                .link {
                    color: var(--ks-content-link);
                    text-decoration: none;
                    font-size: $font-size-xs;

                    &:hover {
                        text-decoration: underline;
                    }
                }
            }
        }
    }
</style>
