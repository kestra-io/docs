<template>
    <!-- <DocContainer type="plugins" :slug="slug" /> -->
    <div class="container">
        <div class="mt-5 row">
            <div class="side-bar col-12 col-md-3 col-lg-2 border-end">
                <div class="side-bar-item" v-for="group in groups" :key="group.title" role="button">
                    <span>{{ group.title }}</span>
                </div>
            </div>
            <div class="col-12 col-md-9 col-lg-10">
                <div class="ms-4">
                    <h1 data-aos="fade-left">Plugins</h1>
                    <h5 data-aos="fade-right">Extend Kestra with our 350 plugins</h5>
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
                            <PluginsCard :plugin="plugin" :icon="plugin.icon ? getIcon(plugin.icon) : {}" data-aos="zoom-in"></PluginsCard>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="items-per-page">
                                <select class="form-select" aria-label="Default select example" v-model="itemsPerPage">
                                    <option :value="10">10</option>
                                    <option :value="25">25</option>
                                    <option :value="50">50</option>
                                </select>
                            </div>
                            <div class="d-flex align-items-baseline" v-if="plugins.length > itemsPerPage">
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
        return $fetch('https://api.kestra.io/v1/plugins/icons')
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
        plugins.value = subgroupsData.value.filter((sGroup, i) => sGroup.subgroup && i == subgroupsData.value.findIndex(sg => sg.subgroup == sGroup.subgroup))
    }

    const { data: groupsData } = await useAsyncData('groups', () => {
        return $fetch(`https://api.kestra.io/v1/plugins`)
    })

    if(groupsData.value) groups.value = groupsData.value

    const getIcon = (iconName) => {
        if(icons.value[iconName]) {
            return icons.value[iconName]
        }

        return {}
    }

    const changePage = (pageNum) => {
        pageNo.value = pageNum
    }

    const totalPages = computed(() => {
        return Math.ceil(plugins.value.length / itemsPerPage.value)
    })

    const paginatedPlugins = computed(() => {
        return plugins.value.slice((pageNo.value - 1) * itemsPerPage.value, pageNo.value * itemsPerPage.value)
    })
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";
    .container {
        overflow: visible;

        h5 {
            font-weight: normal;
        }

        .side-bar {
            padding-top: 2rem;
            // padding-left: 2rem !important;
            .side-bar-item {
                padding-top: 0.938rem !important;
                padding-bottom: 0.938rem !important;
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
    }
</style>