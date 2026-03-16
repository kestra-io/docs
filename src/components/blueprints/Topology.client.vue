<template>
    <div ref="rootRef" class="topology-root w-100 h-100">
        <Topology
            class="w-100 h-100"
            :flow-graph="flowGraph"
            :id="String(id)"
            :source="source"
            :enable-subflow-interaction="false"
            :is-horizontal="false"
            :icon-component="TaskIcon"
        />
    </div>
</template>

<script setup lang="ts">
    import { getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref } from "vue"
    import { Topology } from "@kestra-io/ui-libs"
    import { useVueFlow } from "@vue-flow/core"
    import TaskIcon from "~/components/common/TaskIcon.vue"

    const props = defineProps<{
        flowGraph: any
        source: string
        id: string | number
    }>()
    const rootRef = ref<HTMLDivElement | null>(null)
    const { fitView } = useVueFlow(String(props.id))
    let resizeObserver: ResizeObserver | undefined
    let resizeTimeout: ReturnType<typeof setTimeout> | undefined

    const fitTopologyView = async () => {
        await nextTick()

        if (resizeTimeout) {
            clearTimeout(resizeTimeout)
        }

        resizeTimeout = setTimeout(() => {
            fitView()
        }, 80)
    }

    onMounted(() => {
        if (!rootRef.value) {
            return
        }

        resizeObserver = new ResizeObserver(() => {
            fitTopologyView()
        })
        resizeObserver.observe(rootRef.value)
    })

    onBeforeUnmount(() => {
        resizeObserver?.disconnect()
        if (resizeTimeout) {
            clearTimeout(resizeTimeout)
        }
    })

    // Mock i18n for topology
    const currentInstance = getCurrentInstance()
    if (currentInstance) {
        currentInstance.appContext.config.globalProperties.$t = (key: string) =>
            key
    }
</script>

<style scoped lang="scss">


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

    :deep(.text-color) {
        color: var(--ks-content-primary) !important;
    }
</style>
