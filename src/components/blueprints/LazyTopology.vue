<template>
    <div ref="rootRef" class="topology-root w-100 h-100">
        <component
            :is="AsyncTopology"
            v-if="visible"
            :flow-graph="flowGraph"
            :source="source"
            :id="id"
        />
    </div>
</template>

<script setup lang="ts">
    import { defineAsyncComponent, onBeforeUnmount, onMounted, ref } from "vue"

    // The real topology pulls @kestra-io/topology + @vue-flow/core (~1.1 MB).
    // Keep it out of the initial bundle: this wrapper is a tiny client:only
    // shell, and the heavy chunk is dynamically imported only once the panel
    // scrolls near the viewport. Mobile visitors who never reach the graph
    // never download it.
    const AsyncTopology = defineAsyncComponent(
        () => import("./Topology.client.vue"),
    )

    defineProps<{
        flowGraph: unknown
        source: string
        id: string | number
    }>()

    const rootRef = ref<HTMLDivElement | null>(null)
    const visible = ref(false)
    let observer: IntersectionObserver | undefined

    onMounted(() => {
        if (
            typeof IntersectionObserver === "undefined" ||
            !rootRef.value
        ) {
            visible.value = true
            return
        }

        observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    visible.value = true
                    observer?.disconnect()
                }
            },
            { rootMargin: "200px" },
        )
        observer.observe(rootRef.value)
    })

    onBeforeUnmount(() => observer?.disconnect())
</script>
