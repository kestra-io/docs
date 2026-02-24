<template>
    <section>
        <div class="container">
            <div class="row">
                <div class="col-md-10">
                    <h2>Source</h2>
                    <div class="mb-5">
                        <Snippets :code="flow" lang="yaml" />
                    </div>
                    <h4>About this blueprint</h4>
                    <div v-if="tagsList.length > 0" class="tags-list">
                        <span v-for="tag in tagsList" :key="tag" class="tag">{{ tag }}</span>
                    </div>
                    <div class="bd-markdown">
                        <MDCParserAndRenderer :content="description" />
                    </div>
                </div>
                <div v-if="page.includedTasks && page.includedTasks.length > 0" class="col-md-2">
                    <div class="plugins-container">
                        <div v-for="icon in page.includedTasks" :key="icon" class="plugin-icon">
                            <div class="icon-wrapper">
                                <div
                                    class="icon"
                                    :style="{ backgroundImage: `url('/icons/${icon}.svg')` }"
                                />
                            </div>
                            <p>{{ getLastWord(icon) }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import Snippets from "~/components/common/Snippets.vue"
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"

    interface Props {
        page: {
            tags?: string[]
            includedTasks?: string[]
        }
        description: string
        flow: string
        tags?: any[]
    }

    const props = withDefaults(defineProps<Props>(), {
        tags: () => [],
    })

    const pageTags = computed(() => props.page.tags || [])
    const tagsList = computed(() => {
        return props.tags && Array.isArray(props.tags)
            ? props.tags.filter((t) => t && pageTags.value.includes(t.id)).map((t) => t.name)
            : []
    })

    const getLastWord = (value: string) => {
        return (
            value
                ?.split(".")
                .pop()
                ?.replace(/([a-z])([A-Z])/g, "$1 $2") ?? ""
        )
    }
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    section {
        padding: $rem-3 $rem-1;
    }

    h2,
    h4,
    p {
        color: var(--ks-content-primary);
    }

    .bd-markdown {
        :deep(pre) {
            border: $block-border;
            padding: $rem-1;
            border-radius: $border-radius-lg;
            background-color: var(--ks-background-secondary);
        }
    }

    .tags-list {
        margin: 0 auto $spacer;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        .tag {
            background: var(--ks-backgroung-tag-category);
            color: var(--ks-content-tag-category);
            padding: 0.125rem 0.5rem;
            border-radius: 4px;
            font-size: $font-size-sm;
            font-weight: 600;
            text-transform: uppercase;
        }
    }

    .plugins-container {
        border-radius: 0.5rem;
        border: $block-border;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .plugin-icon {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            align-items: center;
            justify-content: center;
            padding: $spacer 0.5rem;
            background: var(--ks-background-tertiary);
            border-top: 1px solid var(--ks-border-secondary);

            &:first-child {
                border-top: none;
            }

            .icon-wrapper {
                width: 2.5rem;
                height: 2.5rem;

                .icon {
                    width: 100%;
                    height: 100%;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                }
            }

            p {
                margin: 0;
                font-size: $font-size-sm;
                font-weight: 700;
                text-align: center;
            }
        }
    }
</style>
