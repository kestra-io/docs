<template>
    <div class="container-fluid bg-dark-4">
        <div class="container">
            <div class="title-block mb-3">
                <NuxtImg
                    width="100px"
                    loading="lazy"
                    format="webp"
                    class="mt-md-0"
                    data-usal="zoomin"
                    :src="logoPath"
                    :alt="logoAlt"
                />
                <p class="title" v-if="title">
                    Unlock the <span>Potential</span> of Your <br />{{ title }}
                </p>
                <p class="description">
                    {{ description }}
                </p>
            </div>
            <div class="row d-flex justify-content-center mt-5">
                <!-- Desktop / laptop view: original 3-column layout with SVG line -->
                <div class="d-none d-lg-flex w-100">
                    <div class="col-5 mb-4 z-2" data-usal="zoomin">
                        <div class="unlock-content text-end">
                            <template v-for="info in unlockContent.leftContent" :key="info.title">
                                <p class="content-title">{{ info.title }}</p>
                                <p class="content-description">
                                    {{ info.description }}
                                </p>
                            </template>
                        </div>
                    </div>
                    <div
                        class="col-2 mb-4 z-2 d-flex justify-content-center"
                        data-usal="zoomin"
                    >
                        <UnlockSectionLine :strokeColor="strokeColor" />
                    </div>
                    <div class="col-5 mb-4 z-2" data-usal="zoomin">
                        <div class="unlock-content text-start">
                            <template v-for="info in unlockContent.rightContent" :key="info.title">
                                <p class="content-description">
                                    {{ info.description }}
                                </p>
                                <p class="content-title">{{ info.title }}</p>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Tablet & mobile view: timeline rows aligned to pointers -->
                <div class="d-flex d-lg-none w-100">
                    <div class="col-12 mb-4 z-2" data-usal="zoomin">
                        <div class="unlock-timeline">
                            <div
                                v-for="(row, idx) in timelineRows"
                                :key="idx"
                                class="timeline-row"
                            >
                                <div class="timeline-side timeline-left text-end">
                                    <p v-if="row.leftTitle" class="content-title">
                                        {{ row.leftTitle }}
                                    </p>
                                    <p
                                        v-if="row.leftDescription"
                                        class="content-description"
                                    >
                                        {{ row.leftDescription }}
                                    </p>
                                </div>

                                <div class="timeline-middle">
                                    <span class="timeline-dot" />
                                </div>

                                <div class="timeline-side timeline-right text-start">
                                    <p v-if="row.rightTitle" class="content-title">
                                        {{ row.rightTitle }}
                                    </p>
                                    <p
                                        v-if="row.rightDescription"
                                        class="content-description"
                                    >
                                        {{ row.rightDescription }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from "vue"
    import UnlockSectionLine from "~/components/use-cases/UnlockSectionLine.vue"

    const props = defineProps<{
        title?: string
        description: string
        logoPath: string
        logoAlt: string
        strokeColor: string
        unlockContent: any
    }>()

    // Build 4 pointer rows with the exact mapping you described
    const timelineRows = computed(() => {
        const left = props.unlockContent?.leftContent ?? []
        const right = props.unlockContent?.rightContent ?? []

        // Fallback: simple pairing if the expected structure is not there
        if (left.length < 2 || right.length < 2) {
            return left.map((l, idx) => ({
                leftTitle: l.title,
                leftDescription: l.description,
                rightTitle: right[idx]?.title,
                rightDescription: right[idx]?.description,
            }))
        }

        return [
            {
                // 1st pointer
                leftTitle: left[0].title,
                rightDescription: right[0].description,
            },
            {
                // 2nd pointer
                leftDescription: left[0].description,
                rightTitle: right[0].title,
            },
            {
                // 3rd pointer
                leftTitle: left[1].title,
                rightDescription: right[1].description,
            },
            {
                // 4th pointer
                leftDescription: left[1].description,
                rightTitle: right[1].title,
            },
        ]
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .container-fluid {
        text-align: center;
        color: $white;
        font-family: $font-family-sans-serif;
        font-weight: 300;

        .container {
            padding-top: calc($spacer * 5.625);
            padding-bottom: calc($spacer * 5.625);

            .title-block {
                display: flex;
                flex-direction: column;
                align-items: center;
                position: relative;
                z-index: 3;

                .title {
                    font-size: 3.125rem;
                    margin-bottom: $rem-1;
                    font-weight: 500;
                    line-height: 3.438rem;

                    span {
                        background: linear-gradient(90deg, #e151f7 65.38%, #5c47f5 82.43%);
                        background-clip: text;
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    @include media-breakpoint-down(sm) {
                        font-size: 1.875rem !important;
                        line-height: calc($spacer * 1.875);
                    }
                }

                .description {
                    font-size: $h6-font-size;
                    font-weight: 400;
                    line-height: 1.625rem;
                    text-align: center;
                    color: $white;
                    max-width: 54%;

                    @include media-breakpoint-down(lg) {
                        font-size: $font-size-sm;
                        line-height: 1rem;
                        max-width: unset;
                    }
                }
            }

            .unlock-content {
                display: flex;
                flex-direction: column;
                gap: 8rem;
                padding-top: calc($spacer * 5);

                @include media-breakpoint-down(lg) {
                    gap: calc($spacer * 2);
                    padding-top: calc($spacer * 2);
                }

                .content-title {
                    font-family: $font-family-sans-serif;
                    font-size: $h2-font-size;
                    font-weight: 500;
                    line-height: 50px;
                    margin: 0;
                    @include media-breakpoint-down(lg) {
                        font-size: $font-size-base !important;
                        line-height: $spacer;
                    }
                }

                .content-description {
                    font-family: $font-family-sans-serif;
                    font-size: $h6-font-size;
                    font-weight: 500;
                    line-height: 1.75rem;
                    color: $white-1;
                    margin: 0;
                    @include media-breakpoint-down(lg) {
                        font-size: $font-size-xs;
                        line-height: 1rem;
                        max-width: unset;
                    }
                }
            }

            .unlock-timeline {
                position: relative;
                padding-top: calc($spacer * 5);

                @include media-breakpoint-down(lg) {
                    padding-top: calc($spacer * 2);
                }

                // Single dashed line for all pointers
                &::before {
                    content: "";
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    top: 0;
                    bottom: 0;
                    width: 0;
                    border-left: 2px dashed v-bind(strokeColor);
                    opacity: 0.9;
                    pointer-events: none;
                }
            }

            .timeline-row {
                display: grid;
                grid-template-columns: 1fr 60px 1fr;
                column-gap: calc($spacer * 1.5);
                align-items: center;

                & + & {
                    margin-top: calc($spacer * 4);
                }

                @include media-breakpoint-down(lg) {
                    grid-template-columns: 1fr 48px 1fr;

                    & + & {
                        margin-top: calc($spacer * 6s);
                    }
                }
            }

            .timeline-side {
                display: flex;
                flex-direction: column;
                gap: $spacer;

                // Add a bit of horizontal padding between text and pointer
                @include media-breakpoint-down(lg) {
                    &.timeline-left {
                        padding-right: $spacer;
                    }

                    &.timeline-right {
                        padding-left: $spacer;
                    }
                }
            }

            .timeline-middle {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .timeline-dot {
                width: 6px;
                height: 6px;
                border-radius: 999px;
                background: $white;
            }

            .content-title {
                font-family: $font-family-sans-serif;
                font-size: $h2-font-size;
                font-weight: 500;
                line-height: 50px;
                margin: 0;
                @include media-breakpoint-down(lg) {
                    font-size: $font-size-base !important;
                    line-height: $spacer;
                }
            }

            .content-description {
                font-family: $font-family-sans-serif;
                font-size: $h6-font-size;
                font-weight: 500;
                line-height: 1.75rem;
                color: $white-1;
                margin: 0;
                @include media-breakpoint-down(lg) {
                    font-size: $font-size-xs;
                    line-height: 1rem;
                    max-width: unset;
                }
            }
        }
    }

    .container-fluid.red {
        .title-block {
            .title {
                :deep(span) {
                    background: linear-gradient(
                        90.03deg,
                        #e3262f 57.94%,
                        #ab0009 87.71%
                    ) !important;
                    background-clip: text !important;
                    -webkit-background-clip: text !important;
                    -webkit-text-fill-color: transparent !important;
                }
            }
        }
    }
</style>