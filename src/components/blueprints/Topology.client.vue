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
    import { Topology } from "@kestra-io/topology"
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

    const addControlTooltips = () => {
        const root = rootRef.value
        if (!root) {
            return
        }

        const apply = (el: Element | null, label: string) => {
            if (el && !el.getAttribute("title")) {
                el.setAttribute("title", label)
                el.setAttribute("aria-label", label)
            }
        }

        apply(root.querySelector(".vue-flow__controls-zoomin"), "Zoom in")
        apply(root.querySelector(".vue-flow__controls-zoomout"), "Zoom out")

        // Remaining buttons follow the zoom buttons in DOM order.
        const others = root.querySelectorAll(
            ".vue-flow__controls-button:not(.vue-flow__controls-zoomin):not(.vue-flow__controls-zoomout)",
        )
        const labels = ["Show more details", "Fit", "Download"]
        others.forEach((el, index) => apply(el, labels[index]))
    }

    onMounted(() => {
        if (!rootRef.value) {
            return
        }

        resizeObserver = new ResizeObserver(() => {
            fitTopologyView()
        })
        resizeObserver.observe(rootRef.value)

        nextTick(() => addControlTooltips())
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
        border: 1px solid var(--ks-border-secondary) !important;
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
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 4px;
        background-color: var(--ks-background-body);
        border: $block-border !important;
        border-radius: var(--ks-border-radius);
        box-shadow: var(--ks-shadows-light);
    }

    :deep(.vue-flow__controls-button) {
        padding: 4px;
        border: none !important;
        border-radius: var(--ks-border-radius-sm);
        background: transparent;
        color: var(--ks-content-primary) !important;
    }

    :deep(.vue-flow__controls-button:hover),
    :deep(.vue-flow__controls-button.active) {
        background-color: var(--ks-background-tertiary);
    }

    :deep(.vue-flow__controls-button svg) {
        fill: var(--ks-content-primary) !important;
    }

    :deep(.vue-flow__controls-button) {
        font-size: 12px;
    }

    :deep(.dot) {
        color: var(--ks-content-primary) !important;
    }

    :deep(.icon) {
        border: $container-border !important;
    }

    :deep(.material-design-icon > .material-design-icon__svg) {
        bottom: 0;
    }

    :deep(.vue-flow) {
        width: 100%;
        height: 100%;
    }

    :deep(.bg-white) {
        background-color: var(--ks-background-body) !important;
    }
</style>
