<template>
    <div class="mt-5 mb-5">
        <div class="header-container">
            <div class="header container d-flex flex-column align-items-center gap-3">
                <h1 data-aos="fade-left">Plugins</h1>
                <h4 data-aos="fade-right">Extend Kestra with our +{{totalPlugins}} plugins</h4>
                <div class="col-12 search-input position-relative">
                    <input type="text" class="form-control form-control-lg" :placeholder="`Search across ${totalPlugins}+ of plugins`" v-model="searchQuery">
                    <Magnify class="search-icon" />
                </div>
            </div>
        </div>
        <div class="container bd-gutter">
            <div class="mt-5" data-aos="fade-left">
                <button
                    v-for="category in categories"
                    :key="category"
                    :class="{ 'active': category === activeCategory }"
                    @click="setActiveCategory(category)"
                    class="m-1 rounded-button"
                >
                    {{ DONT_CAPITALIZE_CATEGORIES.includes(category) ? category : capitalize(category) }}
                </button>
            </div>
            <div class="row my-4" data-aos="fade-right">
                <div class="col-lg-3 col-md-4 mb-3" v-for="plugin in plugins" :key="plugin.id">
                    <PluginsPluginCard :plugin="plugin" />
                </div>
                <div v-if="!totalGroups" class="alert alert-warning mb-0" role="alert">
                    No results found for the current search
                </div>
                <div class="d-flex justify-content-between pagination-container" v-if="totalGroups > itemsPerPage">
                    <div class="items-per-page">
                        <select class="form-select bg-dark-2" aria-label="Default select example" v-model="itemsPerPage">
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

<script setup>
    import Magnify from "vue-material-design-icons/Magnify.vue"

    const DONT_CAPITALIZE_CATEGORIES = ["AI"];
    const currentPage = ref(1);
    const itemsPerPage = ref(40);
    const plugins = ref([]);
    const activeCategory = ref('All Categories');
    const categories = ref([]);
    const props = defineProps(["plugins","categories"]);
    const totalPages = ref(0);
    const totalGroups = ref(0);
    const totalPlugins = ref(0);
    const searchQuery = ref('');
    const route = useRoute();
    const router = useRouter();

    if(props.plugins) {
        let allTasks = [];
        let allTriggers = [];
        let allConditions = [];
        let allTaskRunners = [];

        // avoid duplicate across groups and subgroups
        props.plugins.forEach(plugin => {
            allTasks = [...allTasks, ...(plugin.tasks ?? [])];
            allTriggers = [...allTriggers, ...(plugin.triggers ?? [])];
            allConditions = [...allConditions, ...(plugin.conditions ?? [])];
            allTaskRunners = [...allTaskRunners, ...(plugin.taskRunners ?? [])];
            plugin.tooltipContent = '',
            creatingTooltipContainer(plugin, plugin.tasks, 'Tasks');
            creatingTooltipContainer(plugin, plugin.triggers, 'Triggers');
            creatingTooltipContainer(plugin, plugin.conditions, 'Conditions');
            creatingTooltipContainer(plugin, plugin.taskRunners, 'TaskRunners');
        });

        totalPlugins.value = (new Set(allTasks)).size +
            (new Set(allTriggers)).size +
            (new Set(allConditions)).size +
            (new Set(allTaskRunners)).size;
    }

    if(props.categories) {
        categories.value = ['All Categories', ...props.categories];
    }

    function generateCategoryLink(title, item, categoryName) {
      return `plugins/${title}/${categoryName.toLowerCase()}/${item}`
    }

    function generateCategoryList (plugin, categoryItems, categoryName) {
      let list = ``;
      categoryItems.forEach(item => {
        list += `
              <li>
                <a href="${generateCategoryLink(plugin.title, item, categoryName)}">${item}</a>
              </li>
            `
      });
      return list;
    };

    function creatingTooltipContainer (plugin, categoryItems, categoryName) {
      if (categoryItems && categoryItems.length > 0) {
        plugin.tooltipContent += `
            <p>${categoryName}</p>
            <ul>
              ${generateCategoryList(plugin, categoryItems, categoryName)}
            </ul>
        `
      }
    };

    const setActiveCategory = (category) => {
        activeCategory.value = category
    };

    const capitalize = (name) => {
        return name[0].toUpperCase() + name.slice(1).toLowerCase();
    };

    const setPlugins = (allPlugins, total) => {
        plugins.value = allPlugins
        totalGroups.value = total;
        totalPages.value = Math.ceil(total / itemsPerPage.value)
    };

    const setSearchPlugins = (search, allPlugins) => {
        let searchPluginsList = [...allPlugins];
        const searchLowercase = search.toLowerCase()
        return searchPluginsList.filter((item) => {
            return item?.title.toLowerCase().includes(searchLowercase) ||
                (item.tasks ?? []).some(task => task.toLowerCase().includes(searchLowercase)) ||
                (item.triggers ?? []).some(trigger => trigger.toLowerCase().includes(searchLowercase)) ||
                (item.conditions ?? []).some(condition => condition.toLowerCase().includes(searchLowercase)) ||
                (item.taskRunners ?? []).some(taskRunner => taskRunner.toLowerCase().includes(searchLowercase))
        });
    };

    if (props.plugins) {
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
                if (item.categories?.includes(categoryVal)) {
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