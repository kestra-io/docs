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
                <ul class="nav nav-tabs">
                    <li class="nav-item" @click="setTab('topology')">
                        <span class="nav-link" :class="{ 'active': activeTab === 'topology' }" aria-current="page">Topology</span>
                    </li>
                    <li class="nav-item" @click="setTab('source-code')">
                        <span class="nav-link" :class="{ 'active': activeTab === 'source-code' }">Source Code</span>
                    </li>
                </ul>
                <div class="pt-3">
                    <div class="card bg-dark-2">
                        <div class="card-body">
                            <div v-if="activeTab === 'topology'">
                                <BlueprintsTopology :flow-graph="graph" :source="page.flow" :id="page.id" />
                            </div>
                            <div v-else>
                                <ContentRendererMarkdown
                                    class="bd-markdown"
                                    :value="flow"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="plugins-icons" v-if="page.includedTasks && page.includedTasks.length">
        <p class="text-center">Plugins Used in this Blueprints</p>
        <div class="d-flex justify-content-center gap-3">
            <div class="plugin-icon card bg-dark-2" v-for="icon in page.includedTasks" :key="icon">
                <CommonTaskIcon :cls="icon" />
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

    .plugins-icons {
        p {
            color: $white;
            text-align: center;
            font-size: $h6-font-size;
            font-weight: 400;
        }

        .plugin-icon {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            align-items: center;
            justify-content: center;
            min-width: 134px;
            height: 96px;
            border-radius: 0.5rem;
            font-weight: bold;
            font-size: $font-size-sm;
            border: $block-border;

            :deep(.icon-wrapper) {
                width: 45px;
                height: 45px;
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