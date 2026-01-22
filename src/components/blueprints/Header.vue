<template>
    <div class="main">
        <div class="container-fluid pt-5">
            <div class="container">
                <div class="header">
                    <a class="breadcrumb" to="/blueprints">Blueprints</a>
                    <div class="row">
                        <div class="col-12 col-md-9">
                            <h2>{{ page.title }}</h2>
                        </div>
                        <div class="col-12 col-md-3">
                            <div class="justify-content-start d-flex justify-content-md-end">
                                <BlueprintsCopy :code="page.flow" />
                            </div>
                        </div>
                    </div>
                    <div class="pt-3">
                        <div class="card bg-dark-2">
                            <div class="card-body">
                                <div>
                                    <BlueprintsTopology
                                        :flow-graph="graph"
                                        :source="page.flow"
                                        :id="page.id"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import BlueprintsTopology from "~/components/blueprints/Topology.client.vue"
    import BlueprintsCopy from "~/components/blueprints/Copy.vue"

    defineProps<{
        slug?: string
        page: {
            id: string
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
        padding-bottom: calc($spacer * 7);
        background: url("./assets/mask.svg") no-repeat center right;

        .nav-tabs {
            border-bottom: 1px solid $black-6;
        }

        .nav-link {
            color: $white;
            cursor: pointer;

            &:hover {
                border-color: transparent;
            }
        }

        .active {
            color: $purple-36 !important;
            background-color: transparent !important;
            border-color: transparent;
            border-bottom-color: $purple-36;

            &:hover {
                border-bottom-color: $purple-36;
            }
        }

        .breadcrumb {
            color: #cdd5ef;
            font-size: $font-size-sm;
            font-weight: 600;
        }

        h2 {
            color: $white;
            font-size: $h2-font-size;
            font-weight: 400;
        }

        .card {
            border-radius: 8px;
            border: 1px solid $black-6;
            &::before {
                content: "";
                position: absolute;
                width: 234px;
                height: 307px;
                background: linear-gradient(140deg, rgba(70, 24, 255, 0) -41.95%, #7e1cfa 77.28%);
                filter: blur(100px);
                right: 2rem;
                top: 2rem;
                z-index: -1;
                @include media-breakpoint-down(md) {
                    width: 134px;
                }
            }
            .card-body {
                padding: 0;
            }
        }
    }

    :deep(.bd-markdown) {
        .code-block {
            margin-bottom: 0 !important;
        }
    }
</style>