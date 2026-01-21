<template>
    <section class="wrapper">
        <Header
            :total-plugins="totalPlugins"
            v-model:search-query="searchQuery"
            :categories="categories"
            v-model:active-category="activeCategory"
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

            <div class="row my-2" data-usal="fade-u-2 threshold-0">
                <template v-if="pluginsSlice?.length">
                    <div
                        class="col-lg-4 col-md-6 mb-3"
                        v-for="plugin in pluginsSlice"
                        :key="plugin.group + (plugin.subGroup ?? '')"
                    >
                        <PluginCard
                            :plugin="pluginsInformation(plugin)"
                        />
                    </div>
                </template>
                <div v-else-if="!pluginsSlice?.length && activePlugins.length" class="alert alert-warning mb-0" role="alert">
                    No results found for the current search
                </div>
            </div>

            <CommonPaginationContainer
                :current-url="fullPath"
                :total-items="activePlugins.length"
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
    import {isEntryAPluginElementPredicate, type Plugin, type PluginElement, filterPluginsWithoutDeprecated} from "@kestra-io/ui-libs";
    import Header from '~/components/plugins/Header.vue';
    import PluginCard from '~/components/plugins/PluginCard.vue';
    import CommonPaginationContainer from '~/components/common/PaginationContainer.vue';
    import PluginsFaq from '~/components/plugins/Faq.vue';
    import CustomSelect from "~/components/common/CustomSelect.vue";
    import {computed, ref, watch, onMounted} from "vue";
    import {usePluginsCount} from "~/composables/usePluginsCount";

    const currentPage = ref(1);
    const searchQuery = ref('');
    const itemsPerPage = ref(40);
    const activeCategory = ref('All Categories');
    const sortBy = ref('A-Z');
    const sortOptions = [
        { value: 'A-Z', label: 'Name A-Z' },
        { value: 'Z-A', label: 'Name Z-A' }
    ];

    const props = defineProps<{
        pluginsData: Record<string, PluginInformation>,
        plugins: Plugin[],
        fullPath: string,
    }>();

    const { totalPlugins } = usePluginsCount(ref(props.plugins));

    const categories = computed(() => [...new Set(Object.values(props.pluginsData).flatMap(plugin => plugin.categories ?? []))].sort());

    const sortPlugins = (plugins: Plugin[], ascending: boolean) =>
        [...plugins].sort((a, b) => {
            // Core plugin (io.kestra.plugin.core with no subGroup) should always appear first
            const aCore = a.group === "io.kestra.plugin.core" && !a.subGroup;
            const bCore = b.group === "io.kestra.plugin.core" && !b.subGroup;

            if (aCore && !bCore) return -1;
            if (!aCore && bCore) return 1;

            const comparison = a.title.toLowerCase().localeCompare(b.title.toLowerCase());
            return ascending ? comparison : -comparison;
        });

    const activePlugins = computed(() => filterPluginsWithoutDeprecated(props.plugins ?? []));

    const searchFilteredPlugins = computed(() =>
        setSearchPlugins(searchQuery.value, activePlugins.value)
    );

    const categoryFilteredPlugins = computed(() =>
        activeCategory.value === 'All Categories'
            ? searchFilteredPlugins.value
            : searchFilteredPlugins.value.filter(item => item.categories?.includes(activeCategory.value))
    );

    const pluginsSlice = computed(() =>
        sortPlugins(categoryFilteredPlugins.value, sortBy.value === 'A-Z').slice(
            (currentPage.value - 1) * itemsPerPage.value,
            currentPage.value * itemsPerPage.value
        )
    );

    const pluginsInformation = (plugin: Plugin): PluginInformation => {
        const pluginInfo = props.pluginsData?.[plugin.subGroup ?? plugin.group ?? plugin.name];
        return {
            name: plugin.name,
            subGroupTitle: plugin.title,
            title: pluginInfo?.title,
            description: pluginInfo?.description ?? plugin.description,
            categories: pluginInfo?.categories,
            icon: pluginInfo?.icon,
            elementCounts: pluginInfo?.elementCounts,
            blueprints: pluginInfo?.blueprints,
            className: pluginInfo?.className,
            subGroup: plugin.subGroup
        };
    };

    onMounted(() => {
        const params = new URLSearchParams(window.location.search);
        searchQuery.value = params.get('q') ?? '';
        activeCategory.value = params.get('category') ?? 'All Categories';
        sortBy.value = params.get('sort') ?? 'A-Z';
    });

    watch([searchQuery, activeCategory, sortBy], ([q, cat, sort]) => {
        const url = new URL(window.location.href);
        url.searchParams.set('category', cat);
        url.searchParams.set('sort', sort);

        if(q) url.searchParams.set('q', q);
        else url.searchParams.delete('q');

        window.history.replaceState(null, '', url);
    });

    const setSearchPlugins = <T extends Plugin>(search: string | undefined, allPlugins: T[]) => {
        if (!search) return allPlugins;
        const tokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
        return allPlugins.filter((item) => {
            if (tokens.every(t => item?.title.toLowerCase().includes(t))) return true;
            return Object.entries(item)
                .filter(([k, v]) => isEntryAPluginElementPredicate(k, v))
                .flatMap(([_, elements]) => elements as PluginElement[])
                .some(({cls}: PluginElement) => tokens.every(t => cls.toLowerCase().includes(t)));
        });
    };
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .total-pages {
        font-size: $font-size-sm;
        color: $white;
    }

    .pagination-container {
        margin-top: 39px;

        .form-select {
            border-radius: 4px;
            border: $block-border;
            color: $white;
            font-size: 14px;
            font-weight: 700;
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