<template>
    <div class="bd-content" v-if="page">
        <FeatureScopeMarker v-if="page.editions || page.version || page.deprecated || page.release"
                                :page="page"/>
        <PluginIndex
                    v-if="pluginType === undefined"
                    class="plugin-index"
                    :icons="icons"
                    :plugins="pluginsWithoutDeprecated"
                    :plugin-name="pluginName"
                    :sub-group="subGroup"
                    :routePath="routePath"
                    @navigate="navigateTo($event)"
        >
            <template v-slot:markdown="{ content }">
                <MDCParserAndRenderer :content />
            </template>
        </PluginIndex>
        <Suspense v-else>
            <SchemaToHtml v-if="page.body.jsonSchema" class="plugin-schema" :schema="page.body.jsonSchema" :plugin-type="pluginType ?? ''"
                    :props-initially-expanded="true">
                <template #markdown="{ content }">
                    <MDCParserAndRenderer v-if="content" :content="content" />
                </template>
            </SchemaToHtml>
        </Suspense>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { PluginIndex, SchemaToHtml } from '@kestra-io/ui-libs';
import { getPluginsWithoutDeprecated } from '../../src/utils/plugins/getListOfPlugins';
import FeatureScopeMarker from '../docs/FeatureScopeMarker.vue';
import MDCParserAndRenderer from './MDCParserAndRenderer.vue';

const props = withDefaults(defineProps<{
    page: any,
    routePath: string,
    pluginType?: string,
    icons?: Record<string, string>,
    plugins?: any[],
    pluginName?: string,
    subGroup?: string
}>(), {
    icons: () => ({}),
    plugins: () => [],
    pluginName: undefined,
    subGroup: undefined
});

const pluginsWithoutDeprecated = computed(() => getPluginsWithoutDeprecated(props.plugins || []) as any[]);

function navigateTo(url: string) {
    window.location.assign(url);
}
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .plugin-index {
        :deep(div):has(> .row-link) {
            gap: var(--spacer);
        }

        :deep(.elements-section) {
            gap: calc(2 * var(--spacer));
        }

        :deep(.row-link) {
            padding: calc(.5 * var(--spacer)) calc(2 * var(--spacer));
            background: var(--kestra-io-token-color-background-secondary);
            color: var(--kestra-io-token-color-white);
            border: 1px solid var(--kestra-io-token-color-border-secondary);

            &:hover, &:focus {
                outline: none;
                background: var(--kestra-io-neutral-gray300);
                border: 1px solid var(--tokens-border-border-active);

                .material-design-icon {
                    color: var(--kestra-io-neutral-white);
                }
            }

            img {
                width: 3.375rem;
                height: 3.375rem;
            }

            .material-design-icon {
                color: var(--kestra-io-neutral-gray700);

                &, & * {
                    width: 1.5rem;
                    height: 1.5rem;
                    bottom: 0;
                }
            }
        }
    }

        .plugin-schema {
        :deep(hr) {
            opacity: 1;
            border-top: calc(2 * var(--bs-border-width)) solid var(--kestra-io-token-color-border-secondary);
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

        :deep(.language), :deep(.copy) {
            color: var(--kestra-io-neutral-gray700) !important;
        }

        :deep(#copied-tooltip) {
            background: $gray-500;
            color: #fff;
        }

        :deep(.markdown) {
            display: flex;
            flex-direction: column;
            gap: var(--spacer);
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

            .border, .property:not(:first-child) {
                border-color: var(--kestra-io-token-color-border-secondary) !important;
            }

            .collapse-button {
                font-size: var(--font-size-lg);
                line-height: 1.5rem;
                color: var(--kestra-io-token-color-white);
            }

            > .collapse-button {
                line-height: 2.375rem;

                &:not(.collapsed) {
                    color: var(--kestra-io-token-text-link-default);

                    & .material-design-icon {
                        background-color: var(--kestra-io-neutral-gray400);
                    }
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

                .property-description p {
                    color: var(--kestra-io-neutral-gray700);
                }

                > *:not(:first-child) {
                    border-top: var(--bs-border-width) var(--bs-border-style) var(--kestra-io-token-color-border-secondary);
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
</style>