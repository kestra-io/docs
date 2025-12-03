<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import CommonPagination from './Pagination.vue'

const props = withDefaults(defineProps<{
    totalItems: number,
    currentUrl: string,
    sizeOptions?: number[]
}>(), {
    sizeOptions: () => [12, 24, 48]
})

const localCurrentUrl = ref(props.currentUrl);

const urlParams = computed(() => new URL(localCurrentUrl.value).searchParams);

const size = computed(() => {
    return parseInt(urlParams.value.get('size') || '24')
})

const page = computed(() => {
    return parseInt(urlParams.value.get('page') || '1')
})

const itemsPerPage = ref(size.value);
const currentPage = ref(page.value);

const totalPages = computed(() => {
    return Math.ceil(props.totalItems / itemsPerPage.value);
});

const emit = defineEmits<{
    (e: 'update', payload: { size: number, page: number }): void
}>()

watch([itemsPerPage, currentPage], ([newSize, newPage]) => {
    // Update URL without navigation
    const newUrl = new URL(localCurrentUrl.value);
    const params = newUrl.searchParams
    if( newSize === 24 ){
        params.delete('size')
    } else {
        params.set('size', newSize.toString())
    }
    if( newPage === 1 ){
        params.delete('page')
    } else {
        params.set('page', newPage.toString())
    }
    localCurrentUrl.value = newUrl.toString();
    emit('update', { size: newSize, page: newPage });
    if( typeof window !== 'undefined' ){
        window.history.pushState({}, '', newUrl.toString());
    }
})
</script>

<template>
    <div class="d-flex justify-content-between my-5 pagination-container">
        <div class="items-per-page">
            <select
                class="form-select bg-dark-2"
                v-model="itemsPerPage"
            >
                <option
                    v-for="option in sizeOptions"
                    :key="option"
                    :value="option"
                    :selected="option === size"
                >
                    {{ option }}
                </option>
            </select>
            <pre>Items per page {{ itemsPerPage }}</pre>
        </div>
        <CommonPagination
            v-if="totalPages > 1"
            :current-url="currentUrl"
            :totalPages="totalPages"
            v-model:current-page="currentPage"
        />
        <div class="d-flex align-items-baseline">
            <span class="total-pages">Total: {{ totalItems }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import "../../assets/styles/variable";
    .pagination-container {
        margin-top: 39px;

        .form-select {
            border-radius: 4px;
            border: $block-border;
            color: $white;
            text-align: center;
            font-family: $font-family-sans-serif;
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;

        }
    }

    .items-per-page .form-select {
        border-radius: 4px;
        border: $block-border;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
    }

    .total-pages {
        font-size: $font-size-sm;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-weight: 400;
        line-height: 22px;
    }
</style>
