<template>
    <div class="load-more-blueprints">
        <div class="row g-3">
            <slot name="initial" />
            <div
                v-for="blueprint in loadedBlueprints"
                :key="blueprint.id"
                class="col-md-4 col-lg-6 col-xl-6 col-xxl-4"
            >
                <BlueprintCard
                    :blueprint="blueprint"
                    :tags="tags"
                    :href="`/blueprints/${blueprint.id}`"
                />
            </div>
        </div>

        <div class="load-more-footer">
            <span class="count-label">
                Showing {{ shownCount }} of {{ total }}
            </span>
            <button
                v-if="shownCount < total"
                type="button"
                class="btn btn-secondary load-more-btn"
                :disabled="loading"
                @click="loadMore"
            >
                {{ loading ? "Loading..." : "Load more templates" }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { ref, computed } from "vue"
    import { $fetchApi } from "~/utils/fetch"
    import BlueprintCard from "~/components/plugins/blueprints/BlueprintCard.vue"

    const props = defineProps<{
        tagId?: string
        q?: string
        tags: BlueprintTag[]
        total: number
        initialShown: number
        pageSize: number
    }>()

    const loadedBlueprints = ref<Blueprint[]>([])
    const currentPage = ref(1)
    const loading = ref(false)

    const shownCount = computed(
        () => props.initialShown + loadedBlueprints.value.length,
    )

    const loadMore = async () => {
        if (loading.value) return
        loading.value = true
        try {
            const nextPage = currentPage.value + 1
            const params = new URLSearchParams({
                size: String(props.pageSize),
                page: String(nextPage),
            })
            if (props.tagId) params.set("tags", props.tagId)
            if (props.q) params.set("q", props.q)

            const data = await $fetchApi<{ results: Blueprint[] }>(
                `/blueprints/versions/latest?${params.toString()}`,
            )
            loadedBlueprints.value.push(...(data?.results ?? []))
            currentPage.value = nextPage
        } catch (e) {
            console.error("Failed to load more blueprints", e)
        } finally {
            loading.value = false
        }
    }
</script>

<style scoped lang="scss">
    .load-more-blueprints {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .load-more-footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding-top: 0.5rem;
    }

    .count-label {
        color: var(--ks-content-tertiary);
        font-size: $font-size-sm;
    }

    .load-more-btn {
        padding: 0.625rem 1.75rem;
        border-radius: $border-radius-lg;
        font-weight: 700;
        font-size: $font-size-sm;

        &:disabled {
            opacity: 0.6;
            cursor: default;
        }
    }
</style>
