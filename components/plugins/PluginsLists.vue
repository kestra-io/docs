<template>
    <section class="wrapper">
        <Header
            :total-plugins="totalPlugins"
            v-model:search-query="searchQuery"
            :categories="categories"
            :active-category="activeCategory"
            @update:active-category="setActiveCategory"
        />
        <div class="container bd-gutter">
            <div class="d-flex justify-content-between align-items-center my-4">
                <div class="count">{{ totalPlugins }} plugins</div>
                <div class="d-flex align-items-center">
                    <CustomSelect
                        v-model="sortBy"
                        :options="sortOptions"
                        label="Sort:"
                        id="sortSelect"
                    />
                </div>
            </div>

            <div class="row my-2" data-aos="fade-right">
                <div
                    class="col-lg-4 col-md-6 mb-3"
                    v-for="plugin in pluginsSlice"
                    :key="`plugin-${slugify(plugin.group ?? plugin.name)}${plugin.subGroup ? '-' + slugify(subGroupName(plugin)) : ''}`">
                    <PluginsPluginCard
                        :plugin="plugin"
                        :blueprints-count="getBlueprintCountForPlugin(plugin)"
                        :icons="props.icons"
                    />
                </div>
                <div v-if="!pluginsSlice.length" class="alert alert-warning mb-0" role="alert">
                    No results found for the current search
                </div>
            </div>

            <CommonPaginationContainer
                v-if="totalPages > 1"
                :current-url="currentUrl"
                :totalItems="totalGroups"
                :size-options="[20, 40, 60]"
                :default-size="40"
                class="pagination-container"
                @update="changePage"
            />
            <PluginsFaq />
        </div>
    </section>
</template>

<script setup lang="ts">
    import Header from './Header.vue';
    import {isEntryAPluginElementPredicate, type Plugin, type PluginElement, slugify, subGroupName} from "@kestra-io/ui-libs";
    import { computed, ref, watch } from "vue";
    import { usePluginsCount } from "../../composables/usePluginsCount";
    import PluginsPluginCard from "./PluginCard.vue";
    import CommonPaginationContainer from "../common/PaginationContainer.vue";
    import PluginsFaq from "./Faq.vue";

    import { useBlueprintsCounts } from '~/composables/useBlueprintsCounts';
    import CustomSelect from "../common/CustomSelect.vue";

    function filterPluginsWithoutDeprecated(plugins: Plugin[]): Plugin[] {
        return plugins.filter(plugin => !plugin.deprecated);
    }

    const currentPage = ref(1);
    const itemsPerPage = ref(40);
    const activeCategory = ref('All Categories');
    const sortBy = ref('A-Z');
    const sortOptions = [
        { value: 'A-Z', label: 'Name A-Z' },
        { value: 'Z-A', label: 'Name Z-A' }
    ];
    const props = defineProps<{
        plugins: Plugin[],
        categories: string[],
        icons?: Record<string, any>;
        fullPath: string;
    }>();

    const currentUrl = computed(() => {
        if (typeof window !== 'undefined') {
            return window.location.href;
        }
        return props.fullPath;
    });

    function isFullEntryAPluginElementPredicate(elementsArray :[elementType: string, elements: any]): elementsArray is [key: string, el:PluginElement[]] {
        return isEntryAPluginElementPredicate(...elementsArray);
    }

    const searchQuery = ref('');

    const { totalPlugins } = usePluginsCount();

    const augmentedCategories = computed(() => ['All Categories', ...props.categories]);

    const setActiveCategory = (category: string) => {
        activeCategory.value = category
    };

    const totalGroups = computed(() => filteredPluginsData.value.length);

    const filteredPluginsData = computed(() => {
        const filteredPlugins = filterPluginsWithoutDeprecated(props.plugins);

        let searchResults = setSearchPlugins(searchQuery.value, filteredPlugins)
        if (activeCategory.value !== 'All Categories') {
            currentPage.value = 1;
            searchResults = searchResults.filter((item) => {
                if (item.categories?.includes(activeCategory.value)) {
                    return item;
                }
            })
        }
        /**
         * Sorts the search results with "core" appearing first, followed by the rest sorted alphabetically (A-Z) or reverse alphabetically (Z-A) as selected.
         */
        if (sortBy.value === 'A-Z') {
            searchResults.sort((a, b) => {
                const nameA = a.title.toLowerCase();
                const nameB = b.title.toLowerCase();

                if (a.manifest?.["X-Kestra-Group"] === "io.kestra.plugin.core") return -1;
                if (b.manifest?.["X-Kestra-Group"] === "io.kestra.plugin.core") return 1;

                return a.title.localeCompare(b.title);
            });
        } else {
            searchResults.sort((a, b) => {
                const nameA = a.title.toLowerCase();
                const nameB = b.title.toLowerCase();

                if (a.manifest?.["X-Kestra-Group"] === "io.kestra.plugin.core") return -1;
                if (b.manifest?.["X-Kestra-Group"] === "io.kestra.plugin.core") return 1;

                return b.title.localeCompare(a.title);
            });
        }
        return searchResults;
    });

    const pluginsSlice = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;
        return filteredPluginsData.value.slice(startIndex, endIndex);
    });

    const totalPages = computed(() => {
        return Math.ceil(totalGroups.value / itemsPerPage.value);
    });

    watch(totalPages, (newTotal) => {
        if (!newTotal) {
            currentPage.value = 1;
            return;
        }
        if (currentPage.value > newTotal) currentPage.value = newTotal;
    });

    const { countsByPlugin: pluginBlueprintCounts, countsBySubgroup } = await useBlueprintsCounts();

    const getBlueprintCountForPlugin = (plugin: Plugin) =>
        plugin.subGroup !== undefined
            ? countsBySubgroup.value?.[`${slugify(plugin.group ?? plugin.name)}-${slugify(subGroupName(plugin))}`] ?? 0
            : pluginBlueprintCounts.value?.[slugify(plugin.group ?? plugin.name)] ?? 0;

    function setSearchPlugins<T extends Plugin>(search: string | undefined, allPlugins: T[]) {
        if (!search) {
            return allPlugins;
        }
        const searchLowercase = search?.trim().toLowerCase();
        return allPlugins.filter((item) => {
            return item?.title.toLowerCase().includes(searchLowercase) ||
                Object.entries(item)
                    .filter(isFullEntryAPluginElementPredicate)
                    .flatMap(([_, elements]) => elements)
                    .some(({cls}) => cls.toLowerCase().includes(searchLowercase));
        });
    }

    const changePage = (payload: { page: number; size: number }) => {
        currentPage.value = payload.page;
        itemsPerPage.value = payload.size;
        if(typeof window === 'undefined') return;
        window.scrollTo(0, 0)
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .total-pages {
        font-size: $font-size-sm;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-weight: 400;
        line-height: 22px;
    }

    .pagination-container {
        margin-top: 39px;

        .form-select {
            border-radius: 4px;
            border: $block-border;
            color: $white;
            text-align: center;
            font-family: $font-family-sans-serif;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
        }
    }

    .count {
        color: $white;
        font-size: 14px;
    }

    .row > * {
        padding-left: 8px;
        padding-right: 8px;
    }
</style>