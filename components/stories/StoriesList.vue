<template>
    <div class="container mt-5">
        <div class="bd-title">
          <p class="top-breadcrumb" data-aos="fade-right">
            stories
          </p>
          <h1 data-aos="fade-left" class="title"> Kestra Stories</h1>
          <h5 data-aos="fade-left" class="description">Learn how we helped companies manage their critical operations.</h5>
        </div>
        <div class="row my-4" >
            <div class="col-12 col-md-4 mb-4" v-for="(story, index) in paginatedStories" :key="index">
                <StoriesCard :story="story" :icons="icons"/>
            </div>
        </div>
        <div class="d-flex justify-content-between my-5">
            <div class="items-per-page">
                    <select class="form-select" aria-label="Default select example" v-model="itemsPerPage">
                        <option :value="10">10</option>
                        <option :value="25">25</option>
                        <option :value="50">50</option>
                    </select>
                </div>
            <CommonPagination :totalPages="totalPages"  @on-page-change="changePage"/>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    stories: {
        type: Array,
        required: true
    },
    icons: {
        type: Array,
        required: true
    }
})
const itemsPerPage = ref(25);
const currentPage = ref(1);
const totalPages = computed(()=>{
    return Math.ceil(props.stories.length / itemsPerPage.value)
    
})
const paginatedStories = computed(() => {
    return props.stories.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value)
})
const changePage = (pageNo) => {
    currentPage.value = pageNo
    window.scrollTo(0, 0)
}
</script>