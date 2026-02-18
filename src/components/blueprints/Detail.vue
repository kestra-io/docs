<template>
    <section>
        <div class="container text-body">
            <div class="row">
                <div class="col-md-10">
                    <h2>Source</h2>
                    <div class="code mb-3 main-code-block" :class="{ hide: hideCode }">
                        <MDCParserAndRenderer class="bd-markdown" :content="flow" />
                        <div class="show-more" :class="{ hide: !hideCode }">
                            <a href="#" @click.prevent="hideCode = !hideCode">
                                {{ hideCode ? "See more" : "See less" }}
                                <component :is="hideCode ? ChevronDown : ChevronUp" />
                            </a>
                        </div>
                    </div>
                    <h4>About this blueprint</h4>
                    <div class="title" v-if="tagsList && tagsList.length">
                        <p v-for="tag in tagsList" :key="tag">{{ tag }}</p>
                    </div>
                    <MDCParserAndRenderer class="bd-markdown" :content="description" />
                </div>
                <div class="col-md-2" v-if="page.includedTasks?.length">
                    <div class="plugins-icons">
                        <div class="plugins-container">
                            <div v-for="icon in page.includedTasks" :key="icon" class="plugin-icon">
                                <CommonTaskIcon :cls="icon" />
                                <p class="text-center">{{ getLastWord(icon) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref, computed } from "vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue"
    import CommonTaskIcon from "~/components/common/TaskIcon.vue"
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"

    const props = withDefaults(defineProps<{
        page: {
            tags?: string[]
            includedTasks?: string[]
        }
        description: any
        flow: string
        tags?: any[]
    }>(), {
        tags: () => []
    })

    const hideCode = ref(true)

    const tagsList = computed(() => {
        if (props.tags && props.page.tags) {
            const pageTags = props.page.tags;
            return props.tags
                .filter((t) => pageTags.includes(t.id))
                .map((t) => t.name)
        }
        return []
    })

    const getLastWord = (value: string) => {
        if (!value) return ""
        return value.split(".").pop()?.replace(/([a-z])([A-Z])/g, "$1 $2") || ""
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    section {
        padding: $rem-3 $rem-1;
    }

    .code {
        overflow: hidden;
        position: relative;
        border: $block-border;
        border-radius: $border-radius-lg;
        transition: max-height 0.5s ease;
        &.hide {
            max-height: 258px;
        }
        :deep(.code-block) {
            padding-bottom: 50px;
            margin-bottom: 0 !important;
        }
        .show-more {
            position: absolute;
            bottom: 0;
            left: 1px;
            right: 1px;
            display: flex;
            justify-content: center;
            padding: 56px 0 10px;
            border-bottom-left-radius: 13px;
            border-bottom-right-radius: 13px;
            background: linear-gradient(transparent, var(--ks-background-secondary));
            a {
                color: var(--ks-content-primary);
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }
        }
    }

    h2, h4 {
        color: var(--ks-content-primary);
    }

    .title {
        margin: 0 auto calc($spacer / 2);
        p {
            background: var(--ks-backgroung-tag-category);
            color: var(--ks-content-tag-category);
            padding: 0.125rem 0.5rem;
            border-radius: 4px;
            font-size: $font-size-sm;
            font-weight: 600;
            text-transform: uppercase;
            display: inline;
            margin-right: 0.5rem;
            &:last-child {
                margin-right: 0;
            }
        }
    }

    .plugins-container {
        border-radius: 0.5rem;
        border: $block-border;
        display: flex;
        flex-direction: column;
        overflow: clip;
        .plugin-icon {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            align-items: center;
            justify-content: center;
            min-width: 134px;
            border-radius: 0;
            border-top: 1px solid var(--ks-border-secondary);
            padding: calc($spacer * 1.063) 0 calc($spacer * 0.75);
            background: var(--ks-background-tertiary);
            &:first-child {
                border-top: none;
            }
            :deep(.icon-wrapper) {
                width: calc($spacer * 2.625);
                height: calc($spacer * 2.625);
            }
            p {
                margin: 0;
                font-size: calc($font-size-base * 0.875);
                font-weight: 700;
                color: var(--ks-content-primary);
            }
        }
    }
</style>