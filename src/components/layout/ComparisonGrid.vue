<template>
    <div class="container order-2">
        <div class="border-top-block" />
        <div class="content">
            <h3 class="title" v-if="title">{{ title }}</h3>
            <div class="list-container">
                <div class="list" v-for="(category, index) in categories" :key="index" data-usal="fade-up">
                    <p>{{ category.title }}</p>
                    <ul class="security-section">
                        <li v-for="(item, itemIndex) in category.items" :key="itemIndex">
                            <component :is="item.icon" v-if="item.icon" />
                            <span>{{ item.label }}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="information" v-if="infoBlocks && infoBlocks.length">
                <div class="info-block" v-for="(block, index) in infoBlocks" :key="index" data-usal="fade-up">
                    <span v-html="block.label"></span>
                    <div class="info-images" v-if="block.logos">
                        <template v-for="(logo, logoIndex) in block.logos" :key="logoIndex">
                            <div
                                class="logo-image"
                                v-html="logo.img"
                                role="img"
                                :aria-label="logo.alt"
                            />
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="plus-icon" v-if="bottomBlock">
            <img v-bind="plusIcon" alt="plus" />
        </div>
        <div class="bottom-block" v-if="bottomBlock" data-usal="fade-up">
            <span>{{ bottomBlock.title }}</span>
            <div class="opportunities">
                <div v-for="(item, index) in bottomBlock.items" :key="index">
                    <component :is="item.icon" v-if="item.icon" />
                    <span>{{ item.label }}</span>
                </div>
            </div>
        </div>
        <div class="compare-btn" data-usal="fade-up">
            <a v-if="cta" :href="cta.href" class="btn btn-animated btn-purple-animated">
                <span>{{ cta.text }}</span>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        title?: string
        categories: Array<{
            title: string
            items: Array<{
                icon?: any
                label: string
            }>
        }>
        infoBlocks?: Array<{
            label: string
            logos?: Array<{
                img: any
                alt: string
            }>
        }>
        bottomBlock?: {
            title: string
            items: Array<{
                icon?: any
                label: string
            }>
        }
        plusIcon?: any
        cta?: {
            text: string
            href: string
        }
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    %gradient-border {
        content: "";
        position: absolute;
        inset: -1px;
        z-index: -1;
    }

    .container {
        max-width: 1120px;
        padding: $rem-1;
        border-bottom: none !important;
        .border-top-block {
            width: 100%;
            border: none;
            background: linear-gradient(270deg, transparent 26.08%, #343393 74.89%);
            html.light & {
                background: linear-gradient(270deg, transparent 26.08%, #a9b5fe 74.89%);
            }
            height: 1px;
            display: none;
            @include media-breakpoint-down(sm) {
                display: block;
            }
        }
        .content {
            padding: $rem-2;
            background: var(--ks-background-body);
            html.light & {
                background: rgba(255, 255, 255, 0.92);
            }
            position: relative;
            border-radius: 16px;
            &::before {
                @extend %gradient-border;
                border-radius: 16px;
                background: linear-gradient(360deg, rgba(53, 52, 170, 0.78) 5.44%, rgba(37, 32, 49, 0.6) 25.28%, #31314b 68.12%, rgba(53, 52, 170, 0.975664) 109%);
                html.light & {
                    background: linear-gradient(360deg, rgba(153, 166, 249, 0.4) 5.44%, rgba(153, 162, 222, 0.3) 25.28%, #e8eaef 68.12%, rgba(169, 181, 254, 0.5) 109%);
                }
                @include media-breakpoint-down(sm) {
                    background: unset;
                }
            }
            .title {
                text-align: center;
                width: 100%;
                padding-bottom: 32px;
                @include media-breakpoint-down(lg) {
                    font-size: $font-size-2xl;
                    padding-bottom: 16px;
                    margin-bottom: 0;
                }
                @include media-breakpoint-down(sm) {
                    text-align: start;
                    font-size: 22px;
                }
            }
            .list-container {
                display: flex;
                gap: 32px;
                @include media-breakpoint-down(xl) {
                    width: 100%;
                    gap: 10px;
                    flex-wrap: wrap;
                    justify-content: center;
                }
                .list {
                    width: 100%;
                    max-width: 330px;
                    background: linear-gradient(180deg, #13151d, #1a1c24);
                    html.light & {
                        background: linear-gradient(180deg, #f8f9fc, #f0f1f5);
                    }
                    border: none;
                    border-radius: 20px;
                    padding: $rem-1;
                    position: relative;
                    &::before {
                        @extend %gradient-border;
                        border-radius: 20px;
                        background: linear-gradient(180deg, #202429, #131725) !important;
                        html.light & {
                            background: linear-gradient(180deg, #e4e6ed, #dbe0ff) !important;
                        }
                        @media (max-width: 420px) {
                            background: unset;
                        }
                    }
                    p {
                        font-weight: 600;
                    }
                    &:nth-child(3) {
                        @include media-breakpoint-down(xl) {
                            max-width: unset;
                        }
                    }
                    @include media-breakpoint-down(xl) {
                        max-width: 49%;
                    }
                    @include media-breakpoint-down(md) {
                        max-width: unset;
                    }
                    .security-section {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        list-style: none;
                        padding: 0;
                        li {
                            position: relative;
                            display: flex;
                            gap: 10px;
                            padding: $rem-1;
                            border-radius: 4px;
                            &::after {
                                border-radius: 4px;
                                content: "";
                                background: linear-gradient(90deg, #292d38, #292730);
                                html.light & {
                                    background: linear-gradient(90deg, #f0f1f5, #edeef3);
                                }
                                inset: 0;
                                position: absolute;
                                z-index: 2;
                            }
                            &::before {
                                border-radius: 4px;
                                content: "";
                                background: linear-gradient(91.19deg, #474450 1.02%, #4744508c 66.77%);
                                html.light & {
                                    background: linear-gradient(91.19deg, #d0d1d9 1.02%, rgba(208, 209, 217, 0.55) 66.77%);
                                }
                                inset: -1px;
                                position: absolute;
                                z-index: 0;
                            }
                            :deep(.material-design-icon__svg) {
                                font-size: $rem-1;
                                position: relative;
                                z-index: 4;
                            }
                            span {
                                font-size: $font-size-sm;
                                line-height: $rem-1;
                                text-align: left;
                                color: var(--ks-content-primary);
                                position: relative;
                                z-index: 4;
                            }
                        }
                    }
                }
            }
            .information {
                margin-top: $rem-2;
                display: grid;
                text-align: center;
                grid-template-columns: repeat(2, 1fr);
                gap: $rem-2;
                @include media-breakpoint-down(lg) {
                    grid-template-columns: 1fr;
                }
                .info-block {
                    position: relative;
                    padding: 16px;
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    background: linear-gradient(180deg, #21242e, #1a1c24);
                    html.light & {
                        background: linear-gradient(180deg, #f8f9fc, #f0f1f5);
                    }
                    align-items: center;
                    &::before {
                        @extend %gradient-border;
                        border-radius: 20px;
                        background: linear-gradient(180deg, #2b313e, #131725);
                        html.light & {
                            background: linear-gradient(180deg, #e4e6ed, #dbe0ff);
                        }
                    }
                    span {
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: $font-size-base;
                        font-weight: 600;
                        line-height: 18.8px;
                        text-align: center;
                        color: var(--ks-content-primary);
                    }
                    .info-images {
                        display: flex;
                        justify-content: center;
                        gap: 9px;
                        align-items: center;
                        .logo-image {
                            color: var(--ks-content-primary);
                            display: flex;
                        }
                    }
                }
            }
        }
        .plus-icon {
            display: flex;
            justify-content: center;
        }
        .bottom-block {
            border: 1px dashed #414a5d;
            html.light & {
                border-color: #c0c4d0;
            }
            border-radius: 16px;
            padding: 16px;
            background: linear-gradient(180deg, #21242e, #1a1c24);
            html.light & {
                background: linear-gradient(180deg, #f8f9fc, #f0f1f5);
            }
            display: flex;
            gap: 30px;
            align-items: center;
            text-align: center;
            justify-content: space-between;
            @include media-breakpoint-down(sm) {
                margin-inline: $rem-2 !important;
                padding-inline: $rem-1;
            }
            @include media-breakpoint-down(lg) {
                flex-direction: column;
                align-items: start;
                gap: $rem-1;
            }
            > span {
                white-space: nowrap;
                font-size: $font-size-base;
                font-weight: 600;
                line-height: 21.15px;
                text-align: center;
            }
            .opportunities {
                width: 100%;
                display: flex;
                justify-content: space-between;
                gap: 8px;
                @include media-breakpoint-down(lg) {
                    flex-wrap: wrap;
                }
                div {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    justify-content: space-between;
                    background: #292d38;
                    border: 1px solid #3c3a44;
                    html.light & {
                        background: #f0f1f5;
                        border-color: #d0d1d9;
                    }
                    padding: 14px 8px;
                    border-radius: 4px;
                    @include media-breakpoint-down(lg) {
                        justify-content: start;
                        gap: 15px;
                        width: 48%;
                    }
                    @include media-breakpoint-down(md) {
                        width: 100%;
                    }
                    :deep(.material-design-icon__svg) {
                        font-size: 22px;
                    }
                    span {
                        max-width: 157px;
                        font-size: 14px;
                        text-align: left;
                        display: flex;
                        flex-wrap: wrap;
                        color: var(--ks-content-primary);
                        @include media-breakpoint-down(xl) {
                            max-width: 100px;
                        }
                        @include media-breakpoint-down(lg) {
                            max-width: unset;
                        }
                    }
                }
            }
        }
        .compare-btn {
            display: flex;
            justify-content: center;
            margin-top: $rem-2;
            margin-bottom: $rem-4;
        }
    }
</style>
