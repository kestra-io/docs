<template>
    <Suspense>
        <SchemaToHtmlV2
            class="plugin-schema"
            :schema
            :plugin-type
            :props-initially-expanded="true"
        >
            <template #markdown="{ content }">
                <MDCParserAndRenderer v-if="content" :content="content" />
            </template>
        </SchemaToHtmlV2>
    </Suspense>
</template>

<script lang="ts" setup>
    import { SchemaToHtmlV2, type JSONSchema } from "@kestra-io/ui-libs"
    import MDCParserAndRenderer from "../MDCParserAndRenderer.vue"

    defineProps<{
        schema: JSONSchema
        pluginType: string
    }>()
</script>

<style lang="scss" scoped>
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;

    @mixin section-colors($section, $color) {
        &.section-#{$section} .collapse-button span:not(.type-box),
        &.section-#{$section} .prop-key {
            color: $color !important;
        }
    }

    .plugin-schema {
        :deep(hr) {
            opacity: 0.5;
            border-top: calc(2 * var(--bs-border-width)) solid var(--ks-background-primary);
            margin: 0 !important;
        }

        :deep(article) {
            display: flex;
            flex-direction: column;
            gap: var(--spacer);
        }

        :deep(.code-block) {
            background-color: var(--ks-background-input);
            border: $block-border;
            margin-top: $rem-1;
        }

        :deep(.language),
        :deep(.copy) {
            color: var(--ks-content-secondary) !important;
        }

        :deep(#copied-tooltip) {
            background: var(--ks-content-secondary);
            color: var(--ks-content-primary);
        }

        :deep(.markdown) {
            display: flex;
            flex-direction: column;
            min-width: 100%;
        }

        :deep(.property .collapse-button) {
            background-color: var(--ks-background-secondary);
            border: $block-border;
        }

        :deep(.plugin-section) {
            border-color: var(--ks-border-primary);

            p {
                &:not(.doc-alert p) {
                    margin-bottom: 0;
                }

                > code {
                    background-color: var(--ks-background-secondary) !important;
                    border: none;
                }
            }

            .border,
            .property:not(:first-child) {
                border: none !important;
            }

            .collapse-button {
                font-size: $h4-font-size;
                line-height: 1.5rem;
                color: var(--ks-content-primary);
            }

            > .collapse-button:not(.collapsed) {
                color: var(--ks-content-primary);
                margin-bottom: 1rem;
            }

            .property-detail {
                color: var(--ks-content-primary);
                background: var(--ks-background-body);
                border: $block-border;

                > * {
                    padding: 1rem;
                }

                .property-description p {
                    margin-bottom: 0 !important;
                }

                > *:not(:first-child) {
                    border-top: var(--bs-border-width) var(--bs-border-style) var(--ks-border-primary);
                }

                .border:not(.type-box) {
                    border-color: var(--ks-border-primary) !important;
                    background-color: var(--ks-background-function) !important;
                    padding: 2px 8px !important;
                }
            }

            .me-3 {
                display: none !important;
            }
        }

        :deep(.section-properties > .collapse-button > span) {
            color: var(--ks-content-property) !important;
            font-size: $font-size-sm !important;
        }

        :deep(.section-outputs > .collapse-button > span) {
            color: var(--ks-content-output) !important;
            font-size: $font-size-sm !important;
        }

        :deep(.section-metrics > .collapse-button > span) {
            color: color-palette.$base-orange-400 !important;
            font-size: $font-size-sm !important;
        }
    }

    :deep(.def-collapsible) {
        .def-content {
            background-color: transparent !important;
            border-color: var(--ks-border-primary) !important;
        }

        .def-property {
            border-color: var(--ks-border-primary) !important;
        }

        @include section-colors("properties", var(--ks-content-property));
        @include section-colors("outputs", var(--ks-content-output));
        @include section-colors("metrics", color-palette.$base-orange-400);

        &[class*="section-"] summary.collapse-button span:not(.type-box),
        summary.collapse-button span:not(.type-box) {
            color: var(--ks-content-color-highlight) !important;
            font-size: $font-size-xs !important;
        }
    }

    :deep(.type-box) {
        background: var(--ks-background-tag-category);
        color: var(--ks-content-tag-category) !important;
        font-weight: 600;
        font-size: $font-size-xs;
        text-transform: lowercase;
        border: none;
        font-family: $font-family-sans-serif;
    }
</style>