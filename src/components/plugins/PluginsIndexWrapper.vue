<script lang="ts" setup>
    import { ref, onMounted, onUnmounted } from "vue"

    import { navigate } from "astro:transitions/client"
    import { type Plugin, type PluginMetadata } from "@kestra-io/ui-libs"
    import PluginIndex from "@kestra-io/ui-libs/src/components/plugins/PluginIndex.vue"
    import MDCParserAndRenderer from "~/components/MDCParserAndRenderer.vue"

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
    <div class="bd-content ks-plugins-core">
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
                <MDCParserAndRenderer :content class="long" />
            </template>
        </PluginIndex>
    </div>
</template>

<style lang="scss" scoped>
    .ks-plugins-core {
        margin: 0 auto;
        padding: 2rem 0;
        @include media-breakpoint-up(lg) {
            max-width: 100%;
        }
        :deep(.plugin) {
            background-color: var(--ks-background-primary) !important;
            box-shadow: none !important;
            border-color: var(--ks-border-primary);
            &:hover {
                border-color: var(--ks-border-active) !important;
            }
            h6 {
                color: var(--ks-content-primary);
            }
            .description {
                text-transform: none;
            }
        }
        :deep(.element-card) {
            background-color: var(--ks-background-primary) !important;
            border-color: var(--ks-border-primary) !important;
            box-shadow: none !important;
            &:hover {
                border-color: var(--ks-border-active) !important;
            }
            h6 {
                color: var(--ks-content-primary);
            }
            .plugin-info {
                background-color: transparent;
                border: $block-border;
                .plugin-class {
                    color: var(--ks-content-link) !important;
                }
            }
        }

        :deep(code) {
            border: none !important;
            background-color: transparent !important;
        }
    }
</style>
