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

            <div class="row my-2" data-aos="fade-right">
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
                <div v-if="!pluginsSlice.length" class="alert alert-warning mb-0" role="alert">
                    No results found for the current search
                </div>
            </div>

            <div class="d-flex justify-content-between pagination-container" v-if="totalGroups > itemsPerPage">
                <div class="items-per-page">
                    <select 
                        class="form-select bg-dark-2" 
                        aria-label="Default select example"
                        v-model="itemsPerPage"
                    >
                        <option :value="20">20</option>
                        <option :value="40">40</option>
                        <option :value="60">60</option>
                        <option :value="80">80</option>
                        <option :value="100">100</option>
                    </select>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <Pagination
                        v-if="totalPages > 1"
                        :totalPages="totalPages"
                        v-model:current-page="currentPage"
                        @update:current-page="changePage"
                    />
                </div>
            </div>

            <PluginsFaq />

        </div>
    </section>
</template>

<script setup lang="ts">
    import {isEntryAPluginElementPredicate, type Plugin, type PluginElement, type PluginMetadata, slugify, subGroupName, filterPluginsWithoutDeprecated} from "@kestra-io/ui-libs";
    import { useBlueprintsCounts } from '~/composables/useBlueprintsCounts';

    import Header from './Header.vue';
    import PluginCard from './PluginCard.vue';
    import Pagination from "../common/Pagination.vue";
    import CustomSelect from "../common/CustomSelect.vue";

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
    }>();

    const {data: icons} = await useFetch('/api/plugins?type=allPluginsIcons', {
        key: 'AllPluginsIcons'
    });

    const {data: metadata} = await useFetch<PluginMetadata[]>('/api/plugins?type=metadata', {
        key: 'AllPluginMetadata'
    });

    const metadataMap = computed(() => {
        if (!metadata.value) return {};
        return metadata.value.reduce((acc, meta) => {
            acc[meta.group] = meta;
            return acc;
        }, {} as Record<string, PluginMetadata>);
    });
    
    const searchQuery = ref('');
    const route = useRoute();
    const router = useRouter();

    const { totalPlugins } = usePluginsCount();

    const augmentedCategories = computed(() => ['All Categories', ...props.categories]);

    const setActiveCategory = (category: string) => {
        activeCategory.value = category
    };

    const sortPlugins = (plugins: Plugin[], ascending: boolean) => {
        return plugins.sort((a, b) => {
            if (a.manifest?.["X-Kestra-Group"] === "io.kestra.plugin.core") return -1;
            if (b.manifest?.["X-Kestra-Group"] === "io.kestra.plugin.core") return 1;
            const nameA = a.title.toLowerCase();
            const nameB = b.title.toLowerCase();
            return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
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
         * Sorts the search results with "kestra core plugins" appearing first, 
         * followed by the rest sorted alphabetically (A-Z) or reverse alphabetically (Z-A) as selected.
         */
        if (sortBy.value === 'A-Z') {
            searchResults = sortPlugins(searchResults, true);
        } else {
            searchResults = sortPlugins(searchResults, false);
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
                    .filter(([k, v]) => isEntryAPluginElementPredicate(k, v))
                    .flatMap(([_, elements]) => elements as PluginElement[])
                    .some(({cls}: PluginElement) => cls.toLowerCase().includes(searchLowercase));
        });
    }

    const changePage = () => {
        window.scrollTo(0, 0)
    };

    function getFilterPluginsQuery(pageVal: number, itemVal: number, categoryVal: string, searchVal: string, sortVal: string) {
        return {
            page: pageVal,
            size: itemVal,
            category: categoryVal,
            q: searchVal,
            sort: sortVal,
        }
    };

    onMounted(() => {
        if (route.query.page) currentPage.value = parseInt(route.query.page as string);
        if (route.query.size) itemsPerPage.value = parseInt(route.query.size as string);
        if (route.query.category) {
            activeCategory.value = augmentedCategories.value.find(c => c === route.query.category) ?? "";
        }
        if (typeof route.query.q === 'string') {
            searchQuery.value = route.query.q.trim();
        }
        if (typeof route.query.sort === 'string') {
            sortBy.value = route.query.sort;
        }
    })

    const timer = ref<NodeJS.Timeout>();
    watch([currentPage, itemsPerPage, activeCategory, searchQuery, sortBy], ([pageVal, itemVal, categoryVal, searchVal, sortVal]) => {
        if (timer) {
            clearTimeout(timer.value);
        }
        timer.value = setTimeout(async () => {
            router.push({
                query: getFilterPluginsQuery(pageVal, itemVal, categoryVal, searchVal, sortVal)
            })

        }, 500);
    });
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