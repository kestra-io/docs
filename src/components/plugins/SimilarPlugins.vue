<template>
    <div v-if="pluginsInfo && pluginsInfo.length > 0" class="more">
        <div class="header">
            <h4 id="more-plugins-in-this-category">More Plugins in this Category</h4>
            <NavActions
                :items="pluginsInfo"
                :page-size="pageSize"
                :show="pluginsInfo.length > pageSize"
                @page-changed="startIndex = $event"
            ></NavActions>
        </div>

        <div class="row g-3">
            <div
                class="col-md-4 col-lg-6 col-xl-6 col-xxl-4"
                v-for="plugin in visiblePlugins"
                :key="`plugin-${slugify(plugin.className ?? plugin.title)}`"
            >
                <PluginCard :plugin="plugin"></PluginCard>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref } from "vue"
    import { useMediaQuery } from "@vueuse/core"
    import { slugify, type Plugin } from "@kestra-io/ui-libs"
    import PluginCard from "~/components/plugins/PluginCard.vue"
    import NavActions from "~/components/common/NavActions.vue"

    const props = withDefaults(
        defineProps<{
            similarPlugins?: Plugin[]
            pluginsData: Record<string, PluginInformation>
        }>(),
        {},
    )

    const pluginsInformation = (plugin: Plugin): PluginInformation => {
        const pluginInfo = props.pluginsData?.[plugin.subGroup ?? plugin.group ?? plugin.name]
        return {
            name: plugin.name,
            subGroupTitle: plugin?.title,
            title: pluginInfo?.title,
            description: pluginInfo?.description ?? plugin.description,
            categories: pluginInfo?.categories,
            icon: pluginInfo?.icon,
            elementCounts: pluginInfo?.elementCounts,
            blueprints: pluginInfo?.blueprints,
            className: pluginInfo?.className,
            subGroup: plugin.subGroup,
        }
    }

    const isTwoPerRowScreen = useMediaQuery("(min-width: 992px) and (max-width: 1399px)")

    const pageSize = computed(() => (isTwoPerRowScreen.value ? 4 : 3))

    const startIndex = ref(0)

    const pluginsInfo = computed(() => props.similarPlugins?.map(pluginsInformation) ?? [])
    const visiblePlugins = computed(() =>
        pluginsInfo.value.slice(startIndex.value, startIndex.value + pageSize.value),
    )
</script>
<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .more {
        border-top: $block-border;
        padding: 2rem 0;
        @include media-breakpoint-up(lg) {
            margin-left: -2rem;
            margin-right: -2rem;
            padding-left: 2rem;
            padding-right: 2rem;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            h4 {
                font-size: 20px;
                font-weight: 600;
                margin: 0;
                color: var(--ks-content-primary);
                padding-top: 0;
            }
        }
    }
</style>