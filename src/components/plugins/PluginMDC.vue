<template>
    <div class="bd-content">
        <DocsFeatureScopeMarker
            v-if="page.editions || page.version || page.deprecated || page.release"
            :page="page"
        />

        <PluginIndex
            v-if="pluginType === undefined"
            :icons="icons ?? {}"
            :plugins="pluginsWithoutDeprecated ?? []"
            :plugin-name="pluginName ?? '<plugin>'"
            :sub-group="subGroup"
            :route-path="routePath ?? ''"
            :active-id="activeId"
            :subgroup-blueprint-counts="subgroupBlueprintCounts"
            :metadata-map="metadataMap"
            :schemas="schemas"
        >
            <template v-slot:markdown="{ content }">
                <MDC :value="content">
                    <template #default="mdcProps">
                        <pre v-if="mdcProps.error" style="color: white">{{ mdcProps.error }}</pre>
                        <ContentRenderer
                            v-else-if="mdcProps?.body"
                            class="markdown"
                            :value="mdcProps"
                        />
                    </template>
                </MDC>
            </template>
        </PluginIndex>

        <Suspense v-else>
            <SchemaToHtmlV2
                class="plugin-schema"
                :schema="page.body?.jsonSchema"
                :plugin-type="pluginType"
                :props-initially-expanded="true"
                :no-url-change="false"
            >
                <template #markdown="{ content }">
                    <MDC :value="content">
                        <template #default="mdcProps">
                            <pre v-if="mdcProps.error" style="color: white">{{
                                mdcProps.error
                            }}</pre>
                            <ContentRenderer
                                v-else-if="mdcProps?.body"
                                class="markdown"
                                :value="mdcProps"
                            />
                        </template>
                    </MDC>
                </template>
            </SchemaToHtmlV2>
        </Suspense>
    </div>
</template>

<script setup lang="ts">
    import { SchemaToHtmlV2, PluginIndex, type PluginMetadata } from "@kestra-io/ui-libs"

    defineProps<{
        page: any
        pluginType?: string | undefined
        icons?: Record<string, any>
        pluginsWithoutDeprecated?: any[]
        pluginName?: string | null
        subGroup?: string | undefined
        routePath?: string
        activeId?: string
        subgroupBlueprintCounts?: Record<string, number>
        metadataMap?: Record<string, PluginMetadata>
        schemas?: Record<string, { title?: string }>
    }>()
</script>

<style lang="scss" scoped>
    @use "@kestra-io/ui-libs/src/scss/_color-palette.scss" as color-palette;
    @import "~/assets/styles/variable";

    .bd-content {
        margin: 0 auto;
        padding: 2rem 0;

        @include media-breakpoint-up(lg) {
            max-width: 100%;
        }
    }

    .plugin-schema {
        :deep(hr) {
            opacity: 0.5;
            border-top: calc(2 * var(--bs-border-width)) solid $black-3;
            margin: 0 !important;
        }

        :deep(article) {
            display: flex;
            flex-direction: column;
            gap: var(--spacer);
        }

        :deep(.code-block) {
            background-color: var(--kestra-io-token-color-background-secondary);
            border: 1px solid var(--kestra-io-token-color-border-secondary);
        }

        :deep(.language),
        :deep(.copy) {
            color: var(--kestra-io-neutral-gray700) !important;
        }

        :deep(#copied-tooltip) {
            background: $gray-500;
            color: $white;
        }

        :deep(.markdown) {
            display: flex;
            flex-direction: column;
            min-width: 100%;
        }

        :deep(.plugin-section) {
            p {
                &:not(.doc-alert p) {
                    margin-bottom: 0;
                }

                & > code {
                    color: var(--kestra-io-neutral-gray900);
                    background-color: transparent !important;
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
                color: var(--kestra-io-token-color-white);
            }

            > .collapse-button {
                &:not(.collapsed) {
                    color: var(--kestra-io-token-text-link-default);
                    margin-bottom: 1rem;
                }
            }

            .collapsible-body .border {
                #{--collapsible-border-color}: var(--kestra-io-token-color-border-secondary);
                border-color: var(--kestra-io-token-color-border-secondary) !important;

                > .property {
                    background: var(--kestra-io-token-color-background-secondary);

                    &:not(:has(.collapse-button.collapsed)) {
                        background: var(--kestra-io-neutral-gray300);

                        > .collapsible-body {
                            background: var(--kestra-io-token-color-background-primary);
                        }
                    }
                }
            }

            .property-detail {
                color: var(--kestra-io-token-color-white);
                background: $black-4;

                .property-description p {
                    color: $white-3;
                }

                > *:not(:first-child) {
                    border-top: var(--bs-border-width) var(--bs-border-style) $black-6;
                }

                .border:not(.type-box) {
                    border-color: var(--kestra-io-neutral-gray500) !important;
                }
            }

            .type-box {
                color: var(--kestra-io-token-color-white);

                .ref-type {
                    border-right: 1px solid var(--kestra-io-token-color-border-primary);
                }

                &:has(.ref-type):hover {
                    background: var(--kestra-io-token-color-background-hover-primary) !important;

                    .ref-type {
                        border-right: 1px solid var(--ks-border-secondary);
                    }
                }
            }
        }
    }

    :deep(.plugin .description) {
        text-transform: none !important;
    }
</style>