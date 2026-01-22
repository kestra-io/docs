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
                <div class="col-12 col-lg-5 mb-4 z-2" data-usal="zoomin">
                    <div class="unlock-content text-end">
                        <template v-for="info in unlockContent.leftContent">
                            <p class="content-title">{{ info.title }}</p>
                            <p class="content-description">
                                {{ info.description }}
                            </p>
                        </template>
                    </div>
                </div>
                <div class="col-12 d-none d-lg-block col-lg-2 mb-4 z-2" data-usal="zoomin">
                    <UnlockSectionLine :strokeColor="strokeColor" />
                </div>
                <div class="col-12 col-lg-5 mb-4 z-2" data-usal="zoomin">
                    <div class="unlock-content text-start">
                        <template v-for="info in unlockContent.rightContent">
                            <p class="content-description">
                                {{ info.description }}
                            </p>
                            <p class="content-title">{{ info.title }}</p>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import UnlockSectionLine from "~/components/use-cases/UnlockSectionLine.vue"

    const props = defineProps<{
        title?: string
        description: string
        logoPath: string
        logoAlt: string
        strokeColor: string
        unlockContent: any
    }>()
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
                    flex-direction: row;
                    max-width: 100%;
                    gap: $spacer;
                    padding-top: $spacer;
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