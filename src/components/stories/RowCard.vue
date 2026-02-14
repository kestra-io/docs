<template>
    <a :href="`/use-cases/stories/${story.id}-${slugify(story.title ?? '--')}`">
        <div class="card" data-usal="fade-r">
            <div class="card-body p-0 d-flex flex-column justify-content-between">
                <div class="d-flex align-items-center card-body-container">
                    <div class="d-flex flex-column align-items-start gap-2 p-4">
                        <img height="56" :src="story.logo" :alt="story.title" class="logo logo-dark mb-2" />
                        <img height="56" :src="story.logoDark" :alt="story.title" class="logo logo-light mb-2" />
                        <h4 class="mb-0">{{ story.title }}</h4>
                        <p class="mb-0">{{ story.quote }}</p>
                        <small class="mb-0">{{ story.quotePerson }}</small>
                        <div class="card-stories-info">
                            <div class="info-item" v-if="story.kpi1">
                                <img src="/stories/icons/multiple-checkbox.svg" alt="right icons" />
                                <MDCParserAndRenderer :content="story.kpi1" class="item-content" />
                            </div>
                            <div class="info-item" v-if="story.kpi2">
                                <img src="/stories/icons/multiple-checkbox.svg" alt="right icons" />
                                <MDCParserAndRenderer :content="story.kpi2" class="item-content" />
                            </div>
                            <div class="info-item" v-if="story.kpi3">
                                <img src="/stories/icons/multiple-checkbox.svg" alt="right icons" />
                                <MDCParserAndRenderer :content="story.kpi3" class="item-content" />
                            </div>
                        </div>
                        <span class="author">
                            Read the story
                            <img src="/stories/icons/arrow_right_alt.svg" alt="right icons" />
                        </span>
                    </div>
                    <img
                        width="610px"
                        height="375px"
                        :src="story.featuredImage"
                        :alt="`${story.title} image`"
                        class="card-img-top"
                    />
                </div>
            </div>
        </div>
    </a>
</template>

<script setup lang="ts">
    import { slugify } from "@kestra-io/ui-libs"
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"

    defineProps<{ story: Story }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .card {
        height: 100%;
        border-radius: $border-radius-lg;
        background-color: var(--ks-background-secondary);
        .card-body {
            &-container {
                gap: calc($spacer * 1.875);
                @include media-breakpoint-down(xl) {
                    flex-direction: column !important;
                }
                .logo-light {
                    display: none;
                }
                html.light & {
                    .logo-light {
                        display: block;
                    }
                    .logo-dark {
                        display: none;
                    }
                }
            }
            .card-img-top {
                max-width: 610px;
                border-radius: 0 $border-radius-lg $border-radius-lg 0;
                @include media-breakpoint-down(xl) {
                    height: auto;
                    max-width: 100%;
                }
            }
            h4, p {
                color: var(--ks-content-primary);
            }
            small {
                color: var(--ks-content-tertiary);
                font-weight: 500;
            }
            p {
                font-size: $font-size-sm;
            }
            .author {
                font-size: $font-size-xs;
                color: var(--ks-content-link);
                margin-top: $rem-1;
            }
            .icon {
                border-radius: 4px;
                border: 1px solid var(--ks-border-secondary);
                padding: 0.25rem 0.5rem;
                width: 44px;
            }
        }
        &-stories-info {
            display: flex;
            flex-direction: column;
            margin-top: 0.5rem;
            .info-item {
                display: flex;
                gap: 0.25rem;
                align-items: center;
                .item-content {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    :deep(h5),
                    :deep(p) {
                        padding: 0;
                        margin: 0;
                        font-weight: 500;
                        line-height: calc($spacer * 1.375);
                        font-size: $font-size-sm;
                        color: var(--ks-content-primary);
                    }
                }
            }
        }
    }
</style>