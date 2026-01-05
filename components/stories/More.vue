<template>
    <div class="more-wrap">
        <div class="container">
            <div class="more-content">
                <LayoutSection subtitle-before="Similar" subtitle="Kestra" subtitle-after="Stories" v-if="related">
                    <div class="row">
                        <div class="col-12 col-md-6 col-lg-4 mb-4 d-flex align-items-stretch"
                            v-for="(relatedStory, index) in related.results" :key="index">
                            <NuxtLink :href="`/use-cases/stories/${relatedStory.id}-${slugify(relatedStory.title)}`"
                                class="text-decoration-none w-100">
                                <div class="card story-card h-100">
                                    <div class="card-body p-3 d-flex flex-column">
                                        <img loading="lazy" :src="relatedStory.featuredImage" :alt="relatedStory.title"
                                            class="card-img-top" />

                                        <p class="card-title mt-3 mb-2">{{ relatedStory.title }}</p>

                                        <div class="d-flex flex-wrap gap-2 my-3">
                                            <div class="icon-box" v-for="task in relatedStory.tasks.slice(0, 4)"
                                                :key="task">
                                                <CommonTaskIcon :cls="task" />
                                            </div>
                                        </div>

                                        <span class="author mt-auto">
                                            Read the story >
                                        </span>
                                    </div>
                                </div>
                            </NuxtLink>
                        </div>
                    </div>
                </LayoutSection>

                <div class="all-ctn">
                    <NuxtLink href="/use-cases/stories" class="all-lnk">
                        See all stories >
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { slugify } from "@kestra-io/ui-libs";

    const props = defineProps<{
        related: any;
    }>();
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .more-wrap {
        background-color: #F4F4F4;
        width: 100vw;
        margin-left: calc(-50vw + 50%);
        margin-top: 0;
        padding: 2rem 0;
        position: relative;
        overflow: hidden;

        &::before {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background-image: url("/stories/square.svg");
            background-repeat: repeat;
        }

        > .container {
            position: relative;
            z-index: 1;
        }
    }

    .more-content {
        :deep(.subtitle > p), :deep(h2), :deep(.main-title) {
            color: #101828 !important;
            text-align: center;
            font-family: "Mona Sans", sans-serif;
            font-size: 32px !important;
            font-weight: 700;
            line-height: 48px;
            background: none !important;
            -webkit-text-fill-color: initial !important;

            span {
                color: #101828 !important;
                background: none !important;
                -webkit-text-fill-color: initial !important;
            }
        }

        .story-card {
            background-color: #FFFFFF !important;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;

            .card-body {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            .card-img-top {
                width: 100%;
                height: 232.19px !important;
                align-self: stretch;
                aspect-ratio: 337.33/232.19;
                object-fit: cover;
                border-radius: 8px;
                background-color: lightgray;
                border: 1px solid #E5E5E5;
            }

            .card-title {
                color: #101828 !important;
                font-family: "Public Sans", sans-serif;
                font-size: 16px;
                font-weight: 700;
                text-align: left;
            }

            .icon-box {
                width: 44px;
                height: 44px;
                border-radius: 4px;
                border: 1px solid #E5E5E5;
                padding: 6px;
                display: flex;
                align-items: center;
                justify-content: center;

                :deep(img), :deep(svg) {
                    max-width: 100%;
                    max-height: 100%;
                }
            }

            .author {
                display: flex !important;
                width: 100%;
                justify-content: flex-end;
                align-items: center;
                gap: 5px;
                margin-top: auto;

                color: #000 !important;
                text-shadow: 0 7.333px 15.333px rgba(255, 255, 255, 0.13);
                font-family: "Public Sans", sans-serif;
                font-size: 16px;
                font-weight: 700;
                line-height: 24px;
            }
        }
    }

    .all-ctn {
        display: flex;
        justify-content: flex-end;
        margin-top: 1.5rem;
    }

    .all-lnk {
        color: $black-2;
        font-weight: 600;
        text-decoration: none;
        font-family: "Public Sans", sans-serif;

        &:hover {
            text-decoration: underline;
        }
    }
</style>