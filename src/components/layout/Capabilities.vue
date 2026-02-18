<template>
    <section class="content">
        <div class="container">
            <div class="anything-scale" v-if="mainHero">
                <div class="info" data-usal="fade-right">
                    <p v-if="mainHero.title">{{ mainHero.title }}</p>
                    <span v-if="mainHero.description">{{ mainHero.description }}</span>
                </div>
                <div class="col-md-6 order-0 order-md-1 rounded-2" data-usal="fade-left">
                    <img class="image-fluid" v-bind="mainHero.img" :alt="mainHero.title" />
                </div>
            </div>

            <div class="declarative" v-if="featuredBlocks && featuredBlocks.length">
                <div class="block" v-for="(block, index) in featuredBlocks" :key="index">
                    <div class="block-item" data-usal="fade-right">
                        <p v-if="block.title">{{ block.title }}</p>
                        <span v-if="block.description">{{ block.description }}</span>
                    </div>
                    <div class="w-100 order-md-1 rounded-2" data-usal="fade-left" :class="block.imageClass">
                        <img v-bind="block.img" :alt="block.title" :class="block.imgClass" />
                    </div>
                </div>
            </div>
        </div>
    </section>
    <slot name="plugins" />
</template>

<script setup lang="ts">
    defineProps<{
        mainHero?: {
            title?: string
            description?: string
            img: any
        }
        featuredBlocks?: Array<{
            title?: string
            description?: string
            img: any
            imageClass?: string
            imgClass?: string
        }>
        cta?: {
            text: string
            href: string
        }
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .content {
        background: var(--ks-background-body);
        padding: calc($spacer * 4) $spacer;
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: $rem-2;
            p, span {
                text-align: left;
            }
            p {
                margin: 0;
                font-size: $h2-font-size;
                color: var(--ks-content-primary);
                font-weight: 600;
                @include media-breakpoint-down(sm) {
                    font-size: 24px;
                }
            }
            span {
                font-size: 14px;
                color: var(--ks-content-secondary);
                font-weight: normal;
            }
            .anything-scale {
                display: flex;
                align-items: center;
                gap: $rem-4;
                border-radius: 1.25rem;
                background: var(--ks-background-secondary);
                border: $block-border;
                .image-fluid {
                    max-width: 548px;
                    width: 100%;
                    height: auto;
                }
                @media (max-width: 906px) {
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 0;
                    padding: $rem-1;
                }
                .info {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    padding-left: 64px;
                    max-width: 480px;
                    @media (max-width: 906px) {
                        padding-left: 0;
                        gap: 8px;
                    }
                }
            }
            .declarative {
                display: flex;
                justify-content: space-between;
                gap: $rem-2;
                position: relative;
                width: 100%;
                @include media-breakpoint-down(lg) {
                    gap: 10px;
                }
                @media (max-width: 860px) {
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .block {
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    justify-content: space-between;
                    width: 100%;
                    background: var(--ks-background-secondary);
                    border-radius: 20px;
                    border: $block-border;
                    @media (max-width: 860px) {
                        max-width: 600px;
                    }
                    .block-item {
                        padding: $rem-4 $rem-4 0;
                        display: flex;
                        flex-direction: column;
                        gap: 20px;
                        @media (max-width: 860px) {
                            padding: $rem-2 $rem-2 10px;
                            gap: 8px;
                        }
                    }
                    img {
                        padding: 0 0 0 $rem-4;
                        width: 100%;
                    }
                    .real-time img {
                        padding-inline: $rem-4;
                    }
                }
            }
            .demo-btn {
                cursor: pointer;
                padding: 10px 16px;
                background: #6862f5;
                border-radius: 4px;
                max-width: 121px;
                span {
                    color: #fff;
                    font-size: $rem-1;
                    font-weight: 700;
                    line-height: 24px;
                    text-align: center;
                }
            }
        }
    }
</style>
