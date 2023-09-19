<template>
<div class="mt-5">
    <p class="top-breadcrumb" data-aos="fade-right">
        Solutions
    </p>
    <h1 data-aos="fade-left">Blueprints</h1>
    <h5 data-aos="fade-right">The first step is always the hardest. Explore blueprints to kick-start your next flow.</h5>
    <div class="grid gap-3 mt-5" data-aos="fade-left">
        <button
            v-for="cat in categories"
            :key="cat.id"
            :class="{ 'active': filter === cat.id }"
            @click="setFilterBlueprints(cat.id)"
            class="m-1 rounded-button"
        >
            {{ cat.name }}
        </button>
    </div>
    <div class="row my-5">
        <div class="row mb-4 justify-content-center">
            <div class="col-12 col-md-6 col-lg-4">
                <input type="text" class="form-control form-control-lg" id="search-input" placeholder="Search blueprints">
            </div>
        </div>
        <div class="col-lg-4 col-md-6 mb-4" v-for="blueprint in blueprints" :key="blueprint.id">
            <BlueprintsBlueprintCard :blueprint="blueprint" data-aos="zoom-in" />
        </div>
        <div class="d-flex justify-content-between">
            <div class="items-per-page">
                <select class="form-select" aria-label="Default select example" v-model="itemsPerPage">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                </select>
            </div>
            <div class="d-flex align-items-baseline">
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
const filter = ref('')
const categories = ref([])
const totalPages = ref(0)
const totalBlueprints = ref(0)

const { data: filtersData } = await useAsyncData('categories', () => {
    return $fetch('https://api.kestra.io/v1/blueprints/tags')
})

if(filtersData.value) {
    categories.value = filtersData.value
    filter.value = filtersData.value[0].id
}

const { data: blueprintsData } = await useAsyncData('blueprints', () => {
    return $fetch(`https://api.kestra.io/v1/blueprints?page=${currentPage.value}&size=${itemsPerPage.value}`)
})

if(blueprintsData.value) {
    blueprints.value = blueprintsData.value.results
    totalBlueprints.value = blueprintsData.value.total
    totalPages.value = Math.ceil(blueprintsData.value.total / blueprints.value.length)
}

const setFilterBlueprints = (id) => {
    filter.value = id
}
const changePage = (pageNo) => {
    currentPage.value = pageNo
}

watch([currentPage, itemsPerPage], async ([pageVal, itemVal], [oldPageVal, oldItemVal]) => {
    const { data } = await useFetch(`https://api.kestra.io/v1/blueprints?page=${itemVal != oldItemVal ? 1 : pageVal}&size=${itemVal}`)
    blueprints.value = data.value.results
    totalPages.value = Math.ceil(data.value.total / blueprints.value.length)
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