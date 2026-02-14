<template>
    <div class="bd-content">
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
            border-top: calc(2 * var(--bs-border-width)) solid var(--ks-background-primary);
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
                    border-top: var(--bs-border-width) var(--bs-border-style) var(--ks-border-primary);
                }
                .border:not(.type-box) {
                    border-color: var(--ks-border-primary) !important;
                    background-color: var(--ks-background-secondary) !important;
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

    :deep(.gradient-overlay), :deep(.more-btn) {
        background: linear-gradient(transparent, var(--ks-background-body));
    }
</style>