<script lang="ts" setup>
    import { computed, ref, watch } from "vue"
    import CommonPagination from "~/components/common/Pagination.vue"

    const props = withDefaults(
        defineProps<{
            totalItems: number
            currentUrl: string
            sizeOptions?: number[]
            defaultSize?: number
            showTotal?: boolean
        }>(),
        {
            sizeOptions: () => [12, 24, 48],
            defaultSize: 24,
            showTotal: true,
        },
    )

    const localCurrentUrl = ref(props.currentUrl)

    const urlParams = computed(() => {
        return new URL(localCurrentUrl.value).searchParams
    })

    const size = computed(() => {
        return parseInt(urlParams.value.get("size") ?? props.defaultSize.toString())
    })

    const page = computed(() => {
        return parseInt(urlParams.value.get("page") ?? "1")
    })

    const itemsPerPage = ref(size.value)
    const currentPage = ref(page.value)

    const totalPages = computed(() => {
        return Math.ceil(props.totalItems / itemsPerPage.value)
    })

    const emit = defineEmits<{
        (e: "update", payload: { size: number; page: number }): void
    }>()

    watch(
        [itemsPerPage, currentPage],
        ([newSize, newPage]) => {
            // Update URL without navigation
            if (typeof window === "undefined") return
            const newUrl = new URL(window.location.href)
            const params = newUrl.searchParams
            if (newSize === props.defaultSize) {
                params.delete("size")
            } else {
                params.set("size", newSize.toString())
            }
            if (newPage === 1) {
                params.delete("page")
            } else {
                params.set("page", newPage.toString())
            }
            localCurrentUrl.value = newUrl.toString()

            emit("update", { size: newSize, page: newPage })
            window.history.pushState({}, "", newUrl.toString())
        },
        { immediate: true },
    )

    watch(
        () => props.currentUrl,
        (newUrl) => {
            localCurrentUrl.value = newUrl
            itemsPerPage.value = size.value
            currentPage.value = page.value
        },
    )
</script>

<template>
    <div class="d-flex justify-content-between my-5 pagination-container">
        <div class="items-per-page">
            <select v-if="totalPages > 1" class="form-select bg-dark-2" v-model="itemsPerPage">
                <option
                    v-for="option in sizeOptions"
                    :key="option"
                    :value="option"
                    :selected="option === size"
                >
                    {{ option }}
                </option>
            </select>
        </div>
        <div class="d-flex align-items-center gap-3">
            <CommonPagination
                v-if="totalPages > 1"
                :current-url="currentUrl"
                :totalPages="totalPages"
                v-model:current-page="currentPage"
            />
            <div v-if="showTotal" class="d-flex align-items-baseline">
                <span class="total-pages">Total: {{ totalItems }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import "~/assets/styles/variable";
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