<template>
    <div class="mt-5 mb-5">
        <h1 data-aos="fade-left">Plugins</h1>
        <h4 data-aos="fade-right">Extend Kestra with our +400 plugins</h4>
        <div class="grid gap-3 mt-5" data-aos="fade-left">
            <button
                v-for="category in categories"
                :key="category"
                :class="{ 'active': category === activeCategory }"
                @click="setActiveCategory(category)"
                class="m-1 rounded-button"
            >
                {{ capitalize(category) }}
            </button>
        </div>
        <div class="row my-4" data-aos="fade-right">
            <div class="col-12 search-input position-relative">
                <input type="text" class="form-control form-control-lg" placeholder="Search across +400 of plugins" v-model="searchQuery" @focus="handleFocus">
                <Magnify class="search-icon" />
                <div class="search-list" v-if="searchMenu">
                    <div v-if="searchResults.length" v-for="(result, index) in searchResults">
                        <NuxtLink :href="`/plugins/${result.name}`">
                            <div class="slug">
                                <span :class="{first: index === 0}"  v-for="(item, index) in breadcrumb(result.group)" :key="item" >{{ item }}</span>
                            </div>
                            <div class="result rounded-3">
                                <div>
                                    <h5 v-html="result.title"></h5>
                                    <p v-html="result.description" class="search-result-extract"/>
                                </div>
                                <ArrowRight />
                            </div>
                        </NuxtLink>
                    </div>
                    <div v-if="searchResults && !searchResults.length" class="alert alert-warning mb-0" role="alert">
                        No results found for the current search
                    </div>
                </div>
            </div>
            <div class="col-lg-4 col-md-6 mb-3" v-for="plugin in plugins" :key="plugin.id">
                <PluginsPluginCard :plugin="plugin" />
            </div>
            <div class="d-flex justify-content-between pagination-container">
                <div class="items-per-page">
                    <select class="form-select" aria-label="Default select example" v-model="itemsPerPage">
                        <option :value="15">15</option>
                        <option :value="25">25</option>
                        <option :value="50">50</option>
                    </select>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <CommonPagination
                        :totalPages="totalPages"
                        @on-page-change="changePage"
                        v-if="totalPages > 1"
                    />
                    <div class="d-flex align-items-baseline" v-if="totalPlugins > itemsPerPage">
                        <span class="total-pages">Total {{ totalPlugins }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue";
    import {findAll} from "highlight-words-core";

    const currentPage = ref(1);
    const itemsPerPage = ref(15);
    const plugins = ref([]);
    const activeCategory = ref('All Categories');
    const categories = ref([]);
    const props = defineProps(["plugins","categories"]);
    const totalPages = ref(0);
    const searchMenu = ref(false);
    const totalPlugins = ref(0);
    const searchResults = ref([]);
    const searchQuery = ref('');
    const route = useRoute();
    const router = useRouter();

    if(props.categories) {
        categories.value = ['All Categories' , ...props.categories];
    }

    const setActiveCategory = (category) => {
        activeCategory.value = category
    };

    if(route.query.page) currentPage.value = parseInt(route.query.page);
    if(route.query.size) itemsPerPage.value = parseInt(route.query.size);
    if(route.query.category) activeCategory.value = categories.value.find(c => c == route.query.category);
    if(route.query.q) searchQuery.value = route.query.q;

    const capitalize = (name) => {
        return name[0].toUpperCase() + name.slice(1).toLowerCase();
    };

    const setPlugins = (allPlugins, total) => {
        plugins.value = allPlugins;
        totalPlugins.value = total;
        totalPages.value = Math.ceil(total / itemsPerPage.value)
    };

    const handleFocus = () => {
        if (searchQuery.value) {
            searchMenu.value = true;
        }
    };

    const handleClickOutside = () => {
        searchMenu.value = false;
    };

    const setSearchPlugins = (search, allPlugins) => {
        let searchPluginsList = [...allPlugins];
        searchPluginsList = searchPluginsList.filter((item) => {
            const itemTitle = item.title.toLowerCase();
            return itemTitle.includes(search.toLowerCase());
        });
        searchPluginsList = searchPluginsList.map((item) => {
            const chunks = findAll({
                searchWords: search.split(" "),
                textToHighlight: item.title,
            });

            const highlightedText = chunks
                .map(chunk => {
                    const { end, highlight, start } = chunk;
                    const text = item.title.substr(start, end - start);
                    if (highlight) {
                        return `<mark class="p-0 bg-transparent text-primary">${text}</mark>`;
                    } else {
                        return text;
                    }
                })
                .join("");

            return {...item, title: highlightedText}
        });

        searchResults.value = searchPluginsList;
    };

    if(props.plugins) {
        const startIndex = (currentPage.value - 1) * itemsPerPage.value;
        const endIndex = startIndex + itemsPerPage.value;

        const pluginsData = props.plugins.slice(startIndex, endIndex);
        setPlugins(pluginsData, props.plugins.length);
    }

    const changePage = (pageNo) => {
        currentPage.value = pageNo;
        window.scrollTo(0, 0)
    };

    const breadcrumb = (slug) => {
        return [...new Set(slug.split(".")
            .filter(r => r !== ""))
        ]
    };

    let timer;
    watch([currentPage, itemsPerPage, activeCategory, searchQuery], ([pageVal, itemVal, categoryVal, searchVal]) => {
        if(timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(async () => {
            function getQuery() {
                let pluginsList = [...props.plugins];
                let page = pageVal;
                if (categoryVal !== 'All Categories') {
                    page = 1;
                    currentPage.value = page;
                    pluginsList = pluginsList.filter((item) => {
                        if (item.categories.includes(categoryVal)) {
                            return item;
                        }
                    })
                }
                const startIndex = (page - 1) * itemVal;
                const endIndex = startIndex + itemVal;
                const pluginsData = pluginsList.slice(startIndex, endIndex);
                setPlugins(pluginsData, pluginsList.length);

                if (searchVal) {
                    searchMenu.value = true;
                    setSearchPlugins(searchVal, pluginsList);
                } else {
                    searchMenu.value = false;
                }

                return {
                    page,
                    size: itemVal,
                    category: categoryVal,
                    q: searchVal,
                }
            }

            router.push({
                query: getQuery()
            })

        }, 500);
    });
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";
    h1 {
        font-size: $h2-font-size;
    }

    h4 {
        font-weight: normal;
        font-size: $h4-font-size;
    }
    .form-control {
        padding-left: 2.5rem;

        &:focus {
            border-color: var(--bs-border-color);
            box-shadow: none;
        }
    }
    .total-pages {
        font-size: $font-size-xs;
        color: #000;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-style: normal;
        font-weight: 400;
        line-height: 20px;
    }

    .top-breadcrumb {
        &:after {
            width: 13px;
        }
    }

    .rounded-button {
        border-radius: 0.25rem;
        padding: calc($spacer / 2) calc($spacer / 1);
        margin-right: calc($spacer / 2);
        background-color: var(--bs-white);
        border: 0.063rem solid #E5E4F7;
        font-weight: bold;
        font-size: $font-size-sm;
        line-height: 1.375rem;

        &.active {
            background-color: var(--bs-primary);
            color: var(--bs-white);
        }
    }

    .search-input {
        margin-bottom: 2.3rem;
        .search-icon {
            position: absolute;
            top: 10px;
            left: 26px;
            font-size: 24px;
        }

        .search-list {
            position: absolute;
            border-radius: 0 0 8px 8px;
            padding: 14.5px 30.5px;
            border: 1px solid var(--bs-border-color);
            background: $white;
            top: 44px;
            left: calc(var(--bs-gutter-x) * 0.5);
            right: calc(var(--bs-gutter-x) * 0.5);
            z-index: 1;
            max-height: 400px;
            overflow: auto;

            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            &::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 3px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background: #555;
            }

            .slug {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
                font-size: $font-size-xs;
                color: $purple-18;
                margin-bottom: calc($spacer / 3);

                span {
                    margin-left: 0.25rem;

                    &:before {
                        content: '/';
                        margin-right: 0.25rem;

                    }

                    &:first-child {
                        &:before {
                            display: none;
                        }
                    }

                    &.first {
                        font-weight: bold;
                    }
                }

                .breadcrumb-item + .breadcrumb-item::before {
                    color: $pink;
                }
            }

            .result {
                background: var(--bs-gray-100);
                transition: background-color 0.2s ease;
                padding: 1.25rem ;
                margin-bottom: calc($spacer * 1.5);
                display: flex;



                &:hover {
                    background: var(--bs-gray-200);
                }

                > div {
                    flex-grow: 1;

                    h5 {
                        font-size: $font-size-lg;
                        font-weight: bold;
                        margin-bottom: 0;
                        color: var(--bs-dark);

                    }

                    p {
                        color: var(--bs-gray-600);
                        font-size: $font-size-sm;
                        margin-bottom: 0;
                    }

                }


                span.material-design-icon {
                    font-size: 1rem;
                    transition: opacity 0.2s ease;
                }
            }
        }
    }


    .pagination-container {
        margin-top: 39px;

        .form-select {
            border-radius: 4px;
            border: 1px solid $purple-13;
            color: $black;
            text-align: center;
            font-family: $font-family-sans-serif;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;

        }
    }
</style>