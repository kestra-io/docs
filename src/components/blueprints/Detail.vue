<template>
    <section>
        <div class="container-xxl">
            <div class="wrapper">
                <div class="snippets">
                    <Snippets
                        :code="flow"
                        lang="yaml"
                        :expand-threshold="25"
                    />
                </div>
                <div class="topology">
                    <div class="card">
                        <div class="card-body">
                            <Topology
                                :flow-graph="graph"
                                :source="flow"
                                :id="page.id"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <BlueprintMarkdown
        :page="page"
        :description="description"
    />
</template>

<script setup lang="ts">
    import Snippets from "~/components/common/Snippets.vue"
    import BlueprintMarkdown from "~/components/blueprints/BlueprintMarkdown.vue"
    import Topology from "~/components/blueprints/Topology.client.vue"

    defineProps<{
        page: {
            id: string | number;
            title: string;
            includedTasks?: string[]
        }
        description: string
        flow: string
        graph?: any
    }>()
</script>

<style lang="scss" scoped>
    $compact-panel-height: 660px;

    section {
        padding: 0 $rem-1;
        background-color: var(--ks-background-primary);
    }

    .wrapper {
        display: flex;
        gap: $rem-1;
        padding-bottom: $rem-4;

        @include media-breakpoint-down(xl) {
            flex-direction: column;
        }

        .snippets {
            flex: 1 1 0;
            min-width: 0;
            min-height: $compact-panel-height;

            @include media-breakpoint-down(xl) {
                flex: 1 1 auto;
                max-width: none;
            }

            :deep(.code-card) {
                height: $compact-panel-height;
                display: flex;
                flex-direction: column;

                &.is-expandable:not(.is-expanded) .code-inner {
                    max-height: none !important;
                    overflow: hidden;
                    mask-image: linear-gradient(
                        to bottom,
                        var(--ks-background-primary) 70%,
                        transparent 100%
                    ) !important;
                }

                &.is-expanded {
                    height: auto;

                    .code-inner {
                        max-height: none !important;
                        overflow: visible;
                        mask-image: none !important;
                    }
                }

                .code-inner {
                    flex: 1;
                }
            }
        }

        :deep(.mdc-renderer pre) {
            padding-bottom: 1rem;
        }

        .topology {
            flex: 0 0 580px;
            max-width: 580px;
            min-width: 0;
            min-height: $compact-panel-height;
            display: flex;
            flex-direction: column;

            @include media-breakpoint-down(xl) {
                max-width: none;
                height: 500px;
                min-height: auto;
                flex: 1 1 auto;
            }

            .card {
                flex: 1;
                border-radius: 8px;
                border: $block-border;
                overflow: clip;

                .card-body {
                    height: 100%;
                    padding: 0;
                    background-color: var(--ks-background-secondary);
                    display: flex;
                    flex-direction: column;

                    & > * {
                        flex: 1;
                    }
                }
            }
        }
    }
</style>
