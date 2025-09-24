<template>
    <nav aria-label="Page navigation">
        <ul class="pagination mb-0">
             <li class="page-item" @click="changePage({ direction: 'previous' })" role="button">
                <span class="page-link fw-bold arrow-button bg-dark-2" tabindex="-1" aria-disabled="true"><ChevronLeft /></span>
            </li>
            <li v-for="n in pages" :key="n" :role="n === morePagesPlaceholder ? '' : 'button'" class="page-item" :class="{ 'active': currentPage === n, 'disabled': n === morePagesPlaceholder }" @click="changePage({ pageNo: n })"><span class="page-list-item bg-dark-2 page-link fw-bold">{{ n }}</span></li>
            <li class="page-item" @click="changePage({ direction: 'next' })" role="button">
                <span class="page-link fw-bold arrow-button bg-dark-2"><ChevronRight /></span>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue'
import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue"
import ChevronRight from "vue-material-design-icons/ChevronRight.vue"

const morePagesPlaceholder = '...'

const props = defineProps<{
    totalPages: number
}>()

const currentPage = defineModel<number>('currentPage', { required: true })

watch(() => props.totalPages, () => {
    currentPage.value = 1
})

function changePage(event: { direction?: 'previous' | 'next', pageNo?: number | "..." }) {
    if (event.direction === 'previous' && currentPage.value > 1) {
        currentPage.value--
    } else if (event.direction === 'next' && currentPage.value < props.totalPages) {
        currentPage.value++
    } else if (event.pageNo && event.pageNo !== morePagesPlaceholder) {
        currentPage.value = event.pageNo
    }
}

function paginate(current_page: number, last_page: number): (number | string)[] {
    const pages: (number | string)[] = []
    for (let i = 1; i <= last_page; i++) {
        const offset = 1
        if (
            i === 1 ||
            (current_page - offset <= i && current_page + offset >= i) ||
            i === current_page ||
            i === last_page
        ) {
            pages.push(i)
        } else if (
            i === current_page - (offset + 1) ||
            i === current_page + (offset + 1)
        ) {
            pages.push(morePagesPlaceholder)
        }
    }
    return pages
}

const pages = computed(() => paginate(currentPage.value, props.totalPages))
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
        background-color: $primary-1 !important;
    }

    .page-list-item {
        border-radius: 4px;
        border: $block-border;
        padding: 8px 16px;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;

        &:hover {
            border-color: $primary-1;
        }
    }

    .active {
        .page-list-item {
            border-color: $primary-1;
        }
    }

    .arrow-button {
        padding: 1px 8px;
        font-size: 24px;
        border-color: $black-3;
        color: $white;

        &:hover {
            border-color: $primary-1;
        }

        &:focus {
            box-shadow: none;
            background-color: $primary-1;
        }
    }
}
</style>