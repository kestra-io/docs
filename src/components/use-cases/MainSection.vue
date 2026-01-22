<template>
    <div class="container-fluid">
        <LayoutDetailMainContent
            :subtitle="subtitle"
            :subtitleBefore="subtitleBefore"
            :baseline="baseline"
            :items="mainContent"
        />
    </div>
</template>

<script setup lang="ts">
    import LayoutDetailMainContent, {
        type DetailMainContentItem,
    } from "~/components/layout/DetailMainContent.vue"
    defineProps<{
        subtitle: string
        subtitleBefore: string
        baseline: string
        mainContent: Array<DetailMainContentItem>
    }>()
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";
    .container-fluid {
        background-color: $black-4;
    }
    :deep(section) {
        div.subtitle {
            @include media-breakpoint-up(lg) {
                max-width: 65%;
            }
        }
    }

    :deep(.feature-img-left) {
        &::before {
            background-size: 62% 100% !important;
            z-index: 0 !important;
        }
    }

    :deep(.feature-img-right) {
        &::before {
            background-size: 45% 100% !important;
            right: -3% !important;
            z-index: 0 !important;
        }
    }

    :deep(.main) {
        div.row {
            border-bottom: 1px solid #ffffff1a;
        }

        div.row:last-child {
            border: none;
        }
    }
</style>