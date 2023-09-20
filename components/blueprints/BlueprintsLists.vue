<template>
<div class="mt-5">
    <p class="top-breadcrumb" data-aos="fade-right">
        Solutions
    </p>
    <h1 data-aos="fade-left">Blueprints</h1>
    <h5 data-aos="fade-right">The first step is always the hardest. Explore blueprints to kick-start your next flow.</h5>
    <div class="grid gap-3 mt-5" data-aos="fade-left">
        <button
            v-for="fil in filters"
            :key="fil.name"
            :class="{ 'active': fil.name === filter.name }"
            @click="setFilterBlueprints(fil)"
            class="m-1 rounded-button"
        >
            {{ fil.name }}
        </button>
    </div>
    <div class="row my-5">
        <div class="row mb-4 justify-content-center">
            <div class="col-12 col-md-6 col-lg-4">
                <input type="text" class="form-control form-control-lg" id="search-input" placeholder="Search blueprints" v-model="searchQuery">
            </div>
        </div>
        <div class="col-lg-4 col-md-6 mb-4" v-for="blueprint in blueprints" :key="blueprint.id">
            <BlueprintsBlueprintCard :blueprint="blueprint" :icons="icons" data-aos="zoom-in" />
        </div>
        <div class="d-flex justify-content-between">
            <div class="items-per-page">
                <select class="form-select" aria-label="Default select example" v-model="itemsPerPage">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                </select>
            </div>
            <div class="d-flex align-items-baseline" v-if="totalBlueprints > itemsPerPage">
                <BlueprintsPagination :total-pages="totalPages" @on-page-change="changePage" />
                <span class="total-pages">Total {{ totalBlueprints }}</span>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
const currentPage = ref(1)
const itemsPerPage = ref(25)
const blueprints = ref([])
const filter = ref({ name: 'All tags' })
const filters = ref([])
const icons = ref()
const totalPages = ref(0)
const totalBlueprints = ref(0)
const searchQuery = ref('')
const route = useRoute()
const router = useRouter()

const { data: filtersData } = await useAsyncData('filters', () => {
    return $fetch('https://api.kestra.io/v1/blueprints/tags')
})


if(filtersData.value) {
    filters.value = [{ name: 'All tags' }, ...filtersData.value]
}

const setFilterBlueprints = (filterVal) => {
    filter.value = filterVal
}

if(Object.keys(route.query).length) {
    if(route.query.page) currentPage.value = parseInt(route.query.page)
    if(route.query.size) itemsPerPage.value = parseInt(route.query.size)
    if(route.query.tags) filter.value = filters.value.find(f => f.id == route.query.tags)
    if(route.query.q) searchQuery.value = route.query.q
}

const { data: iconsData } = await useAsyncData('icons', () => {
    return $fetch('https://api.kestra.io/v1/plugins/icons')
})

if(iconsData.value) {
    icons.value = iconsData.value
}

const { data: blueprintsData } = await useAsyncData('blueprints', () => {
    return $fetch(`https://api.kestra.io/v1/blueprints?page=${currentPage.value}&size=${itemsPerPage.value}${route.query.tags ? `&tags=${filter.value.id}` : ''}${route.query.q ? `&q=${searchQuery.value}` : ''}`)
})

const setBlueprints = (allBlueprints, total) => {
    blueprints.value = allBlueprints
    totalBlueprints.value = total
    totalPages.value = Math.ceil(total / itemsPerPage.value)
}

if(blueprintsData.value) {
    setBlueprints(blueprintsData.value.results, blueprintsData.value.total)
}

const changePage = (pageNo) => {
    currentPage.value = pageNo
}

let timer;
watch([currentPage, itemsPerPage, filter, searchQuery], ([pageVal, itemVal, filterVal, searchVal], [__, oldItemVal, oldFilterVal]) => {
    if(timer) {
        clearTimeout(timer)
    }
    timer = setTimeout(async () => {

        const { data } = await useFetch(`https://api.kestra.io/v1/blueprints?page=${(itemVal != oldItemVal) || (filterVal != oldFilterVal) ? 1 : pageVal}&size=${itemVal}${Object.keys(filterVal).length && (itemVal == oldItemVal) && filterVal.name != 'All tags' ? `&tags=${filterVal.id}` : ''}${searchVal.length ? `&q=${searchVal}` : ''}`)
        if(itemVal != oldItemVal) filter.value = {}
        setBlueprints(data.value.results, data.value.total)

        function getQuery() {
            let query = {
                page: pageVal,
                size: itemVal,
            }
            if(searchVal.length) {
                query['q'] = searchVal
            }
            if(filterVal.name != 'All tags') {
                query['tags'] = filterVal.id
            }

            return query
        }

        router.push({
            query: getQuery()
        })
        
    }, 500)
})
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

h5 {
    font-weight: normal;
}
.form-control {
    background: url('/search.svg') no-repeat 13px;
    padding-left: 2.5rem;
}
.total-pages {
    font-size: $font-size-xs;
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
</style>