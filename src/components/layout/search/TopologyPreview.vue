<template>
    <div ref="rootRef" class="topology-preview">
        <span
            v-for="(icon, index) in floatingIcons"
            :key="icon"
            class="floating-icon"
            :style="floatingStyle(index)"
        >
            <img :src="icon" alt="" width="26" height="26" />
        </span>
        <div class="topology-panel">
            <div class="panel-header">
                <span class="panel-tab"><SitemapOutline /> Topology</span>
                <span v-if="steps > 0" class="panel-chip"
                    >{{ steps }} {{ steps === 1 ? "step" : "steps" }}</span
                >
            </div>
            <div
                class="topology-frame"
                :class="{ focused: hiddenSteps > 0, framed }"
            >
                <Topology
                    v-if="graph"
                    :id="flowId"
                    class="w-100 h-100"
                    :flow-graph="graph"
                    source=""
                    :is-horizontal="false"
                    :is-read-only="true"
                    :enable-subflow-interaction="false"
                />
                <div v-else-if="failed" class="topology-unavailable">
                    <img
                        v-for="icon in floatingIcons"
                        :key="icon"
                        :src="icon"
                        alt=""
                        width="36"
                        height="36"
                    />
                </div>
                <span v-if="hiddenSteps > 0" class="more-steps"
                    >+{{ hiddenSteps }} more
                    {{ hiddenSteps === 1 ? "step" : "steps" }}</span
                >
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onBeforeUnmount, ref } from "vue"
    import { Topology } from "@kestra-io/topology"
    import "@kestra-io/topology/standalone.css"
    import "@kestra-io/topology/style.css"
    import { useVueFlow, type GraphNode } from "@vue-flow/core"
    import SitemapOutline from "vue-material-design-icons/SitemapOutline.vue"
    import { useDeferredLoad } from "~/composables/useDeferredLoad"
    import { useTopologyIsland } from "~/composables/useTopologyIsland"
    import {
        isBlueprintGraphLoaded,
        loadBlueprintGraph,
    } from "~/utils/search/blueprintGraph"
    import { PLUGIN_PACKAGE } from "~/utils/search/matching"

    type FlowGraph = {
        nodes: {
            uid: string
            task?: { type: string }
            triggerDeclaration?: { type: string }
        }[]
    }

    const props = defineProps<{
        id: string
        icons: string[]
        focus: string[]
    }>()

    // Cards stay well above the zoom where the topology turns tasks into compact pills (0.5).
    const CARD_ZOOM = 0.7
    const STANDARD_ZOOM = 0.8
    const GROUP_SIZE = 3
    const NEAR = 320
    const MARGIN = 48
    const FLOATING_POSITIONS = [
        [-3, 30, -6],
        [100, 18, 6],
        [-3, 62, 4],
        [100, 52, -5],
        [100, 84, 3],
    ]

    useTopologyIsland()

    const flowId = `search-preview-${props.id}`
    const rootRef = ref<HTMLDivElement | null>(null)
    const steps = ref(0)
    const hiddenSteps = ref(0)
    const framed = ref(false)
    const floatingIcons = computed(() =>
        props.icons.slice(0, FLOATING_POSITIONS.length),
    )
    const floatingStyle = (index: number) => {
        const [left, top, rotate] = FLOATING_POSITIONS[index]
        return {
            left: `calc(${left}% - 22px)`,
            top: `calc(${top}% - 22px)`,
            "--rotate": `${rotate}deg`,
            "--delay": `${index * 0.6}s`,
        }
    }

    const { value: graph, failed } = useDeferredLoad(
        () => loadBlueprintGraph(props.id) as Promise<FlowGraph>,
        () => isBlueprintGraphLoaded(props.id),
    )

    const { getNodes, setViewport, fitView, onNodesInitialized } =
        useVueFlow(flowId)

    const isStep = (node: GraphNode) =>
        (node.type === "task" || node.type === "trigger") &&
        node.dimensions.width > 40

    type Box = { x0: number; y0: number; x1: number; y1: number }
    const boxOf = (list: GraphNode[]): Box => ({
        x0: Math.min(...list.map((n) => n.computedPosition.x)),
        y0: Math.min(...list.map((n) => n.computedPosition.y)),
        x1: Math.max(
            ...list.map((n) => n.computedPosition.x + n.dimensions.width),
        ),
        y1: Math.max(
            ...list.map((n) => n.computedPosition.y + n.dimensions.height),
        ),
    })
    const centerOf = (n: GraphNode) => [
        n.computedPosition.x + n.dimensions.width / 2,
        n.computedPosition.y + n.dimensions.height / 2,
    ]
    const distance = (a: GraphNode, b: GraphNode) => {
        const [ax, ay] = centerOf(a)
        const [bx, by] = centerOf(b)
        return Math.hypot(ax - bx, ay - by)
    }

    // Fits a small graph whole, else centres the main plugin's task and up to two neighbours.
    const frame = async () => {
        const nodes = getNodes.value.filter((node) => node.dimensions.width > 0)
        const rect = rootRef.value
            ?.querySelector(".topology-frame")
            ?.getBoundingClientRect()
        if (!nodes.length || !rect) return
        const width = rect.width - MARGIN
        const height = rect.height - MARGIN
        const fitsAt = (box: Box, zoom: number) =>
            (box.x1 - box.x0) * zoom <= width &&
            (box.y1 - box.y0) * zoom <= height
        const stepNodes = nodes.filter(isStep)
        steps.value = stepNodes.length

        if (fitsAt(boxOf(nodes), CARD_ZOOM) || !stepNodes.length) {
            await fitView({
                padding: 0.15,
                minZoom: CARD_ZOOM,
                maxZoom: STANDARD_ZOOM,
            })
            hiddenSteps.value = 0
            framed.value = true
            return
        }

        const taskTypes = new Map(
            (graph.value?.nodes ?? []).map((n) => [
                n.uid,
                (n.task?.type ?? n.triggerDeclaration?.type ?? "").replace(
                    PLUGIN_PACKAGE,
                    "",
                ),
            ]),
        )
        const focus = new Set(props.focus)
        const isFocus = (n: GraphNode) => focus.has(taskTypes.get(n.id) ?? "")
        const reading = [...stepNodes].sort(
            (a, b) =>
                a.computedPosition.y - b.computedPosition.y ||
                a.computedPosition.x - b.computedPosition.x,
        )
        const anchor =
            reading.find(isFocus) ??
            reading.find((n) => n.type === "task") ??
            reading[0]
        const group = [anchor]
        const neighbours = stepNodes
            .filter((n) => n !== anchor && distance(n, anchor) <= NEAR)
            .sort(
                (a, b) =>
                    Number(isFocus(b)) - Number(isFocus(a)) ||
                    distance(a, anchor) - distance(b, anchor),
            )
        for (const node of neighbours) {
            if (group.length >= GROUP_SIZE) break
            if (fitsAt(boxOf([...group, node]), CARD_ZOOM)) group.push(node)
        }

        const box = boxOf(group)
        const zoom = Math.max(
            CARD_ZOOM,
            Math.min(
                STANDARD_ZOOM,
                width / (box.x1 - box.x0),
                height / (box.y1 - box.y0),
            ),
        )
        const viewport = {
            x: rect.width / 2 - ((box.x0 + box.x1) / 2) * zoom,
            y: rect.height / 2 - ((box.y0 + box.y1) / 2) * zoom,
            zoom,
        }
        await setViewport(viewport)
        framed.value = true
        hiddenSteps.value = stepNodes.filter((n) => {
            const left = n.computedPosition.x * zoom + viewport.x
            const top = n.computedPosition.y * zoom + viewport.y
            return (
                left < 0 ||
                top < 0 ||
                left + n.dimensions.width * zoom > rect.width ||
                top + n.dimensions.height * zoom > rect.height
            )
        }).length
    }

    let frameTimer: ReturnType<typeof setTimeout> | undefined
    onNodesInitialized(() => {
        frameTimer = setTimeout(frame, 50)
    })
    onBeforeUnmount(() => clearTimeout(frameTimer))
