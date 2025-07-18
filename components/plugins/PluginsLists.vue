<template>
    <div class="mt-5 mb-5">
        <div class="header-container">
            <div class="header container d-flex flex-column align-items-center gap-3">
                <h1 data-aos="fade-left">Plugins</h1>
                <h4 data-aos="fade-right">Extend Kestra with our {{ totalPlugins }}+ plugins</h4>
                <div class="col-12 search-input position-relative">
                    <input type="text" class="form-control form-control-lg"
                        :placeholder="`Search across ${totalPlugins}+ plugins`" v-model="searchQuery">
                    <Magnify class="search-icon" />
                </div>
            </div>
        </div>
        <div class="container bd-gutter">
            <div class="mt-5" data-aos="fade-left">
                <button
                    v-for="category in augmentedCategories"
                    :key="category"
                    :class="{ 'active': category === activeCategory }"
                    @click="setActiveCategory(category)"
                    class="m-1 rounded-button"
                >
                    {{ DONT_CAPITALIZE_CATEGORIES.includes(category) ? category : capitalize(category) }}
                </button>
            </div>
            <div class="row my-4" data-aos="fade-right">
                <div class="col-lg-3 col-md-4 mb-3" v-for="plugin in pluginsSlice" :key="plugin.name + '-' + plugin.title">
                    <PluginsPluginCard :plugin="plugin" />
                </div>
                <div v-if="!totalGroups" class="alert alert-warning mb-0" role="alert">
                    No results found for the current search
                </div>
                <div class="d-flex justify-content-between pagination-container" v-if="totalGroups > itemsPerPage">
                    <div class="items-per-page">
                        <select class="form-select bg-dark-2" aria-label="Default select example"
                                v-model="itemsPerPage">
                            <option :value="20">20</option>
                            <option :value="40">40</option>
                            <option :value="60">60</option>
                        </select>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <CommonPagination
                            :totalPages="totalPages"
                            @on-page-change="changePage"
                            v-if="totalPages > 1"
                        />
                        <div class="d-flex align-items-baseline">
                            <span class="total-pages">Total: {{ totalGroups }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import {isEntryAPluginElementPredicate, slugify} from "@kestra-io/ui-libs";

    const DONT_CAPITALIZE_CATEGORIES = ["AI"];
    const currentPage = ref(1);
    const itemsPerPage = ref(40);
    const activeCategory = ref('All Categories');
    const props = defineProps<{
            plugins: {
                group: string
                title: string,
                description: string,
            }[],
            categories: string[],
        }>();
    const searchQuery = ref('');
    const route = useRoute();
    const router = useRouter();

    const totalPlugins = computed(() => props.plugins.reduce((acc, plugin) => {
        Object.entries(plugin)
            .filter(([elementType, elements]) => isEntryAPluginElementPredicate(elementType, elements))
            .flatMap(([_, elements]) => elements)
            .forEach(e => acc.add(e));
        return acc;
    }, new Set()).size);

    const augmentedCategories = computed(() => ['All Categories', ...props.categories]);

    const setActiveCategory = (category: string) => {
        activeCategory.value = category
    };

    const capitalize = (name: string) => {
        return name[0].toUpperCase() + name.slice(1).toLowerCase();
    };

    const totalGroups = computed(() => filteredPluginsData.value.length);

    const filteredPluginsData = computed(() => {
        let pluginsList = [...props.plugins];
        let searchResults = [];
        if (searchQuery.value) {
            searchResults = setSearchPlugins(searchQuery.value, pluginsList);
        } else {
            searchResults = pluginsList;
        }
        if (activeCategory.value !== 'All Categories') {
            currentPage.value = 1;
            searchResults = searchResults.filter((item) => {
                if (item.categories?.includes(activeCategory.value)) {
                    return item;
                }
            })
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

    const setSearchPlugins = (search: string, allPlugins: any[]) => {
        let searchPluginsList = [...allPlugins];
        const searchLowercase = search?.trim().toLowerCase();
        return searchPluginsList.filter((item) => {
            return item?.title.toLowerCase().includes(searchLowercase) ||
                Object.entries(item)
                    .filter(([elementType, elements]) => isEntryAPluginElementPredicate(elementType, elements))
                    .flatMap(([_, elements]) => elements as string[])
                    .some(e => e.toLowerCase().includes(searchLowercase));
        });
    };

    const changePage = (pageNo: number) => {
        currentPage.value = pageNo;
        window.scrollTo(0, 0)
    };

    function getFilterPluginsQuery(pageVal: number, itemVal: number, categoryVal: string, searchVal: string){
        return {
            page: pageVal,
            size: itemVal,
            category: categoryVal,
            q: searchVal,
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
    })

    const timer = ref<NodeJS.Timeout>();
    watch([currentPage, itemsPerPage, activeCategory, searchQuery], ([pageVal, itemVal, categoryVal, searchVal]) => {
        if (timer) {
            clearTimeout(timer.value);
        }
        timer.value = setTimeout(async () => {
            router.push({
                query: getFilterPluginsQuery(pageVal, itemVal, categoryVal, searchVal)
            })

        }, 500);
    });
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    .header-container {
        background: url("/landing/plugins/bg.svg") no-repeat top;

        .header {
            padding-bottom: calc($spacer * 4.125);
            border-bottom: 1px solid rgba(255, 255, 255, 0.10);

            h1, h4 {
                color: $white;
                text-align: center;
                font-weight: 400;
                margin-bottom: 0;
            }

            h1 {
                font-size: $font-size-4xl;
            }

            h4 {
                font-size: $font-size-xl;
            }
        }

    }

    .form-control {
        padding-left: 2.5rem;

        &:focus {
            border-color: var(--bs-border-color);
            box-shadow: none;
        }
    }

    .total-pages {
        font-size: $font-size-sm;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-weight: 400;
        line-height: 22px;
    }

    .rounded-button {
        border-radius: 0.25rem;
        color: var(--bs-white);
        padding: calc($spacer / 2) calc($spacer / 1);
        margin-right: calc($spacer / 2);
        background-color: $black-2;
        border: 0.063rem solid $black-3;
        font-weight: bold;
        font-size: $font-size-sm;
        line-height: 1.375rem;

        &.active {
            background-color: $primary-1;
            border-color: $primary-1;
        }
    }

    .search-input {
        max-width: 21rem;

        input {
            border-radius: 4px;
            border: 1px solid #404559;
            background-color: #1C1E27;

            &, &::placeholder {
                color: $white;
                font-size: $font-size-md;
                font-weight: 400;
            }
        }

        .search-icon {
            position: absolute;
            top: calc($spacer * 0.563);;
            left: calc($spacer * 1.125);
            font-size: calc($spacer * 1.125);
            color: $white;
        }
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
</style>