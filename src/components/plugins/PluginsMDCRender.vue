<template>
    <div class="bd-content">
        <FeatureScopeMarker
            v-if="page.editions || page.version || page.deprecated || page.release"
            :page="page"
        />
        <PluginIndex
            v-if="pluginType === undefined"
            :icons
            :plugins
            :plugin-name
            :sub-group
            :route-path
            :subgroup-blueprint-counts
            :metadata-map
            :schemas
            @navigate="navigateTo($event)"
            :active-id="activeId"
        >
            <template v-slot:markdown="{ content }">
                <MDCParserAndRenderer :content class="long" />
            </template>
        </PluginIndex>
        <Suspense v-else>
            <SchemaToHtmlV2
                v-if="page.body.jsonSchema"
                class="plugin-schema"
                :schema="page.body.jsonSchema"
                :plugin-type="pluginType ?? ''"
                :props-initially-expanded="true"
            >
                <template #markdown="{ content }">
                    <MDCParserAndRenderer v-if="content" :content="content" />
                </template>
            </SchemaToHtmlV2>
        </Suspense>
    </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted, onUnmounted } from "vue"
    import { SchemaToHtmlV2, type Plugin, type PluginMetadata } from "@kestra-io/ui-libs"
    import PluginIndex from "@kestra-io/ui-libs/src/components/plugins/PluginIndex.vue"
    import FeatureScopeMarker from "~/components/docs/FeatureScopeMarker.vue"
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"

    const props = withDefaults(
        defineProps<{
            page: any
            routePath: string
            pluginType?: string
            icons?: Record<string, string>
            plugins?: Plugin[]
            pluginName: string
            subGroup?: string
            subgroupBlueprintCounts?: Record<string, number>
            metadataMap?: Record<string, PluginMetadata>
            schemas?: Record<string, { title?: string }>
        }>(),
        {
            icons: () => ({}),
            plugins: () => [],
            pluginName: undefined,
            subGroup: undefined,
        },
    )

    const activeId = ref("")

    const updateActiveId = () => {
        activeId.value = window.location.hash.substring(1).toLowerCase()
    }

    const events = ['hashchange', 'popstate']

    onMounted(() => {
        updateActiveId()
        events.forEach(event => window.addEventListener(event, updateActiveId))
    })

    onUnmounted(() => {
        events.forEach(event => window.removeEventListener(event, updateActiveId))
    })

    function navigateTo(url: string) {
        window.location.assign(url)
    }
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

        :deep(code) {
            border: none !important;
        }

        :deep(h4) {
            margin-bottom: 1.5rem;
        }

        :deep(h3) {
            padding: 0;
        }

        :deep(.long) {
            a {
                color: var(--ks-content-link);

                &:hover {
                    color: var(--ks-content-link-hover);
                }
            }

            h3 {
                font-size: 18.4px;
                font-weight: 600;
            }

            p,
            h4,
            li {
                font-size: 16px;
                line-height: 1.5rem;
            }

            h4 {
                font-weight: 600;
            }
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