</script>

<style scoped lang="scss">
    .topology-preview {
        position: relative;
        width: min(100%, 440px);
        height: 450px;
        margin: 0.5rem auto 0;
    }

    .topology-panel {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        border: 1px solid var(--ks-border-primary);
        border-radius: 12px;
        background: var(--ks-background-body);
        box-shadow:
            0 1px 2px rgba(16, 24, 40, 0.04),
            0 12px 32px rgba(16, 24, 40, 0.08);
        overflow: hidden;
    }

    .panel-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: 8px 12px 0;
        border-bottom: 1px solid var(--ks-border-primary);
        background: var(--ks-background-secondary);

        .panel-tab {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            margin-bottom: -1px;
            font-size: $font-size-sm;
            font-weight: 600;
            color: var(--ks-content-primary);
            background: var(--ks-background-body);
            border: 1px solid var(--ks-border-primary);
            border-bottom-color: var(--ks-background-body);
            border-radius: 8px 8px 0 0;

            :deep(svg) {
                width: 16px;
                height: 16px;
            }
        }

        .panel-chip {
            align-self: center;
            margin-bottom: 6px;
            font-size: $font-size-xs;
            font-weight: 600;
            padding: 0.15rem 0.6rem;
            border-radius: 6px;
            color: #6a20d8;
            background: rgba(132, 5, 255, 0.08);
            border: 1px solid rgba(132, 5, 255, 0.18);
        }
    }

    .topology-frame {
        position: relative;
        flex: 1;
        min-height: 0;

        :deep(.vue-flow) {
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.18s ease-out;
        }

        &.framed :deep(.vue-flow) {
            opacity: 1;
        }

        &.focused :deep(.vue-flow) {
            mask-image:
                linear-gradient(
                    to bottom,
                    transparent 0,
                    #000 14%,
                    #000 78%,
                    transparent 98%
                ),
                linear-gradient(
                    to right,
                    transparent 0,
                    #000 12%,
                    #000 88%,
                    transparent 100%
                );
            mask-composite: intersect;
        }

        :deep(.vue-flow__panel),
        :deep(.vue-flow__controls),
        :deep(.node-action-button) {
            display: none;
        }
    }

    .topology-unavailable {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .floating-icon {
        position: absolute;
        z-index: 2;
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: $white;
        border: 1px solid var(--ks-border-primary);
        box-shadow:
            0 1px 2px rgba(16, 24, 40, 0.06),
            0 8px 20px rgba(16, 24, 40, 0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        rotate: var(--rotate);
        animation: float 4s ease-in-out var(--delay) infinite;

        img {
            object-fit: contain;
        }

        @media (prefers-reduced-motion: reduce) {
            animation: none;
        }
    }

    .more-steps {
        position: absolute;
        left: 50%;
        bottom: 12px;
        z-index: 3;
        transform: translateX(-50%);
        font-size: $font-size-xs;
        font-weight: 600;
        padding: 0.3rem 0.8rem;
        border-radius: 40px;
        background: var(--ks-background-body);
        border: 1px solid var(--ks-border-primary);
        box-shadow: 0 4px 12px rgba(16, 24, 40, 0.08);
        color: var(--ks-content-primary);
    }

    @keyframes float {
        0%,
        100% {
            translate: 0 0;
        }
        50% {
            translate: 0 -5px;
        }
    }
</style>
