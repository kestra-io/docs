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
    import TaskIcon from "../common/TaskIcon.vue";
</script>

<script>
    import {Topology} from '@kestra-io/ui-libs'

    export default {
        components: {Topology},
        props: {
            flowGraph: {
                type: Object,
                required: true,
                default: () => ({})
            },
            source: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .topology-root {
        width: 100%;
        height: calc($spacer * 19.875);
    }


    :deep(.node-wrapper) {
        background-color: var(--bs-body-color);
        border: $container-border !important;

        .task-title {
            color: $white !important;
        }
    }

    :deep(.node-wrapper.disabled) {
        background-color: var(--bs-body-color);
        opacity: 0.6;
    }

    :deep(.vue-flow__controls) {
        border: $container-border !important;
    }

    :deep(.vue-flow__controls-button) {
        background-color: var(--bs-body-color);
        border-bottom: $container-border !important;
        color: $white !important;
    }

    :deep(.vue-flow__controls-button svg) {
        fill: $white !important;
    }

    :deep(.dot) {
        color: #9A8EB4 !important;
    }

    :deep(.icon) {
        border: $container-border !important;
    }

    :deep(.bg-white) {
        background-color: $black !important
    }
</style>