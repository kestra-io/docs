<script lang="ts" setup>
import type { Plugin } from '@kestra-io/ui-libs';
import MDCParserAndRenderer from '~/components/MDCParserAndRenderer.vue';

defineProps<{
    headingTitle: string;
    pluginType?: string;
    rootPlugin?: Plugin;
    currentPageIcon?: string;
    headingDescription?: string;
}>()
</script>

<template>
    <h1 class="py-0 title">
        <div v-if="currentPageIcon" class="pageIcon">
            <NuxtImg :src="currentPageIcon" :alt="headingTitle" loading="lazy" format="webp" quality="80"
                densities="x1 x2" class="blurred-bg" />
            <NuxtImg :src="currentPageIcon" :alt="headingTitle" width="80" height="80" loading="lazy" format="webp"
                quality="80" densities="x1 x2" class="page-icon" />
        </div>
        <div class="title-content d-flex flex-column justify-space-between w-100">
            <div class="d-flex align-items-center flex-wrap gap-3">
                <span>{{ headingTitle }}</span>
                <img src="/landing/plugins/certified.svg" alt="Certified" class="mt-1" />
            </div>
            <div v-if="headingDescription" class="bd-markdown">
                <MDCParserAndRenderer :content="headingDescription" />
            </div>
        </div>
        <div v-if="rootPlugin?.license" class="title-actions d-flex flex-column gap-2 ps-4">
            <span class="btn enterprise-badge">Enterprise Edition</span>
            <NuxtLink href="/demo" class="btn btn-primary" target="_blank">
                Talk to us
            </NuxtLink>
        </div>
    </h1>
</template>

<style lang="scss" scoped>
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;
    @import "~/assets/styles/variable";

    .pageIcon {
        min-width: 104px;
        height: 104px;
        border-radius: 14px;
        background: $white;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        position: relative;
        z-index: 5;
        overflow: visible;
    }

    .blurred-bg {
        position: absolute;
        top: 40%;
        left: -30%;
        width: 120%;
        height: 50%;
        filter: blur(50px);
        object-fit: cover;
        object-position: center;
        z-index: -1;
        transform: translateX(-20px);
    }

    .title {
        font-size: 2rem;
        font-weight: 600;
        margin: 0 auto;
        display: flex;
        align-items: start;
        gap: 1rem;

        .title-actions {
            display: flex;
            flex-direction: column;
            gap: .5rem;
            align-items: stretch;

            .btn {
                min-width: 100%;
                width: 100%;
                white-space: nowrap;
                min-width: 116px;
                padding: 4px 10px;
                white-space: nowrap;
            }

            .enterprise-badge {
                background: #130025;
                border: 1px solid color-palette.$base-yellow-700;
                gap: 4px;
                min-height: 20px;
                border-radius: 40px;
                border-width: 1px;
                font-size: 12px;
                color: color-palette.$base-yellow-100;
                cursor: default;
            }
        }

        @include media-breakpoint-down(lg) {
            display: grid;
            grid-template-columns: 104px 1fr;
            grid-template-areas: "icon content" "actions content";
            column-gap: 1rem;
            row-gap: 0.875rem;
            align-items: start;

            .pageIcon {
                grid-area: icon;
                margin-right: 0;
            }

            .title-content {
                grid-area: content;
            }

            .title-actions {
                grid-area: actions;
                justify-self: start;
                padding-left: 0 !important;
                display: flex;
                flex-direction: row !important;
                gap: 1rem !important;
                margin-top: 0.25rem;

                .btn {
                    min-width: unset;
                    flex: 0 0 auto;
                }
            }
        }
    }

    :deep(.bd-markdown) {
        p {
            font-size: 1rem;
        }

        max-width: 650px;
        color: color-palette.$base-gray-200;
        margin-top: 0.25rem;
        line-height: 1.5;

        @include media-breakpoint-down(lg) {
            p {
                font-size: 12px;
            }
        }

        @media screen and (max-width: 1100px) {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            line-clamp: 4;
            -webkit-line-clamp: 4;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
        }
    }
</style>
