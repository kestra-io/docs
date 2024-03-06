<template>
    <div class="main">
        <div class="container-fluid pt-5">
            <div class="container">
                <div class="header">
                    <NuxtLink class="breadcrumb" to="/blueprints">Blueprints</NuxtLink>
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
                                    <BlueprintsTopology :flow-graph="graph" :source="page.flow" :id="page.id" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
    props: {
        page: {
            type: Object,
            required: true
        },
        slug: {
            type: String,
            required: true
        },
        graph: {
            type: Object,
            required: true,
        },
        flow: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            activeTab: 'topology'
        }
    },
    methods: {
        setTab(tabName) {
            this.activeTab = tabName
        },
    }
}
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .container-fluid {
        padding-bottom: calc($spacer * 7);

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
            color: #CDD5EF;
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

            .card-body {
                padding: 0;
            }
        }
    }

    :deep(.slug) {
        @include media-breakpoint-up(xxl) {
            margin-left: 0;
        }

    }

    :deep(.bd-markdown) {
        .code-block {
            margin-bottom: 0 !important;
        }
    }
</style>