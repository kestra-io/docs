<script lang="ts" setup>
    import MDCParserAndRenderer from "../MDCParserAndRenderer.vue"

    defineProps<{
        content: string
    }>()
</script>

<template>
    <MDCParserAndRenderer :content class="ks-plugins-core" />
</template>

<style lang="scss" scoped>
    .ks-plugins-core {
        margin: 0 auto;
        padding: 2rem 0;
        @include media-breakpoint-up(lg) {
            max-width: 100%;
        }
        :deep(.plugin) {
            background-color: var(--ks-background-primary) !important;
            box-shadow: none !important;
            border-color: var(--ks-border-primary);
            &:hover {
                border-color: var(--ks-border-active) !important;
            }
            h6 {
                color: var(--ks-content-primary);
            }
            .description {
                text-transform: none;
            }
        }
        :deep(.element-card) {
            background-color: var(--ks-background-primary) !important;
            border-color: var(--ks-border-primary) !important;
            box-shadow: none !important;
            &:hover {
                border-color: var(--ks-border-active) !important;
            }
            h6 {
                color: var(--ks-content-primary);
            }
            .plugin-info {
                background-color: transparent;
                border: $block-border;
                .plugin-class {
                    color: var(--ks-content-link) !important;
                }
            }
        }

        :deep(code) {
            border: none !important;
            background-color: transparent !important;
        }
    }
</style>
