<template>
    <ListsLayout
        :model-value="tagsSelected ?? ''"
        :categories="normalizedTags"
        id-prefix="tag"
        @update:model-value="handleTagChange"
    >
        <template #top-bar>
            <h1>Blueprints</h1>
            <p>
                The first step is always the hardest. Explore blueprints
                to kick-start your next flow
            </p>
            <slot name="search" />
        </template>

        <div class="d-flex align-items-center justify-content-between">
            <p class="fw-bold mb-0">{{ total }} Blueprints</p>

            <div class="d-flex align-items-center gap-2">
                <CustomSelect
                    v-model="sortBy"
                    :options="sortOptions"
                    label="Sort by:"
                    id="sortSelect"
                />
            </div>
        </div>

        <!-- For Blueprints Grid -->
        <slot />

        <PaginationContainer
            :showTotal="false"
            :total-items="total"
            @update="changePage"
            :current-url="currentUrl"
        />
    </ListsLayout>
</template>

<script setup lang="ts">
    import { navigate } from "astro:transitions/client"
    import { computed, ref, watch } from "vue"
    import CustomSelect from "~/components/common/CustomSelect.vue"
    import PaginationContainer from "~/components/common/PaginationContainer.vue"
    import ListsLayout from "~/components/layouts/ListsLayout.vue"

    const props = defineProps<{
        tags: BlueprintTag[]
        tagsSelected?: string
        currentPage: number
        itemsPerPage: number
        total: number
        currentUrl: string
        blueprints: Blueprint[]
        q?: string
        sortBy?: string
    }>()

    const normalizedTags = computed(() =>
        props.tags.map((t) => ({ id: t.name, label: t.name })),
    )

    const sortBy = ref(props.sortBy ?? "A-Z")
    const sortOptions = [
        { value: "A-Z", label: "Name A-Z" },
        { value: "Z-A", label: "Name Z-A" },
    ]

    watch(
        () => props.sortBy,
        (newVal) => {
            sortBy.value = newVal ?? "A-Z"
        },
    )

    watch(sortBy, (value) => {
        changePage({ sort: value, page: 1 })
    })

    const handleTagChange = (tagName: string) => {
        changePage({ tags: tagName === "" ? undefined : tagName, page: 1 })
    }

    const changePage = (detailPayload: {
        page?: number
        size?: number
        tags?: string
        q?: string
        sort?: string
    }) => {
        if (typeof window === "undefined") {
            return
        }

        const detail = {
            page: props.currentPage,
            size: props.itemsPerPage,
            tags: props.tagsSelected,
            q: props.q,
            sort: props.sortBy,
            ...detailPayload,
        }

        const currentUrl = new URL(window.location.href)
        const tagsToStore = detail.tags

        const isSame =
            currentUrl.searchParams.get("page") === detail.page.toString() &&
            currentUrl.searchParams.get("size") === detail.size.toString() &&
            (currentUrl.searchParams.get("tags") ?? "") ===
                (tagsToStore ?? "") &&
            (currentUrl.searchParams.get("q") ?? "") === (detail.q ?? "") &&
            (currentUrl.searchParams.get("sort") ?? "A-Z") ===
                (detail.sort ?? "A-Z")

        if (isSame) {
            return
        }

        const newUrl = new URL(window.location.href)

        newUrl.searchParams.set("page", detail.page.toString())
        newUrl.searchParams.set("size", detail.size.toString())

        if (tagsToStore) {
            newUrl.searchParams.set("tags", tagsToStore)
        } else {
            newUrl.searchParams.delete("tags")
        }

        if (detail.q) {
            newUrl.searchParams.set("q", detail.q)
        } else {
            newUrl.searchParams.delete("q")
        }

        if (detail.sort) {
            newUrl.searchParams.set("sort", detail.sort)
        } else {
            newUrl.searchParams.delete("sort")
        }

        navigate(newUrl.pathname + newUrl.search)
    }
</script>