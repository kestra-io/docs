<template>
<div>
    <div class="container-fluid pt-5">
        <div class="row justify-content-center">
            <div class="col-10">
                <p class="top-breadcrumb me-4" data-aos="fade-right">
                    SOLUTIONS > BLUEPRINTS
                </p>
                <div class="row">
                    <div class="col-10">
                        <h2>Event-driven workflow based on a Snowflake query condition</h2>
                    </div>
                    <div class="col-2">
                        <div><button class="btn btn-primary mb-2">Try this blueprint</button></div>
                        <div><button class="btn bg-white">Copy source code</button></div>
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
                <div v-if="activeTab == 'topology'" class="pt-3">
                    <div class="card">
                        <div class="card-body">
                        <!-- topology graph -->
                            graph
                        </div>
                    </div>
                </div>
                <div v-else class="pt-3">
                    <div class="card">
                        <div class="card-body">
                        <!--  source code -->
                            source code
                        </div>
                    </div>
                </div>
                <p class="text-center my-4">Plugins Used in this Blueprints</p>
            </div>
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
    data() {
        return {
            activeTab: 'topology'
        }
    },
    methods: {
        setTab(tabName) {
            this.activeTab = tabName
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.container-fluid {
  background: $purple-17;
  padding-bottom: calc($spacer * 2.5);
  .top-breadcrumb {
    &:after {
        width: 13px;
    }
  }

  .nav-link {
    color: $dark;
  }
  .active {
    color: $primary !important;
    background-color: transparent !important;
    border-bottom-color: $primary;
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