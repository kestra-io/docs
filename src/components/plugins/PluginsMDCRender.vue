<template>
    <Suspense>
        <SchemaToHtmlV2
            v-if="schema"
            class="plugin-schema"
            :schema="schema"
            plugin-type=""
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
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"

    const props = defineProps<{
        schema: JSONSchema
    }>()
</script>

<style lang="scss" scoped>
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;

    .bd-content {
        margin: 0 auto;
        padding: 2rem 0;
        @include media-breakpoint-up(lg) {
            max-width: 100%;
        }
        :deep(code) {
            border: none !important;
            background-color: transparent !important;
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
    }

    .plugin-schema {
        :deep(hr) {
            opacity: 0.5;
            border-top: calc(2 * var(--bs-border-width)) solid
                var(--ks-background-primary);
            margin: 0 !important;
        }
        :deep(article) {
            display: flex;
            flex-direction: column;
            gap: var(--spacer);
        }
        :deep(.code-block) {
            background-color: var(--kestra-io-token-color-background-secondary);
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
                & > code {
                    background-color: var(--ks-background-secondary) !important;
                    border: none;
                }
            }
            .border,
            .property:not(:first-child) {
                border: none !important;
            }
            .collapse-button {
                font-size: var(--font-size-lg);
                line-height: 1.5rem;
                color: var(--ks-content-primary);
            }
            > .collapse-button {
                &:not(.collapsed) {
                    color: var(--ks-content-link);
                    margin-bottom: 1rem;
                }
            }
            .property-detail {
                color: var(--ks-content-primary);
                background: var(--ks-background-body);
                border: $block-border;
                .property-description p {
                    margin-bottom: 0 !important;
                }
                > *:not(:first-child) {
                    border-top: var(--bs-border-width) var(--bs-border-style)
                        var(--ks-border-primary);
                }
                .border:not(.type-box) {
                    border-color: var(--ks-border-primary) !important;
                    background-color: var(--ks-background-function) !important;
                }
            }
            .me-3 {
                display: none !important;
            }
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
        .collapse-button span:not(.type-box) {
            color: var(--ks-content-color-highlight) !important;
        }
    }

    :deep(.plugin .description) {
        text-transform: none !important;
    }
    :deep(div.description) {
        border-color: var(--ks-border-primary) !important;
        margin: 0 -2rem !important;
        padding: 2rem !important;
    }

    :deep(.gradient-overlay),
    :deep(.more-btn) {
        background: linear-gradient(transparent, var(--ks-background-body));
    }
</style>
