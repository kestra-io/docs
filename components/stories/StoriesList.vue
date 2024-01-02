<template>
    <div class="container mt-5">
        <div class="bd-title">
          <p class="top-breadcrumb" data-aos="fade-right">
            Stories
          </p>
          <h1 data-aos="fade-left" class="title"> Customers Stories</h1>
          <h5 data-aos="fade-left" class="description">Learn how we helped companies manage their critical operations.</h5>
        </div>
        <div class="row my-4">
            <div class="col-12 col-md-4 mb-4" v-for="(story, index) in stories" :key="index">
                <StoriesCard :story="story" />
            </div>
        </div>
        <div class="d-flex justify-content-between my-5">
            <div class="items-per-page">
                <select class="form-select" aria-label="Default select example" v-model="itemsPerPage" @change="fetchPageData">
                    <option :value="10">10</option>
                    <option :value="25">25</option>
                    <option :value="50">50</option>
                </select>
            </div>
            <CommonPagination :totalPages="totalPages"  @on-page-change="changePage" v-if="totalPages > 1" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    stories: {
        type: Array,
        required: true
    },
    totalStories: {
        type: Number,
        default: 1
    }
})
const emits = defineEmits(['fetchPageData'])
const itemsPerPage = ref(25);
const currentPage = ref(1);
const totalPages = computed(()=>{
    return Math.ceil(props.totalStories / itemsPerPage.value)
})
const changePage = (pageNo) => {
    currentPage.value = pageNo
    window.scrollTo(0, 0)
    fetchPageData()
}
const fetchPageData = () => {
    emits('fetchPageData', { currentPage: currentPage.value, itemsPerPage: itemsPerPage.value })
}
</script>

<style scoped lang="scss">
.title{
    font-weight: 800;
}
.description{
    font-weight: 400;
    line-height: 1.375rem;
}
</style>
