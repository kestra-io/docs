<template>
    <div v-if="relatedPlugins.length > 0" class="more">
            <div class="header">
                <h4 id="more-plugins-in-this-category">More Plugins in this Category</h4>
                <div class="nav-actions" v-if="relatedPlugins.length > pageSize">
                    <button class="btn-nav prev" :disabled="isFirstPage" @click="prev" aria-label="Previous plugins">
                        <ChevronLeft />
                    </button>
                    <button class="btn-nav next" :disabled="isLastPage" @click="next" aria-label="Next plugins">
                        <ChevronRight />
                    </button>
                </div>
            </div>

        <div class="row g-3">
                <div
                    class="col-md-4 col-lg-6 col-xl-6 col-xxl-4"
                    v-for="plugin in visiblePlugins"
                    :key="`plugin-${slugify(plugin.group ?? plugin.name)}${plugin.subGroup ? '-' + slugify(subGroupName(plugin)) : ''}`"
                >
                    <PluginsPluginCard 
                        :plugin="plugin" 
                        :icons="icons" 
                        :blueprints-count="getPluginBlueprintCount(plugin)" 
                    />
                </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, watch, ref } from "vue";
    import { useMediaQuery } from "@vueuse/core";
    import { slugify, filterPluginsWithoutDeprecated, subGroupName, type Plugin } from "@kestra-io/ui-libs";
    import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue";
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue";
    import PluginsPluginCard from "./PluginCard.vue";

    const props = withDefaults(defineProps<{
        allPlugins?: Plugin[];
        currentPluginName: string;
        currentCategories: string[];
        icons?: Record<string, any>;
    }>(), {
        allPlugins: () => []
    });

    const pluginsWithoutDeprecated = computed(() => filterPluginsWithoutDeprecated(props.allPlugins ?? []));

    const relatedPlugins = computed(() => {
        if (!props.currentCategories?.length) return [];

        return pluginsWithoutDeprecated.value.filter((plugin: Plugin) =>
            plugin.subGroup === undefined &&
            plugin.name !== props.currentPluginName &&
            plugin.categories?.some((cat: string) => props.currentCategories.includes(cat))
        );
    });

    const { countsByPlugin: pluginBlueprintCounts } = await useBlueprintsCounts();

    const getPluginBlueprintCount = (plugin: Plugin) => pluginBlueprintCounts.value?.[slugify(plugin.group ?? plugin.name)] ?? 0;

    const isTwoPerRowScreen = useMediaQuery('(min-width: 992px) and (max-width: 1399px)');

    const pageSize = computed(() => isTwoPerRowScreen.value ? 4 : 3);

    import {useSimplePagination} from "../../utils/pluginFormat";

    const {currentPage, total, isFirstPage, isLastPage, prev, next, visibleItems} = useSimplePagination(relatedPlugins, pageSize);

    const visiblePlugins = visibleItems;
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

            .nav-actions {
                display: flex;
                gap: 0.5rem;
                align-items: center;

                .btn-nav {
                    width: 40px;
                    height: 32px;
                    border: 1px solid var(--ks-border-secondary);
                    background: var(--kestra-io-neutral-gray300);
                    padding: 8px 12px;
                    border-radius: 4px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: var(--ks-content-primary);
                    transition: background-color 0.12s ease;

                    &:disabled {
                        opacity: 0.35;
                        cursor: not-allowed;
                    }

                    :deep(svg) {
                        bottom: 0 !important;
                    }
                }
            }
        }
    }
</style>