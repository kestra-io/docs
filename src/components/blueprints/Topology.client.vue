<template>
    <Topology
        class="topology-root"
        :flow-graph="flowGraph"
        :id="id"
        :source="source"
        :enable-subflow-interaction="false"
        :icon-component="TaskIcon"
    />
</template>

<script setup>
    import { getCurrentInstance } from "vue"
    import TaskIcon from "~/components/common/TaskIcon.vue"
    // Mock i18n for topology
    const currentInstance = getCurrentInstance()
    if (currentInstance) {
        currentInstance.appContext.config.globalProperties.$t = (key) => key
    }
</script>

<script>
    import { Topology } from "@kestra-io/ui-libs"

    export default {
        components: { Topology },
        props: {
            flowGraph: {
                type: Object,
                required: true,
                default: () => ({}),
            },
            source: {
                type: String,
                required: true,
            },
            id: {
                type: [String, Number],
                required: true,
            },
        },
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .topology-root {
        width: 100%;
        height: calc($spacer * 19.875);
    }

    :deep(.node-wrapper) {
        border: $block-border !important;
        box-shadow: var(--ks-shadows-light);
        .task-title {
            color: var(--ks-content-primary) !important;
        }
    }

    :deep(.node-wrapper.disabled) {
        background-color: var(--ks-background-tertiary);
        opacity: 0.6;
    }

    :deep(.vue-flow__controls) {
        border: $container-border !important;
    }

    :deep(.vue-flow__controls-button) {
        background-color: var(--ks-background-tertiary);
        border-bottom: $container-border !important;
        color: var(--ks-content-primary) !important;
    }

    :deep(.vue-flow__controls-button svg) {
        fill: var(--ks-content-primary) !important;
    }

    :deep(.dot) {
        color: var(--ks-content-primary) !important;
    }

    :deep(.icon) {
        border: $container-border !important;
    }

    :deep(.bg-white) {
        background-color: var(--ks-background-body) !important;
    }
</style>