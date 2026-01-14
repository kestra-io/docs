<template>
    <div v-if="similarPlugins && similarPlugins.length > 0" class="more">
            <div class="header">
                <h4 id="more-plugins-in-this-category">More Plugins in this Category</h4>
                <NavActions
                    :items="similarPlugins"
                    :page-size="pageSize"
                    :show="similarPlugins.length > pageSize"
                    @page-changed="startIndex = $event"
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
    import {computed, ref} from "vue";
    import {useMediaQuery} from "@vueuse/core";
    import {slugify, subGroupName, type Plugin, type PluginMetadata} from "@kestra-io/ui-libs";
    import PluginCard from "~/components/plugins/PluginCard.vue";
    import NavActions from "~/components/common/NavActions.vue";

    const props = withDefaults(defineProps<{
        similarPlugins?: Plugin[];
        icons?: Record<string, any>;
        metadataMap?: Record<string, PluginMetadata>;
        blueprintCounts: Record<string, number>;
    }>(), {
        allPlugins: () => [],
        metadataMap: undefined
    });

    const getPluginBlueprintCount = (plugin: Plugin) => props.blueprintCounts?.[plugin.group ?? plugin.name] ?? 0;

    const isTwoPerRowScreen = useMediaQuery('(min-width: 992px) and (max-width: 1399px)');

    const pageSize = computed(() => isTwoPerRowScreen.value ? 4 : 3);

    const startIndex = ref(0);

    const visiblePlugins = computed(() => {
        if (!props.similarPlugins) {
            return [];
        }
        return props.similarPlugins.slice(startIndex.value, startIndex.value + pageSize.value);
    });
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .more {
        border-top: 1px solid var(--kestra-io-token-color-border-secondary);
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