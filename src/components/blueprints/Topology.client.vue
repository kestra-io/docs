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
    import { defineComponent, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, provide, ref } from "vue"
    import { createI18n } from "vue-i18n"
    import { Topology } from "@kestra-io/topology"
    import "@kestra-io/topology/standalone.css"
    import "@kestra-io/topology/style.css"
    import { TASK_ICON_INJECTION_KEY } from "@kestra-io/design-system"
    import { useVueFlow } from "@vue-flow/core"
    import TaskIcon from "~/components/common/TaskIcon.vue"

    const props = defineProps<{
        flowGraph: any
        source: string
        id: string | number
    }>()

    /** The graph passes the whole task-icon contract (icons, loadIcon...); the docs icon only
     *  needs the class, so the rest is dropped instead of landing on the DOM. */
    const GraphTaskIcon = defineComponent({
        inheritAttrs: false,
        props: { cls: { type: String, default: "" }, onlyIcon: { type: Boolean, default: false } },
        setup: (iconProps) => () => h(TaskIcon, { cls: iconProps.cls, onlyIcon: iconProps.onlyIcon }),
    })
    provide(TASK_ICON_INJECTION_KEY, GraphTaskIcon)

    // The graph translates its labels; only this island needs vue-i18n.
    getCurrentInstance()?.appContext.app.use(createI18n({ legacy: false, locale: "en", messages: {} }))

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
