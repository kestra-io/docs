<template>
    <section>
        <div class="background"></div>
        <div class="header-container">
            <div class="header container d-flex flex-column align-items-center gap-2">
                <h1 data-usal="fade-l">Customers Stories</h1>
                <h5 data-usal="fade-l">
                    Learn how we helped companies manage their critical operations.
                </h5>
            </div>
        </div>
        <div class="list-container container px-md-0">
            <div class="row mb-4">
                <template v-for="(story, index) in stories" :key="index">
                    <div class="col-12">
                        <StoriesRowCard :story />
                    </div>
                </template>
            </div>
            <div class="d-flex justify-content-between my-5 pagination-container">
                <div class="items-per-page">
                    <select
                        class="form-select"
                        aria-label="Default select example"
                        v-model="itemsPerPage"
                        @change="fetchPageData"
                    >
                        <option :value="10">10</option>
                        <option :value="25">25</option>
                        <option :value="50">50</option>
                    </select>
                </div>
                <CommonPagination
                    v-if="totalPages > 1"
                    :current-url="fullPath"
                    :totalPages="totalPages"
                    v-model:current-page="currentPage"
                    @update:current-page="changePage"
                />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
    import { ref, computed } from "vue"
    import StoriesRowCard from "~/components/stories/RowCard.vue"
    import CommonPagination from "~/components/common/Pagination.vue"

    const props = withDefaults(
        defineProps<{
            fullPath: string
            stories: Array<Story>
            totalStories?: number
        }>(),
        {
            totalStories: 1,
        },
    )
    const emits = defineEmits(["fetchPageData"])
    const itemsPerPage = ref(25)
    const currentPage = ref(1)
    const totalPages = computed(() => {
        return Math.ceil(props.totalStories / itemsPerPage.value)
    })
    const changePage = () => {
        // FIXME: find an astro friendly way to do this
        window.scrollTo(0, 0)
        fetchPageData()
    }

    const fetchPageData = () => {
        emits("fetchPageData", {
            currentPage: currentPage.value,
            itemsPerPage: itemsPerPage.value,
        })
    }
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    section {
        position: relative;
        width: 100%;
        padding: calc($spacer * 4) $spacer;
        overflow: hidden;
        @include media-breakpoint-down(xl) {
            padding: calc($spacer * 2) $spacer;
        }
        .background {
            position: fixed;
            inset: 0;
            z-index: -1;
            background: var(--ks-background-body) url("/landing/usecases/header-bg.svg") no-repeat bottom / contain;
            pointer-events: none;
        }
        .list-container {
            .row {
                gap: 2rem;
                align-items: center;
            }
        }
        .header-container {
            background: url("/landing/usecases/header-bg.svg") no-repeat bottom / cover;
            .header {
                padding: calc($spacer * 2) $spacer;
            }
        }

        .items-per-page .form-select {
            border-radius: 4px;
            border: $block-border;
            color: var(--ks-content-primary);
            text-align: center;
            font-size: 14px;
        }
    }
</style>