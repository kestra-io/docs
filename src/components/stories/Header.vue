<template>
    <section class="header">
        <div class="background"></div>
        <div class="container">
            <div class="top">
                <div class="left">
                    <img height="56" loading="lazy" :src="logo" :alt="logo" class="logo-dark"/>
                    <img height="56" loading="lazy" :src="logoDark" :alt="logoDark" class="logo-light"/>
                    <h1 v-if="title">{{ title }}</h1>
                    <p class="baseline">{{ metaDescription }}</p>
                </div>
                <div class="right">
                    <img
                        v-if="heroImage"
                        class="image img-fluid"
                        :src="heroImage"
                        :alt="metaDescription"
                    />
                </div>
            </div>

            <div class="bottom">
                <div v-for="(kpi, index) in kpis" :key="index" class="kpi-section">
                    <MDCParserAndRenderer v-if="kpi" :content="kpi" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { ref } from "vue"
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"

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
    @import "../../assets/styles/variable";

    .header {
        position: relative;
        background: var(--ks-background-body);
        border-top: $block-border;
        border-bottom: $block-border;
        margin-top: $rem-1;
        .background {
            position: fixed;
            inset: 0;
            z-index: -1;
            background: var(--ks-background-body);
            pointer-events: none;
        }
        &::before {
            content: "";
            position: absolute;
            right: -100.767px;
            top: 3.262rem;
            width: 818px;
            height: 415px;
            background-color: var(--ks-border-secondary);
            mask-image: url("/stories/header/dots.svg");
            z-index: 0;
            pointer-events: none;
        }
        .container {
            position: relative;
            z-index: 2;
            padding: 3rem 1rem 2rem 1rem;
            @include media-breakpoint-up(lg) {
                padding-top: 5rem;
            }
            .top {
                width: 100%;
                gap: 2rem;
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
                    height: 330px;
                    gap: 0.75rem;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
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
                    @include media-breakpoint-down(lg) {
                        width: 100%;
                        height: auto;
                        text-align: left;
                    }
                    img {
                        min-height: 3.875rem;
                    }
                    h1 {
                        font-weight: 700;
                        @include media-breakpoint-up(xl) {
                            font-size: 2.5rem;
                        }
                        margin: 0;
                    }
                    .baseline {
                        font-weight: 500;
                        font-size: 1rem;
                        margin: 0;
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
                }
            }
            .bottom {
                width: 1033px;
                display: flex;
                gap: 6rem;
                @include media-breakpoint-down(lg) {
                    width: 100%;
                    flex-direction: column;
                    gap: 0.75rem;
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
                        font-weight: 600;
                        font-size: 2rem !important;
                        @include media-breakpoint-up(lg) {
                            font-size: 3rem !important;
                        }
                        margin: 0;
                        white-space: nowrap;
                    }
                    :deep(p) {
                        font-weight: 400;
                        font-size: 0.875rem;
                        margin: 0;
                    }
                }
            }
        }
    }
</style>