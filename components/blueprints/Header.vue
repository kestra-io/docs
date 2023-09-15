<template>
<div class="main">
    <div class="container-fluid d-flex justify-content-center pt-5">
        <div class="header">
            <DocsBreadcrumb :slug="page.slug" :page-list="[]" />
            <div class="row">
                <div class="col-12 col-md-9">
                    <h2>Event-driven workflow based on a Snowflake query condition</h2>
                </div>
                <div class="col-12 col-md-3">
                    <div class="justify-content-start d-flex justify-content-md-end">
                        <button class="btn btn-primary mb-2">Try this blueprint</button>
                    </div>
                    <div class="justify-content-start d-flex justify-content-md-end">
                        <button class="btn bg-white" @click="copySourceCode">Copy source code</button>
                    </div>
                </div>
            </div>
            <ul class="nav nav-tabs">
                <li class="nav-item" @click="setTab('topology')" role="button">
                    <span class="nav-link" :class="{ 'active': activeTab == 'topology' }" aria-current="page">Topology</span>
                </li>
                <li class="nav-item" @click="setTab('source-code')" role="button">
                    <span class="nav-link" :class="{ 'active': activeTab == 'source-code' }">Source Code</span>
                </li>
            </ul>
            <div class="pt-3">
                <div class="card" v-if="activeTab == 'topology'">
                    <div class="card-body">
                        <div>graph  <!-- topology graph --></div>
                    </div>
                </div>
                <ProsePre :code="page.flow" :language="yaml" v-else><code class="language-yaml">{{ page.flow }}</code></ProsePre>
            </div>
            <p class="text-center my-4">Plugins Used in this Blueprints</p>
        </div>
    </div>
    <div class="plugins-icons d-flex justify-content-center gap-3">
        <div class="plugin-icon card">
            <span>Icon</span>
            <span>EachSequential</span>
        </div>
        <div class="plugin-icon card">
            <span>Icon</span>
            <span>Return</span>
        </div>
        <div class="plugin-icon card">
            <span>Icon</span>
            <span>Triggers</span>
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
        copySourceCode() {
            if(navigator) {
                navigator.clipboard.writeText(this.page.flow)
            }
        }
    },
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
:deep(.slug) {
    @include media-breakpoint-up(xxl) {
        margin-left: 0;
    }
}
.container-fluid {
  background: $purple-17;
  padding-bottom: calc($spacer * 2.5);

  .nav-link {
    color: $dark;
  }
  .active {
    color: $primary !important;
    background-color: transparent !important;
    border-bottom-color: $primary;
  }

  .header {
    width: 80%;
  }
}
.plugins-icons {
  margin-top: -3rem;
  .plugin-icon {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: center;
    justify-content: center;
    width: 134px;
    height: 96px;
    background-color: #fff;
    border-radius: 0.5rem;
    font-weight: bold;
    font-size: $font-size-sm;
  }
}
</style>