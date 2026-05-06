<template>
    <section class="header">
        <div class="container">
            <div class="top">
                <div class="left">
                    <Breadcrumb
                        :items="[
                            { label: 'Home', href: '/' },
                            {
                                label: 'Customer Stories',
                                href: '/use-cases/stories',
                            },
                        ]"
                    />
                    <h1 v-if="title">{{ title }}</h1>
                    <p class="baseline">{{ metaDescription }}</p>
                </div>
                <div class="right">
                    <div class="image-wrapper">
                        <img
                            v-if="heroImage"
                            class="image img-fluid"
                            :src="heroImage"
                            :alt="metaDescription"
                        />
                        <div v-if="logo" class="logo-wrapper">
                            <img
                                height="56"
                                loading="lazy"
                                :src="logoDark"
                                :alt="logo"
                                class="logo-dark"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="bottom">
                <div
                    v-for="(kpi, index) in kpis"
                    :key="index"
                    class="kpi-section"
                >
                    <MDCParserAndRenderer v-if="kpi" :content="kpi" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref } from "vue"
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"
    import Breadcrumb from "~/components/layout/Breadcrumb.vue"

    const props = defineProps<{
        slug: string
        title: string
        metaDescription: string
        heroImage?: string
        logo?: string
        logoDark?: string
        kpi1?: string
        kpi2?: string
        kpi3?: string
    }>()

    const kpis = ref([props.kpi1, props.kpi2, props.kpi3])
</script>

<style scoped lang="scss">
    .header {
        position: relative;
        background: var(--ks-background-secondary) url("./assets/grid.svg")
            no-repeat center / cover;
        border-top: $block-border;
        border-bottom: $block-border;

        .container {
            position: relative;
            z-index: 2;
            padding: 3rem 1rem 2rem 1rem;

            @include media-breakpoint-up(lg) {
                padding-top: 5rem;
            }

            .top {
                width: 100%;
                gap: 4rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 2rem 0;

                @include media-breakpoint-down(lg) {
                    flex-direction: column;
                    gap: 1rem;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .left {
                    width: 554px;
                    gap: 0.75rem;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;

                    @include media-breakpoint-down(lg) {
                        width: 100%;
                        height: auto;
                        text-align: left;
                    }

                    h1 {
                        @include media-breakpoint-up(xl) {
                            font-size: 2.5rem;
                        }

                        margin: 0;
                        display: -webkit-box;
                        line-clamp: 3;
                        -webkit-line-clamp: 3;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    }

                    .baseline {
                        font-weight: 500;
                        font-size: 1rem;
                        margin: 0;
                        text-transform: capitalize;
                    }
                }

                .right {
                    width: 554px;
                    height: 345px;
                    border-radius: 0.8125rem;
                    border-width: 1px;
                    padding: 0.375rem;
                    border: 1px solid var(--ks-border-secondary);
                    background: transparent;

                    @include media-breakpoint-down(lg) {
                        width: 100%;
                        height: 100%;
                    }

                    .image-wrapper {
                        position: relative;
                        width: 100%;
                        height: 100%;

                        .image {
                            width: 100%;
                            height: 100%;
                            border-radius: 0.5625rem;
                            object-fit: cover;

                            @include media-breakpoint-down(lg) {
                                width: 100%;
                                height: 100%;
                            }
                        }

                        .logo-wrapper {
                            position: absolute;
                            top: 0;
                            right: 0;
                            background-color: $white;
                            padding: 0.5rem;
                            border-top-right-radius: 0.5rem;
                            border-bottom-left-radius: 0.5rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            img {
                                min-height: auto;
                                height: 56px;
                            }
                        }
                    }
                }
            }

            .bottom {
                width: 1033px;
                display: flex;
                gap: 6rem;

                @include media-breakpoint-down(lg) {
                    width: 100%;
                    flex-direction: column;
                    gap: 1rem;
                    height: auto;
                }

                .kpi-section {
                    text-align: center;

                    @include media-breakpoint-up(lg) {
                        text-align: left;
                    }

                    position: relative;

                    @include media-breakpoint-up(lg) {
                        &:not(:last-child)::after {
                            content: "";
                            position: absolute;
                            right: -3rem;
                            top: 50%;
                            transform: translateY(-50%);
                            width: 1px;
                            height: 100%;
                            background-color: var(--ks-border-secondary);
                        }
                    }

                    :deep(h5) {
                        font-size: 2rem !important;
                        color: var(--ks-content-color-highlight);

                        @include media-breakpoint-up(lg) {
                            font-size: $h1-font-size !important;
                        }

                        margin: 0;
                        white-space: nowrap;
                    }

                    :deep(p) {
                        font-size: 0.875rem;
                        margin: 0;
                    }
                }
            }
        }
    }
</style>
