<template>
    <ListsLayout
        :model-value="tagsSelected ?? ''"
        :categories="normalizedTags"
        id-prefix="tag"
        :show-sidebar="false"
        @update:model-value="handleTagChange"
    >
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
            compact
            nofollow
        />
    </ListsLayout>
</template>

<script setup lang="ts">
    import { navigate } from "astro:transitions/client"
    import { computed, ref, watch } from "vue"
    import CustomSelect from "~/components/common/CustomSelect.vue"
    import PaginationContainer from "~/components/common/PaginationContainer.vue"
    import ListsLayout from "~/components/layouts/ListsLayout.vue"
    import { visibleTags } from "~/utils/blueprints/visibleTags"

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
        visibleTags(props.tags).map((t) => ({ id: t.name, label: t.name })),
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

        // Params at their defaults stay OUT of the URL, so a clean visit
        // never turns into /blueprints?page=1&size=24&sort=A-Z.
        const isSame =
            (currentUrl.searchParams.get("page") ?? "1") ===
                detail.page.toString() &&
            (currentUrl.searchParams.get("size") ?? "24") ===
                detail.size.toString() &&
            (currentUrl.searchParams.get("tags") ?? "") ===
                (tagsToStore ?? "") &&
            (currentUrl.searchParams.get("q") ?? "") === (detail.q ?? "") &&
            (currentUrl.searchParams.get("sort") ?? "A-Z") ===
                (detail.sort ?? "A-Z")

        if (isSame) {
            return
        }

        const newUrl = new URL(window.location.href)

        const setOrDelete = (key: string, value: string, isDefault: boolean) => {
            if (isDefault) {
                newUrl.searchParams.delete(key)
            } else {
                newUrl.searchParams.set(key, value)
            }
        }

        setOrDelete("page", detail.page.toString(), detail.page === 1)
        setOrDelete("size", detail.size.toString(), detail.size === 24)
        setOrDelete("tags", tagsToStore ?? "", !tagsToStore)
        setOrDelete("q", detail.q ?? "", !detail.q)
        setOrDelete(
            "sort",
            detail.sort ?? "A-Z",
            !detail.sort || detail.sort === "A-Z",
        )

        navigate(newUrl.pathname + newUrl.search)
    }
</script>