<template>
    <nav aria-label="Page navigation">
        <ul class="pagination mb-0">
            <li class="page-item" @click="changePage({ direction: 'previous' })" role="button">
                <span class="page-link text-dark fw-bold arrow-button" tabindex="-1" aria-disabled="true"><ChevronLeft /></span>
            </li>
            <li v-for="n in pages" :key="n" :role="n === morePagesPlaceholder ? '' : 'button'" class="page-item" :class="{ 'active': currentPage === n, 'disabled': n === morePagesPlaceholder }" @click="changePage({ pageNo: n })"><span class="page-list-item page-link text-dark fw-bold">{{ n }}</span></li>
            <li class="page-item" @click="changePage({ direction: 'next' })" role="button">
                <span class="page-link text-dark fw-bold arrow-button"><ChevronRight /></span>
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
            currentPage: 1,
            morePagesPlaceholder: "..."
        }
    },
    props: {
        totalPages: {
            type: Number,
            required: true
        },
    },
    mounted() {
        if(this.$route.query.page) {
            this.currentPage = parseInt(this.$route.query.page)
        }
    },
    methods: {
        changePage(event) {
            if(event.direction && event.direction === 'previous' && this.currentPage > 1) {
                this.currentPage--
            }
            else if(event.direction && event.direction === 'next' && this.currentPage < this.totalPages) {
                this.currentPage++
            }
            else if(event.pageNo && event.pageNo !== this.morePagesPlaceholder) {
                this.currentPage = event.pageNo
            }
        },
        paginate(current_page, last_page) {
            let pages = [];
            for (let i = 1; i <= last_page; i++) {
                let offset = 1;
                if (i === 1 || (current_page - offset <= i && current_page + offset >= i) || i === current_page || i === last_page) {
                    pages.push(i);
                } else if (i === current_page - (offset + 1) || i === current_page + (offset + 1)) {
                    pages.push(this.morePagesPlaceholder);
                }
            }
            return pages;
        }
    },
    watch: {
        currentPage(value) {
            this.$emit('onPageChange', value)
        },
        totalPages() {
            this.currentPage = 1
        }
    },
    computed: {
        pages() {
            return this.paginate(this.currentPage, this.totalPages)
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

    .page-list-item {
        border-radius: 4px;
        border: 1px solid $purple-13;
        padding: 8px 16px;
        color: $black;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;

        &:hover {
            color: $white !important;
        }
    }

    .active {
        .page-list-item {
            border-color: $primary;
            color: $primary !important;
        }
    }

    .arrow-button {
        padding: 1px 8px;
        font-size: 24px;

        &:hover {
            background-color: $primary;
            color: $white !important;
        }

        &:focus {
            box-shadow: none;
            background-color: $white;
        }
    }
}
</style>