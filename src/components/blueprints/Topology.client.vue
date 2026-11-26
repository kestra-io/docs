<template>
    <div ref="rootRef" class="topology-root w-100 h-100">
        <Topology
            class="w-100 h-100"
            :flow-graph="flowGraph"
            :id="String(id)"
            :source="source"
            :enable-subflow-interaction="false"
            :is-horizontal="false"
        />
    </div>
</template>

<script setup lang="ts">
    import { nextTick, onBeforeUnmount, onMounted, ref } from "vue"
    import { Topology } from "@kestra-io/topology"
    import "@kestra-io/topology/standalone.css"
    import "@kestra-io/topology/style.css"
    import { useVueFlow } from "@vue-flow/core"
    import { useTopologyIsland } from "~/composables/useTopologyIsland"

    const props = defineProps<{
        flowGraph: any
        source: string
        id: string | number
    }>()

    useTopologyIsland()

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
</script>

<style scoped>
    .topology-root {
        width: 100%;
        height: 100%;
    }

    /* The node menu only emits events (show description, logs...) for the Kestra UI to handle. */
    .topology-root :deep(.node-action-button) {
        display: none;
    }
</style>
