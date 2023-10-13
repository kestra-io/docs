<template>
  <div class="container mt-5">
    <div class="bd-title">
      <p class="top-breadcrumb" data-aos="fade-right">
        <NuxtLink href="/stories">stories</NuxtLink>
      </p>
      <h1 data-aos="fade-left"> Kestra Stories</h1>
      <h5 data-aos="fade-left">Learn how we helped companies manage their critical operations.</h5>
    </div>
    <div class="row my-4 " >
        <div class="col-12 col-md-4 mb-4" v-for="(cardData,index) in paginatedStories" :key="index">
            <StoriesCard :cardData="cardData"/>
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
    <StoriesFooter/>
  </div>
</template>
<script setup>
const cardData = ref([
    {
    img : '/stories/blogs/displayce.svg',
    name : 'DESIPLAYCE',
    title : 'Scaling Data Operations with Kestra'},
    {
    img : '/stories/blogs/reglo.svg',
    name : 'RELGO',
    title : 'Unified Control Panel and Simplified Orchestration with kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
{
    img : '/stories/blogs/lm.svg',
    name : 'LEROY MERLIN',
    title : 'Enabling datamesh architecture and 900% increase in data production with Kestra',
},
])
const itemsPerPage = ref(25);
const currentPage = ref(1);
const totalPages = computed(()=>{
    return Math.ceil(cardData.value.length / itemsPerPage.value)
    
})
const paginatedStories = computed(() => {
        return cardData.value.slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value)
    })
const changePage = (pageNo) => {
    currentPage.value = pageNo
    window.scrollTo(0, 0)
}
</script>
<style scoped>

</style>