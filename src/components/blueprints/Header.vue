<template>
    <section class="container-fluid">
        <div class="container">
            <div class="header">
                <a class="breadcrumb" href="/blueprints">Blueprints</a>
                <div class="row">
                    <div class="col-12 col-md-9">
                        <h2>{{ page.title }}</h2>
                    </div>
                    <div class="col-12 col-md-3">
                        <div class="justify-content-start d-flex justify-content-md-end">
                            <Copy :code="page.flow" />
                        </div>
                    </div>
                </div>
                <div class="pt-3">
                    <div class="card">
                        <div class="card-body">
                            <Topology
                                :flow-graph="graph"
                                :source="page.flow"
                                :id="page.id"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import Topology from "~/components/blueprints/Topology.client.vue"
    import Copy from "~/components/common/Copy.vue"

    defineProps<{
        slug?: string
        page: {
            id: string | number
            title: string
            flow: string
            includedTasks?: string[]
        }
        graph: any
    }>()
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .container-fluid {
        position: relative;
        padding: calc($spacer * 5) 0;
        background: var(--ks-background-body) url("./assets/mask.svg") no-repeat center right;
        overflow: hidden;
        &::before {
            content: "";
            position: absolute;
            width: 234px;
            height: 307px;
            background: linear-gradient(140deg, rgba(70, 24, 255, 0) -41.95%, rgba(126, 28, 250, 0.4) 77.28%);
            filter: blur(80px);
            z-index: 0;
            top: 150px;
            right: 130px;
            pointer-events: none;
        }
        .breadcrumb {
            color: var(--ks-content-primary);
            font-size: $font-size-sm;
            font-weight: 600;
        }
        h2 {
            color: var(--ks-content-primary);
        }
        .nav-tabs {
            border-bottom: 1px solid var(--ks-border-primary);
        }
        .nav-link {
            color: var(--ks-content-primary);
            cursor: pointer;
            &:hover {
                border-color: transparent;
            }
            &.active {
                color: var(--ks-content-color-highlight) !important;
                background-color: transparent !important;
                border-color: transparent;
                border-bottom: 2px solid var(--ks-content-color-highlight);
                &:hover {
                    border-bottom-color: var(--ks-content-color-highlight);
                }
            }
        }
        .card {
            border-radius: 8px;
            border: $block-border;
            overflow: clip;
            .card-body {
                padding: 0;
                background-color: var(--ks-background-tertiary);
            }
        }
    }


</style>