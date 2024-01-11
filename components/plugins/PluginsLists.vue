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
                <input type="text" class="form-control form-control-lg" placeholder="Search across +400 of plugins" v-model="searchQuery">
                <Magnify class="search-icon" />
            </div>
            <div class="col-lg-3 col-md-4 mb-3" v-for="plugin in plugins" :key="plugin.id">
                <PluginsPluginCard :plugin="plugin" />
            </div>
            <div v-if="!totalPlugins" class="alert alert-warning mb-0" role="alert">
                No results found for the current search
            </div>
            <div class="d-flex justify-content-between pagination-container" v-if="totalPlugins > itemsPerPage">
                <div class="items-per-page">
                    <select class="form-select" aria-label="Default select example" v-model="itemsPerPage">
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
                        <span class="total-pages">Total: {{ totalPlugins }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import Magnify from "vue-material-design-icons/Magnify.vue"

    const currentPage = ref(1);
    const itemsPerPage = ref(20);
    const plugins = ref([]);
    const activeCategory = ref('All Categories');
    const categories = ref([]);
    const props = defineProps(["plugins","categories"]);
    const totalPages = ref(0);
    const totalPlugins = ref(0);
    const searchQuery = ref('');
    const route = useRoute();
    const router = useRouter();

    if(props.categories) {
        categories.value = ['All Categories', ...props.categories];
    }

    const setActiveCategory = (category) => {
        activeCategory.value = category
    };

    const capitalize = (name) => {
        return name[0].toUpperCase() + name.slice(1).toLowerCase();
    };

    const setPlugins = (allPlugins, total) => {
        plugins.value = allPlugins.sort((a, b) => {
            const nameA = a.title.toLowerCase(),
                nameB = b.title.toLowerCase();

            if (nameA === "core") {
                return -1;
            }
            if (nameB === "core") {
                return 1;
            }

            return nameA === nameB ? 0 : nameA < nameB ? -1 : 1;
        });
        totalPlugins.value = total;
        totalPages.value = Math.ceil(total / itemsPerPage.value)
    };

    const setSearchPlugins = (search, allPlugins) => {
        let searchPluginsList = [...allPlugins];
        return searchPluginsList.filter((item) => {
            const itemTitle = item.title.toLowerCase();
            return itemTitle.includes(search.toLowerCase());
        });
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

    const filterPlugins = (pageVal, itemVal, categoryVal, searchVal) => {
        let pluginsList = [...props.plugins];
        let searchResults = [];
        if (searchVal) {
            searchResults = setSearchPlugins(searchVal, pluginsList);
        } else {
            searchResults = pluginsList;
        }
        let page = pageVal;
        if (categoryVal !== 'All Categories') {
            page = 1;
            currentPage.value = page;
            searchResults = searchResults.filter((item) => {
                if (item.categories.includes(categoryVal)) {
                    return item;
                }
            })
        }
        const startIndex = (page - 1) * itemVal;
        const endIndex = startIndex + itemVal;
        const pluginsData = searchResults.slice(startIndex, endIndex);
        setPlugins(pluginsData, searchResults.length);

        return {
            page,
            size: itemVal,
            category: categoryVal,
            q: searchVal,
        }
    };

    if(route.query.page) currentPage.value = parseInt(route.query.page);
    if(route.query.size) itemsPerPage.value = parseInt(route.query.size);
    if(route.query.category) {
        activeCategory.value = categories.value.find(c => c === route.query.category);
        filterPlugins(currentPage.value, itemsPerPage.value , activeCategory.value, searchQuery.value)
    }
    if(route.query.q) {
        searchQuery.value = route.query.q;
        filterPlugins(currentPage.value, itemsPerPage.value , activeCategory.value, searchQuery.value)
    }

    let timer;
    watch([currentPage, itemsPerPage, activeCategory, searchQuery], ([pageVal, itemVal, categoryVal, searchVal]) => {
        if(timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(async () => {
            router.push({
                query: filterPlugins(pageVal, itemVal, categoryVal, searchVal)
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