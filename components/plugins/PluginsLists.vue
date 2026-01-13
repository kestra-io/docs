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
            <div class="d-flex justify-content-end align-items-center my-4">
                <div class="d-flex align-items-center">
                    <CustomSelect
                        v-model="sortBy"
                        :options="sortOptions"
                        label="Sort:"
                        id="sortSelect"
                    />
                </div>
            </div>

            <div class="row my-2" data-aos="fade-up">
                <template v-if="pluginsSlice?.length">
                    <div
                        class="col-lg-4 col-md-6 mb-3"
                        v-for="plugin in pluginsSlice"
                        :key="`plugin-${slugify(plugin.group ?? plugin.name)}${plugin.subGroup ? '-' + slugify(subGroupName(plugin)) : ''}`"
                    >
                        <PluginCard
                            :plugin="plugin"
                            :blueprints-count="getBlueprintCountForPlugin(plugin)"
                            :icons="icons"
                            :metadata-map="metadataMap"
                        />
                    </div>
                </template>
                <div v-else-if="!pluginsSlice?.length && plugins.length" class="alert alert-warning mb-0" role="alert">
                    No results found for the current search
                </div>
            </div>

            <CommonPaginationContainer
                :current-url="fullPath"
                :total-items="plugins.length ?? 0"
                @update="({page, size}) => {
                    currentPage = page;
                    itemsPerPage = size
                }"
            />

            <PluginsFaq />
        </div>
    </section>
</template>

<script setup lang="ts">
    import {isEntryAPluginElementPredicate, type Plugin, type PluginElement, type PluginMetadata, slugify, subGroupName, filterPluginsWithoutDeprecated} from "@kestra-io/ui-libs";

    import Header from './Header.vue';
    import PluginCard from './PluginCard.vue';
    import CommonPaginationContainer from '../common/PaginationContainer.vue';
    import PluginsFaq from './Faq.vue';
    import CustomSelect from "../common/CustomSelect.vue";
    import { computed, ref, watch } from "vue";
    import { usePluginsCount } from "~/composables/usePluginsCount";

    const currentPage = ref(1);
    const itemsPerPage = ref(40);
    const activeCategory = ref('All Categories');
    const sortBy = ref('A-Z');
    const sortOptions = [
        { value: 'A-Z', label: 'Name A-Z' },
        { value: 'Z-A', label: 'Name Z-A' }
    ];

    const props = withDefaults(defineProps<{
        plugins: Plugin[],
        categories: string[],
        icons: Record<string, string>,
        metadata?: PluginMetadata[],
        fullPath: string,
        blueprintCounts?: number
    }>(), {
        blueprintCounts: 0
    });


    const metadataMap = computed(() => {
        if (!props.metadata) return {};
        return props.metadata.reduce((acc, meta) => {
            acc[meta.group] = meta;
            return acc;
        }, {} as Record<string, PluginMetadata>);
    });

    const searchQuery = ref('');

    const { totalPlugins } = usePluginsCount();

    const setActiveCategory = (category: string) => {
        activeCategory.value = category
    };

    const sortPlugins = (plugins: Plugin[], ascending: boolean) => {
        return [...plugins].sort((a, b) => {
            // Ensure the core parent plugin (group === io.kestra.plugin.core and no subGroup) appears first
            if (a.group === "io.kestra.plugin.core" && (a.subGroup === undefined || a.subGroup === null)) return -1;
            if (b.group === "io.kestra.plugin.core" && (b.subGroup === undefined || b.subGroup === null)) return 1;

            const nameA = a.title.toLowerCase();
            const nameB = b.title.toLowerCase();
            return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
    };

    const activePlugins = computed(() => filterPluginsWithoutDeprecated(props.plugins));

    const searchFilteredPlugins = computed(() =>
        setSearchPlugins(searchQuery.value, activePlugins.value)
    );

    const categoryFilteredPlugins = computed(() => {
        if (activeCategory.value === 'All Categories') {
            return searchFilteredPlugins.value;
        }
        return searchFilteredPlugins.value.filter(item =>
            item.categories?.includes(activeCategory.value)
        );
    });

    const totalGroups = computed(() => filteredPluginsData.value.length);

    const filteredPluginsData = computed(() => {
        if (activeCategory.value !== 'All Categories' && currentPage.value !== 1) {
            currentPage.value = 1;
        }

        /**
         * Sorts the search results with "kestra core plugins" appearing first,
         * followed by the rest sorted alphabetically (A-Z) or reverse alphabetically (Z-A) as selected.
         */
        return sortPlugins(categoryFilteredPlugins.value, sortBy.value === 'A-Z');
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

    const getBlueprintCountForPlugin = (plugin: Plugin) => {
        if (plugin.subGroup !== undefined) {
            return props.blueprintCounts?.[plugin.subGroup] ?? 0;
        }

        return props.blueprintCounts?.[plugin.group ?? plugin.name] ?? 0;
    };

    function setSearchPlugins<T extends Plugin>(search: string | undefined, allPlugins: T[]) {
        if (!search) return allPlugins;

        const tokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean);

        return allPlugins.filter((item) => {
            if (tokens.every(t => item?.title.toLowerCase().includes(t))) return true;

            return Object.entries(item)
                .filter(([k, v]) => isEntryAPluginElementPredicate(k, v))
                .flatMap(([_, elements]) => elements as PluginElement[])
                .some(({cls}: PluginElement) => tokens.every(t => cls.toLowerCase().includes(t)));
        });
    }
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