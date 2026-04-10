<template>
    <div v-if="plugins.length > 0" class="more">
        <div class="header">
            <h2 id="more-plugins-in-this-category">More Plugins in this Category</h2>

            <NavActions
                :items="plugins"
                :page-size="PAGE_SIZE"
                :show="plugins.length > PAGE_SIZE"
                @page-changed="startIndex = $event"
            />
        </div>

        <div class="row g-3">
            <div
                v-for="plugin in visiblePlugins"
                :key="`plugin-${plugin.className ?? plugin.title}`"
                class="col-md-6"
            >
                <PluginCard :plugin="pluginToInfo(plugin)" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from "vue"
    import type { CardPlugin } from "~/utils/plugins/pruneForClient"
    import PluginCard from "~/components/plugins/PluginCard.vue"
    import NavActions from "~/components/common/NavActions.vue"

    const { plugins = [] } = defineProps<{
        plugins: CardPlugin[]
    }>()

    const pluginToInfo = (plugin: CardPlugin): PluginInformation => ({
        ...plugin,
        elementCounts: plugin.elementCounts ?? 0,
        blueprints: plugin.blueprints ?? 0,
    })

    const PAGE_SIZE = 2
    const startIndex = ref(0)

    const visiblePlugins = computed(() =>
        plugins.slice(startIndex.value, startIndex.value + PAGE_SIZE),
    )
</script>

<style scoped lang="scss">
    .more {
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
    }
</style>