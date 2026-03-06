<template>
    <Topology
        class="topology-root w-100 h-100"
        :flow-graph="flowGraph"
        :id="String(id)"
        :source="source"
        :enable-subflow-interaction="false"
        :is-horizontal="false"
        :icon-component="TaskIcon"
    />
</template>

<script setup lang="ts">
    import { getCurrentInstance } from "vue"
    import { Topology } from "@kestra-io/ui-libs"
    import TaskIcon from "~/components/common/TaskIcon.vue"

    defineProps<{
        flowGraph: any
        source: string
        id: string | number
    }>()

    // Mock i18n for topology
    const currentInstance = getCurrentInstance()
    if (currentInstance) {
        currentInstance.appContext.config.globalProperties.$t = (key: string) =>
            key
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .topology-root {
        width: 100%;
        height: 100%;
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

    :deep(.vue-flow) {
        width: 100%;
        height: 100%;
    }

    :deep(.bg-white) {
        background-color: var(--ks-background-body) !important;
    }
</style>
