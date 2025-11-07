<template>
    <div class="mt-5 mb-5">
        <div class="header-container">
            <div class="header container d-flex flex-column align-items-center gap-3">
                <h1 data-aos="fade-left">Plugins</h1>
                <h4 data-aos="fade-right">Extend Kestra with our {{ totalPlugins }} plugins</h4>
                <div class="col-12 search-input position-relative">
                    <input type="text" class="form-control form-control-lg"
                           :placeholder="`Search across ${totalPlugins} plugins`" v-model="searchQuery">
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
                    {{ DONT_CAPITALIZE_CATEGORIES.includes(category) ? category : capitalize(category.toLowerCase()) }}
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
                            v-model:current-page="currentPage"
                            @update:current-page="changePage"
                            v-if="totalPages > 1"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import {isEntryAPluginElementPredicate, type Plugin, type PluginElement} from "@kestra-io/ui-libs";
    import { computed, ref } from "vue";
    import { usePluginsCount } from "../../composables/usePluginsCount";
    import PluginsPluginCard from "./PluginCard.vue";
    import CommonPagination from "../common/Pagination.vue";

    const DONT_CAPITALIZE_CATEGORIES = ["AI", "BI"];

    const currentPage = defineModel<number>('currentPage', {required: false, default: 1});
    const itemsPerPage = defineModel<number>('itemsPerPage', {required: false, default: 40});
    const activeCategory = defineModel<string>('activeCategory', {required: false, default: 'All Categories'});

    const props = withDefaults(defineProps<{
        plugins: Plugin[],
        categories: string[],
        searchQuery?: string
    }>(), {
        searchQuery: ''
    });
    const searchQuery = ref('');

    function isFullEntryAPluginElementPredicate(elementsArray :[elementType: string, elements: any]): elementsArray is [key: string, el:PluginElement[]] {
        return isEntryAPluginElementPredicate(...elementsArray);
    }
    const { totalPlugins } = usePluginsCount(computed(() => props.plugins));

    const augmentedCategories = computed(() => ['All Categories', ...props.categories]);

    const setActiveCategory = (category: string) => {
        activeCategory.value = category
    };

    const capitalize = (name: string) => {
        return name[0]?.toUpperCase() + name.slice(1);
    };

    const totalGroups = computed(() => filteredPluginsData.value.length);

    function tooltipContent(plugin: Plugin, filteredPluginElementsEntries: [string, PluginElement[]][]) {
        return filteredPluginElementsEntries.map(([elementType, elements]) =>
            `<p>${capitalize(elementType).replace(/[A-Z]/g, match => ` ${match}`)}</p>
<ul>
${elements.map(({cls}) => `<li>
                <a href="plugins/${plugin.title}/${cls}">${cls}</a>
              </li>`).join("")}
</ul>`).join("");
    }

    const filteredPluginsData = computed(() => {
        const filteredPlugins = props.plugins.map(plugin => {
            const filteredPluginElementsEntries = Object.entries(plugin)
                .filter(isFullEntryAPluginElementPredicate)
                .map(([elementType, elements]): [string, PluginElement[]] => [elementType, elements.filter(({deprecated}) => !deprecated)])
                .filter(([, elements]) => elements.length > 0)

            if (filteredPluginElementsEntries.length === 0) {
                return undefined
            }

            return {
                ...plugin,
                tooltipContent: tooltipContent(plugin, filteredPluginElementsEntries),
                ...Object.fromEntries(filteredPluginElementsEntries)
            } as Plugin
        }).filter((plugin): plugin is Plugin => plugin !== undefined);

        let searchResults = setSearchPlugins(searchQuery.value, filteredPlugins)
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

    const changePage = () => {
        window.scrollTo(0, 0)
    };

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