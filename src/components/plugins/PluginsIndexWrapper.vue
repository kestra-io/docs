<script lang="ts" setup>
    import { onMounted, onUnmounted, ref } from "vue"
    import { navigate } from "astro:transitions/client"

    import { type Plugin, type PluginMetadata } from "@kestra-io/ui-libs"
    import PluginIndex from "@kestra-io/ui-libs/src/components/plugins/PluginIndex.vue"

    import MDCParserAndRenderer from "../MDCParserAndRenderer.vue"

    const activeId = ref("")

    const updateActiveId = () => {
        activeId.value = window.location.hash.substring(1).toLowerCase()
    }

    const handleHashLinkClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement).closest('a[href^="#"]')
        if (anchor) {
            requestAnimationFrame(updateActiveId)
        }
    }

    const events: [string, EventListener][] = [
        ["hashchange", updateActiveId],
        ["popstate", updateActiveId],
        ["click", handleHashLinkClick as EventListener],
    ]

    onMounted(() => {
        updateActiveId()
        events.forEach(([event, handler]) =>
            window.addEventListener(event, handler),
        )
    })

    onUnmounted(() => {
        events.forEach(([event, handler]) =>
            window.removeEventListener(event, handler),
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

<style lang="scss" scoped>
    :deep(div.description) {
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;

        h3 {
            margin-top: 0 !important;
        }
    }

    :deep(#how-to-use-this-plugin) {
        margin-top: 2rem;
    }

    :deep(.icon-content) {
        background: $white !important;
    }
</style>