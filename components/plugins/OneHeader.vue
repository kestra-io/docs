<script lang="ts" setup>
import type { Plugin } from '@kestra-io/ui-libs';

defineProps<{
    headingTitle: string;
    pluginType?: string;
    rootPlugin?: Plugin;
    currentPageIcon?: string;
}>()
</script>

<template>
 <h1 class="py-0 title">
    <div v-if="currentPageIcon" class="pageIcon">
        <NuxtImg
            :src="currentPageIcon"
            :alt="headingTitle"
            loading="lazy"
            format="webp"
            quality="80"
            densities="x1 x2"
            class="blurred-bg"
        />
        <NuxtImg
            :src="currentPageIcon"
            :alt="headingTitle"
            width="80"
            height="80"
            loading="lazy"
            format="webp"
            quality="80"
            densities="x1 x2"
            class="page-icon"
        />
    </div>
    <div class="title-content d-flex flex-column justify-space-between w-100">
        <div class="d-flex align-items-center flex-wrap gap-3">
            <span>{{ headingTitle }}</span>
            <img src="/landing/plugins/certified.svg" alt="Certified" class="mt-1" />
        </div>
        <slot/>
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
@import "../../assets/styles/variable";

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
</style>
