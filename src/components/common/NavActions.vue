<template>
    <div v-if="show" class="nav-actions">
        <button class="btn-nav prev" :disabled="isFirstPage" @click="prev" aria-label="Previous">
            <ChevronLeft />
        </button>

        <button class="btn-nav next" :disabled="isLastPage" @click="next" aria-label="Next">
            <ChevronRight />
        </button>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from "vue"
    import ChevronLeft from "vue-material-design-icons/ChevronLeft.vue"
    import ChevronRight from "vue-material-design-icons/ChevronRight.vue"

    const props = withDefaults(
        defineProps<{
            items: any[]
            pageSize: number
            show?: boolean
        }>(),
        {
            show: true,
        },
    )

    const emit = defineEmits<{
        "page-changed": [startIndex: number]
    }>()

    const currentPage = ref(1)

    const totalPages = computed(() =>
        Math.max(1, Math.ceil((props.items?.length ?? 0) / props.pageSize)),
    )

    const isFirstPage = computed(() => currentPage.value <= 1)
    const isLastPage = computed(() => currentPage.value >= totalPages.value)

    function prev() {
        if (!isFirstPage.value) {
            currentPage.value -= 1
        }
    }

    function next() {
        if (!isLastPage.value) {
            currentPage.value += 1
        }
    }

    watch(
        [currentPage, () => props.pageSize],
        () => {
            const startIndex = (currentPage.value - 1) * props.pageSize
            emit("page-changed", startIndex)
        },
        { immediate: true },
    )

    watch([() => props.items?.length, () => props.pageSize], () => (currentPage.value = 1))
</script>

<style scoped lang="scss">
    @import "~/assets/styles/variable";

    .nav-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        .btn-nav {
            width: 40px;
            height: 32px;
            border: 1px solid var(--ks-border-secondary);
            background: var(--ks-background-secondary);
            padding: 8px 12px;
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--ks-content-primary);
            transition: background-color 0.12s ease;
            &:disabled {
                opacity: 0.35;
                cursor: not-allowed;
            }
            :deep(svg) {
                bottom: 0 !important;
            }
        }
    }
</style>