<template>
    <nav aria-label="Page navigation">
        <ul class="pagination mb-0">
            <li class="page-item" role="button">
                <a
                    class="page-link fw-bold arrow-button"

                    :href="getPageUrl(currentPage - 1)"
                    @click.prevent="changePage({ direction: 'previous' })"
                >
                    <ChevronLeft />
                </a>
            </li>
            <li
                v-for="n in pages"
                :key="n"
                :role="n === morePagesPlaceholder ? '' : 'button'"
                class="page-item"
                :class="{
                    active: currentPage === n,
                    disabled: n === morePagesPlaceholder,
                }"
            >
                <span
                    v-if="n === morePagesPlaceholder"
                    class="page-list-item page-link fw-bold"

                    >{{ n }}</span
                >
                <a
                    v-else
                    class="page-list-item page-link fw-bold"

                    :href="getPageUrl(n)"
                    @click.prevent="changePage({ pageNo: n })"
                    >{{ n }}</a
                >
            </li>
            <li class="page-item" @click="changePage({ direction: 'next' })" role="button">
                <a
                    class="page-link fw-bold arrow-button"

                    :href="getPageUrl(currentPage + 1)"
                    @click.prevent="changePage({ direction: 'next' })"
                >
                    <ChevronRight />
                </a>
            </li>
        </ul>
    </nav>
</template>

<script lang="ts" setup>
    import { computed, useTemplateRef, watch } from "vue"
    import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"

    const morePagesPlaceholder = "..." as const

    const props = withDefaults(
        defineProps<{
            totalPages: number
            currentUrl: string
            currentPage?: number
        }>(),
        {
            currentPage: 1,
        },
    )

    function getPageUrl(page?: number) {
        if (page === undefined || page < 1 || page > props.totalPages) {
            return undefined
        }
        const url = new URL(props.currentUrl)
        url.searchParams.set("page", page.toString())
        return url.pathname + url.search
    }

    const emit = defineEmits<{
        (e: "update:currentPage", value: number): void
    }>()

    watch(
        () => props.totalPages,
        () => {
            emit("update:currentPage", 1)
        },
    )

    function changePage(event: { direction?: "previous" | "next"; pageNo?: number | "..." }) {
        const currentPage = props.currentPage
        if (event.direction === "previous" && currentPage > 1) {
            emit("update:currentPage", currentPage - 1)
        } else if (event.direction === "next" && currentPage < props.totalPages) {
            emit("update:currentPage", currentPage + 1)
        } else if (event.pageNo && event.pageNo !== morePagesPlaceholder) {
            emit("update:currentPage", event.pageNo)
        }
    }

    function paginate(current_page: number, last_page: number): (number | "...")[] {
        const pages: (number | "...")[] = []
        for (let i = 1; i <= last_page; i++) {
            const offset = 1
            if (
                i === 1 ||
                (current_page - offset <= i && current_page + offset >= i) ||
                i === current_page ||
                i === last_page
            ) {
                pages.push(i)
            } else if (i === current_page - (offset + 1) || i === current_page + (offset + 1)) {
                pages.push(morePagesPlaceholder)
            }
        }
        return pages
    }

    const pages = computed<(number | "...")[]>(() => paginate(props.currentPage, props.totalPages))
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";
    .pagination {
        li {
            margin-right: 0.5rem;
            position: relative;
            z-index: 2;
        }
        .active span {
            background-color: var(--ks-background-button-primary) !important;
        }
        .page-list-item {
            border-radius: 4px;
            border: 1px solid var(--ks-border-secondary);
            padding: 8px 16px;
            color: var(--ks-content-primary);
            background-color: var(--ks-background-button-secondary);
            text-align: center;
            font-size: $font-size-sm;
            font-style: normal;
            font-weight: 700;
            line-height: 22px;
            &:hover {
                border-color: var(--ks-border-active);
            }
        }
        .active {
            .page-list-item {
                border-color: var(--ks-border-active);
            }
        }
        .arrow-button {
            padding: 1px 8px;
            font-size: 24px;
            border-color: var(--ks-border-primary);
            color: var(--ks-content-primary);
            background-color: var(--ks-background-button-secondary);
            font-weight: 700;
            &:hover {
                border-color: var(--ks-border-active);
            }
            &:focus {
                box-shadow: none;
                background-color: var(--ks-background-button-primary);
            }
        }
    }
</style>