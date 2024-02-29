<template>
    <div class="header-container mt-5">
        <div class="header container d-flex flex-column align-items-center gap-3">
            <h1 data-aos="fade-left"> Customers Stories</h1>
            <h4 data-aos="fade-left">Learn how we helped companies manage their critical operations.</h4>
        </div>
    </div>
    <div class="list-container container px-md-0 pt-5">
        <div class="row mb-4">
            <div class="col-12 col-md-4 mb-4" v-for="(story, index) in stories" :key="index">
                <StoriesCard :story="story" />
            </div>
        </div>
        <div class="d-flex justify-content-between my-5 pagination-container">
            <div class="items-per-page">
                <select class="form-select bg-dark-2" aria-label="Default select example" v-model="itemsPerPage" @change="fetchPageData">
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
    @import "../../assets/styles/variable";
    .list-container {
        background: url("/landing/usecases/stories/content-bg.svg") no-repeat top;
    }
    .header-container {
        background: url("/landing/usecases/header-bg.svg") no-repeat bottom;
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

    .pagination-container .form-select {
        border-radius: 4px;
        border: $block-border;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-size: $font-size-sm;
        font-style: normal;
        font-weight: 700;
    }
</style>
