<template>
    <div v-if="similarPlugins.length > 0" class="more">
            <div class="header">
                <h4 id="more-plugins-in-this-category">More Plugins in this Category</h4>
                <NavActions 
                    @item-changed="visiblePlugins = $event"
                    :items="similarPlugins"
                    :page-size="pageSize"
                    :show="similarPlugins.length > pageSize"
                />
            </div>

        <div class="row g-3">
                <div
                    class="col-md-4 col-lg-6 col-xl-6 col-xxl-4"
                    v-for="plugin in visiblePlugins"
                    :key="`plugin-${slugify(plugin.group ?? plugin.name)}${plugin.subGroup ? '-' + slugify(subGroupName(plugin)) : ''}`"
                >
                    <PluginCard 
                        :plugin="plugin" 
                        :icons="icons" 
                        :blueprints-count="getPluginBlueprintCount(plugin)"
                        :metadata-map="metadataMap"
                    />
                </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {computed, ref, watch} from "vue";
    import {useMediaQuery} from "@vueuse/core";
    import {slugify, filterPluginsWithoutDeprecated, subGroupName, type Plugin, type PluginMetadata} from "@kestra-io/ui-libs";
    import PluginCard from "./PluginCard.vue";
    import NavActions from "~/components/common/NavActions.vue";

    const props = withDefaults(defineProps<{
        allPlugins?: Plugin[];
        currentPluginName: string;
        currentCategories: string[];
        icons?: Record<string, any>;
        metadataMap?: Record<string, PluginMetadata>;
    }>(), {
        allPlugins: () => [],
        metadataMap: undefined
    });

    const similarPlugins = computed(() => {
        if (!props.currentCategories?.length) return [];

        const filtered = filterPluginsWithoutDeprecated(props.allPlugins ?? []);
        return filtered.filter((plugin: Plugin) =>
                plugin.subGroup === undefined &&
                plugin.name !== props.currentPluginName &&
                plugin.categories?.some((cat: string) => props.currentCategories.includes(cat))
            );
    });

    const { countsByPlugin: pluginBlueprintCounts } = await useBlueprintsCounts();

    const getPluginBlueprintCount = (plugin: Plugin) => pluginBlueprintCounts.value?.[slugify(plugin.group ?? plugin.name)] ?? 0;

    const isTwoPerRowScreen = useMediaQuery('(min-width: 992px) and (max-width: 1399px)');

    const pageSize = computed(() => isTwoPerRowScreen.value ? 4 : 3);

    const visiblePlugins = ref<Plugin[]>([]);

    watch(similarPlugins, (newPlugins) => {
        visiblePlugins.value = newPlugins.slice(0, pageSize.value);
    }, {immediate: true});

</script>

<style scoped lang="scss">
    @import "../../assets/styles/variable";

    .more {
        border-top: 1px solid var(--kestra-io-token-color-border-secondary);
        padding: 2rem 0;

        @include media-breakpoint-up(lg) {
            margin-left: -3rem;
            margin-right: -3rem;
            padding-left: 3rem;
            padding-right: 3rem;
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