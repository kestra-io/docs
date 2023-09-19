<template>
    <nav aria-label="Page navigation">
        <ul class="pagination">
            <li class="page-item" @click="changePage({ direction: 'previous' })" role="button">
                <span class="page-link text-dark fw-bold" tabindex="-1" aria-disabled="true"><ChevronLeft /></span>
            </li>
            <li v-for="n in totalPages" :key="n" role="button" class="page-item" :class="{ 'active': currentPage == n }" @click="changePage({ pageNo: n })"><span class="page-link text-dark fw-bold">{{ n }}</span></li>
            <li class="page-item" @click="changePage({ direction: 'next' })" role="button">
                <span class="page-link text-dark fw-bold"><ChevronRight /></span>
            </li>
        </ul>
    </nav>
</template>

<script>
import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue"
import ChevronRight from "vue-material-design-icons/ChevronRight.vue"
export default {
    components: { ChevronLeft, ChevronRight },
    data() {
        return {
            currentPage: 1
        }
    },
    props: {
        totalPages: {
            type: Number,
            required: true
        }
    },
    methods: {
        changePage(event) {
            if(event.direction && event.direction == 'previous' && this.currentPage > 1) {
                this.currentPage--
            }
            else if(event.direction && event.direction == 'next' && this.currentPage < this.totalPages) {
                this.currentPage++
            }
            else if(event.pageNo) {
                this.currentPage = event.pageNo
            }
        }
    },
    watch: {
        currentPage(value) {
            this.$emit('onPageChange', value)
        },
        totalPages() {
            this.currentPage = 1
            this.$emit('onPageChange', this.currentPage)
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../assets/styles/variable";
.pagination {
    li {
        margin-right: 0.5rem;
        position: relative;
        z-index: 2;
    }
    .active span {
        background-color: white !important;
    }
}
</style>