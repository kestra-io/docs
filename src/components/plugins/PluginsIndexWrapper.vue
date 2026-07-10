<script lang="ts" setup>
    import { onMounted, onUnmounted, ref } from "vue"
    import { navigate } from "astro:transitions/client"

    import { type Plugin, type PluginMetadata } from "~/utils/plugins/plugin"
    import PluginIndex from "~/components/plugins/PluginIndex.vue"

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
        showLongDescription?: boolean
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
        :show-long-description
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

    :deep(.more-wrap) {
        display: flex;
        justify-content: flex-end;
        margin: 0 !important;
    }

    :deep(.more-btn) {
        color: var(--ks-content-link) !important;
        background: transparent !important;
        border: none !important;
        padding: 0 !important;
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        gap: 0;
        font-size: $font-size-sm;
        font-family: $font-family-sans-serif;
        span.material-design-icon, span.chevron-down-icon, span.chevron-up-icon {
            display: none !important;
        }

        &::after {
            content: "";
            width: 1rem;
            height: 1rem;
            display: inline-block;
            background-color: currentColor;
            -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctitle%3Echevron-right%3C/title%3E%3Cpath d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z' /%3E%3C/svg%3E");
            mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ctitle%3Echevron-right%3C/title%3E%3Cpath d='M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z' /%3E%3C/svg%3E");
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-size: contain;
            mask-size: contain;
            margin-left: 0.25rem;
            margin-top: 0.125rem;
        }
    }
</style>