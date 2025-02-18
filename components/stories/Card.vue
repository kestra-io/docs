<template>
    <NuxtLink :href="`/use-cases/stories/${story.id}-${slugify(story.title)}`">
        <div class="card" data-aos="fade-right">
            <div class="card-body p-0 d-flex flex-column justify-content-between ">
                <div>
                    <img
                        loading="lazy"
                        :src="story.featuredImage"
                        :alt="`${story.title} image`"
                        class="card-img-top"
                    />
                    <p class="card-title mt-3 mb-2">{{ story.title }}</p>
                    <p class="card-meta-description">{{ story.description }}</p>
                    <div class="d-flex flex-wrap gap-3 my-3 story-tasks">
                        <div class="icon bg-dark-4" v-for="task in story.tasks" :key="task">
                            <CommonTaskIcon :cls="task" />
                        </div>
                    </div>
                </div>
                <span class="author">
                      Read the story <img src="/stories/icons/arrow_right_alt.svg" alt="right icons" />
                  </span>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup>
    import {slugify} from "~/utils/url";

    defineProps({
        story: {
            type: Object,
            required: true,
        }
    });
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .card {
        height: 100%;
        border-radius: 8px;
        background-color: transparent;
        .card-body {

            .card-img-top {
                border-radius: 4px;
                border: 1px solid #404559;
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
            color: #CDD5EF;
            font-family: $font-family-monospace;
            font-size: $font-size-md;
            font-weight: 400;
            line-height: calc($spacer * 1.75);
            text-transform: uppercase;
        }

        &-meta-description {
            color: $white;
            font-family: $font-family-sans-serif;
            font-size: $h6-font-size;
            font-weight: 400;
            line-height: calc($spacer * 1.625);
        }
    }
</style>