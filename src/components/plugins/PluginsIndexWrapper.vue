<script lang="ts" setup>
    import { ref, onMounted, onUnmounted } from "vue"
    import { navigate } from "astro:transitions/client"
    import { type Plugin, type PluginMetadata } from "@kestra-io/ui-libs"
    import PluginIndex from "@kestra-io/ui-libs/src/components/plugins/PluginIndex.vue"
    import MDCParserAndRenderer from "../MDCParserAndRenderer.vue"

    const activeId = ref("")

    const updateActiveId = () => {
        activeId.value = window.location.hash.substring(1).toLowerCase()
    }

    const events = ["hashchange", "popstate"]

    onMounted(() => {
        updateActiveId()
        events.forEach((event) =>
            window.addEventListener(event, updateActiveId),
        )
    })

    onUnmounted(() => {
        events.forEach((event) =>
            window.removeEventListener(event, updateActiveId),
        )
    })

    defineProps<{
        routePath: string
        pluginType?: string
        icons: Record<string, string>
        plugins: Plugin[]
        pluginName: string
        subGroup?: string
        subgroupBlueprintCounts?: Record<string, number>
        metadataMap?: Record<string, PluginMetadata>
        schemas?: Record<string, { title?: string }>
    }>()
</script>

<template>
    <PluginIndex
        v-if="pluginType === undefined"
        :icons
        :plugins
        :plugin-name
        :sub-group
        :route-path
        :subgroup-blueprint-counts
        :metadata-map
        :schemas
        :active-id="activeId"
        @navigate="navigate"
    >
        <template #markdown="{ content }">
            <MDCParserAndRenderer :content />
        </template>
    </PluginIndex>
</template>
