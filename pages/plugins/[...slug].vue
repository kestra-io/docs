<template>
    <!-- <DocContainer type="plugins" :slug="slug" /> -->
    <div class="container">
        <div class="mt-5 main">
            <div class="side-bar border-end">
                <div class="side-bar-item" v-for="group in groups" :key="group.title" role="button">
                    <NuxtLink :href="`https://kestra.io/plugins/${group.name}`" class="text-black">
                        <span>{{ group.title }}</span>
                    </NuxtLink>
                </div>
            </div>
            <div class="content">
                <div class="ms-4">
                    <h1 data-aos="fade-left">Plugins</h1>
                    <h5 data-aos="fade-right">Extend Kestra with our {{ subgroupsData.length }} plugins</h5>
                    <div class="grid gap-3 mt-5" data-aos="fade-left">
                        <button
                            v-for="cat in categories"
                            :key="cat"
                            :class="{ 'active': cat === selectedCategory }"
                            @click="selectedCategory = cat"
                            class="m-1 rounded-button"
                        >
                            {{ cat }}
                        </button>
                    </div>
                    <div class="row my-5">
                        <div class="row mb-4 justify-content-center">
                            <div class="col-12 col-md-6 col-lg-4">
                                <input type="text" class="form-control form-control-lg" id="search-input" placeholder="Search plugins" v-model="searchQuery">
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-6 mb-4" v-for="plugin in paginatedPlugins" :key="plugin.name">
                            <PluginsCard :plugin="plugin" :icon="getIcon(plugin.plugin)" data-aos="zoom-in"></PluginsCard>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="items-per-page">
                                <select class="form-select" aria-label="Default select example" v-model="itemsPerPage">
                                    <option :value="10">10</option>
                                    <option :value="25">25</option>
                                    <option :value="50">50</option>
                                </select>
                            </div>
                            <div class="d-flex align-items-baseline" v-if="totalPages > 1">
                                <BlueprintsPagination :total-pages="totalPages" @on-page-change="changePage" />
                                <span class="total-pages">Total {{ plugins.length }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    // const route = useRoute()
    // const slug = "/plugins/" + (route.params.slug instanceof Array ? route.params.slug.join('/') : route.params.slug);
    const searchQuery = ref('')
    const itemsPerPage = ref(25)
    const plugins = ref([])
    const categories = ref([])
    const groups = ref([])
    const selectedCategory = ref('All Categories')
    const pageNo = ref(1)
    const icons = ref({})

    const { data: iconsData } = await useAsyncData('icons', () => {
        return $fetch('https://api.kestra.io/v1/plugins/icons/subgroups')
    })

    if(iconsData.value) icons.value = iconsData.value

    const { data: categoriesData } = await useAsyncData('categories', () => {
        return $fetch(`https://api.kestra.io/v1/plugins/categories`)
    })

    if(categoriesData.value) categories.value = ['All Categories', ...categoriesData.value]

    const { data: subgroupsData } = await useAsyncData('subgroups', () => {
        return $fetch(`https://api.kestra.io/v1/plugins/subgroups`)
    })

    if(subgroupsData.value) {
        plugins.value = subgroupsData.value.filter((sGroup, i) => (sGroup.categories && i == subgroupsData.value.findIndex(sg => sg.plugin == sGroup.plugin)))
    }

    const { data: groupsData } = await useAsyncData('groups', () => {
        return $fetch(`https://api.kestra.io/v1/plugins`)
    })

    if(groupsData.value) groups.value = groupsData.value

    const getIcon = (iconName) => {
        if(iconName && icons.value[iconName]) {
            return icons.value[iconName]
        }

        return {}
    }

    const changePage = (pageNum) => {
        pageNo.value = pageNum
    }

    const filteredPlugins = computed(() => {
        return plugins.value.filter((plugin) => {
            return selectedCategory.value == 'All Categories' ? true : (plugin.categories && plugin.categories.some(c => c.toUpperCase() == selectedCategory.value.toUpperCase()))
        }).filter((plugin) => {
            return (plugin.categories && plugin.categories.includes(searchQuery.value.toUpperCase())) ||
                (plugin.plugin && plugin.plugin.toLocaleLowerCase().includes(searchQuery.value.toLowerCase())) || 
                (plugin.subgroup && plugin.subgroup.toLocaleLowerCase().includes(searchQuery.value.toLowerCase())) ||
                (plugin.description && plugin.description.toLocaleLowerCase().includes(searchQuery.value.toLocaleLowerCase()))
        })
    })

    const totalPages = computed(() => {
        return Math.ceil(filteredPlugins.value.length / itemsPerPage.value)
    })

    const paginatedPlugins = computed(() => {
        return filteredPlugins.value.slice((pageNo.value - 1) * itemsPerPage.value, pageNo.value * itemsPerPage.value)
    })
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";
    .container {
        overflow: visible;
        .main {
            display: grid;
            gap: 1rem;
            grid-template-columns: 1fr 5fr;
            padding-bottom: 2rem;

            h5 {
                font-weight: normal;
            }

            .form-control {
                background: url('/search.svg') no-repeat 13px;
                padding-left: 2.5rem;
            }

            .side-bar {
                position: sticky;
                top: 5rem;
                display: block;
                height: calc(100vh - 7rem);
                padding-top: 2rem;
                overflow-y: scroll;
                -ms-overflow-style: none;
                scrollbar-width: none;
            
                &::-webkit-scrollbar { 
                    display: none;
                }
                .side-bar-item {
                    padding-top: 0.938rem !important;
                    padding-bottom: 0.938rem !important;
                    text-overflow: ellipsis;
                    font-weight: bold;
                    line-height: 24px;
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

            @include media-breakpoint-down(sm) {
                .side-bar {
                    display: none;
                }

                & {
                    grid-template-columns: auto;
                }
            }
        }

    }
</style>