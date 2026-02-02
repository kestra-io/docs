<template>
    <a :href="`/use-cases/stories/${story.id}-${slugify(story.title ?? '--')}`">
        <div class="card" data-usal="fade-r">
            <div class="card-body p-0 d-flex flex-column justify-content-between">
                <div class="d-flex align-items-center card-body-container">
                    <div>
                        <img height="56" :src="story.logo" :alt="story.logo" />
                        <p class="card-title mt-3 mb-2">{{ story.title }}</p>
                        <p class="card-meta-description">{{ story.quote }}</p>
                        <p class="card-meta-quote">{{ story.quotePerson }}</p>
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

    const props = defineProps<{
        story: Story
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .card {
        height: 100%;
        border-radius: 8px;
        background-color: transparent;
        .card-body {
            &-container {
                gap: calc($spacer * 1.875);
                @include media-breakpoint-down(lg) {
                    flex-direction: column !important;
                }
            }

            .card-img-top {
                max-width: 610px;
                max-height: 375px;
                border-radius: 4px;
                border: 1px solid #404559;
                @include media-breakpoint-down(lg) {
                    height: auto;
                }
            }

            .author {
                font-size: $font-size-sm;
                color: $purple-36;
                margin-bottom: 0;
                font-weight: 400;
            }

            .icon {
                border-radius: 4px;
                border: 1px solid $black-6;
                padding: 0.313rem 0.625rem;
                width: 44px;
            }
        }

        &-title {
            color: $white;
            font-size: $h3-font-size;
            font-weight: 600;
            line-height: calc($spacer * 3);

            @include media-breakpoint-down(lg) {
                font-size: $font-size-xl;
                line-height: calc($spacer * 1.8);
            }
        }

        &-meta-description {
            color: $white-1;
            font-size: $font-size-sm;
            font-weight: 400;
            line-height: calc($spacer * 1.5);
            font-style: italic;
        }

        &-meta-quote {
            color: $white-1;
            font-weight: 500;
            font-size: $font-size-sm;
            line-height: calc($spacer * 1.375);
        }

        &-stories-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            margin-bottom: 20px;

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
                        color: $white;
                    }
                }
            }
        }
    }
</style>