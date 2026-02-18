<template>
    <section>
        <div class="container text-body">
            <div class="header-container">
                <div class="header container d-flex flex-column align-items-center gap-3">
                    <h1 data-usal="fade-l">Blueprints</h1>
                    <h4 data-usal="fade-r">
                        The first step is always the hardest. <span class="highlight">Explore blueprints</span> to kick-start your next flow
                    </h4>
                    <div class="col-12 search-input position-relative">
                        <input
                            type="search"
                            class="form-control form-control-lg"
                            placeholder="Search across 250+ blueprints"
                            v-model="searchQueryModel"
                        />
                        <Magnify class="search-icon" />
                    </div>
                </div>
            </div>
            <div class="mt-5" data-usal="fade-l">
                <button
                    v-for="tag in orderedTags"
                    :key="tag.name"
                    :class="{ active: props.tagsSelected?.includes(tag.name) }"
                    @click="setTagBlueprints(tag)"
                    class="m-1 rounded-button"
                >
                    {{ tag.name }}
                </button>
            </div>
            <div class="row my-5">
                <template v-if="blueprints?.length">
                    <div
                        v-for="blueprint in blueprints"
                        :key="blueprint.id"
                        class="col-lg-4 col-md-6 mb-4"
                        data-usal="zoomin"
                    >
                        <ListCard :blueprint="blueprint" :tags="tags" :href="generateCardHref(blueprint)" />
                    </div>
                </template>

                <div v-else class="col-12 d-flex flex-column align-items-center justify-content-center py-5">
                    <h4 class="text-white mb-4">No blueprints for your selection</h4>
                    <button class="rounded-button active" @click="resetFilters">Reset all tags</button>
                </div>

                <CommonPaginationContainer
                    :current-url="currentUrl"
                    :total-items="total"
                    @update="changePage"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from "vue"
    import { navigate } from "astro:transitions/client"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import ListCard from "~/components/blueprints/ListCard.vue"
    import CommonPaginationContainer from "~/components/common/PaginationContainer.vue"


    const props = defineProps<{
        tags: BlueprintTag[]
        tagsSelected?: string[]
        currentPage: number
        itemsPerPage: number
        total: number
        currentUrl: string
        blueprints: Blueprint[]
        q?: string
    }>()

    const searchQueryModel = ref(props.q ?? "")
    watch(() => props.q, (newVal) => {
        searchQueryModel.value = newVal ?? ""
    })

    const filteredTags = computed(() => props.tagsSelected?.filter((tag) => tag !== "All tags") ?? [])

    const CUSTOM_ORDER = ["Getting Started", "Core", "Infrastructure", "Data", "AI", "Business", "Cloud"]

    const orderedTags = computed(() => {
        const sortedTags = [...props.tags].sort((a, b) => {
            const indexA = CUSTOM_ORDER.indexOf(a.name)
            const indexB = CUSTOM_ORDER.indexOf(b.name)
            return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
        })
        return [{ name: "All tags" }, ...sortedTags]
    })

    const setTagBlueprints = (tagVal: BlueprintTag) => {
        if (tagVal.name === "All tags") {
            changePage({ tags: ["All tags"] })
            return
        }

        const currentTags = [...filteredTags.value]
        const index = currentTags.indexOf(tagVal.name)
        
        if (index === -1) {
            currentTags.push(tagVal.name)
        } else {
            currentTags.splice(index, 1)
        }

        changePage({ tags: currentTags.length ? currentTags : ["All tags"] })
    }

    const resetFilters = () => {
        changePage({ tags: ["All tags"], q: "", page: 1 })
    }

    const changePage = (detailPayload: { page?: number; size?: number; tags?: string[]; q?: string }) => {
        if (typeof window === "undefined") return

        const detail = {
            page: props.currentPage,
            size: props.itemsPerPage,
            tags: filteredTags.value,
            q: props.q,
            ...detailPayload,
        }

        const isSame =
            detail.page === props.currentPage &&
            detail.size === props.itemsPerPage &&
            JSON.stringify(detail.tags) === JSON.stringify(filteredTags.value) &&
            detail.q === props.q

        if (isSame && !detailPayload.page && !detailPayload.tags && detailPayload.q === undefined) return

        const tagsToStore = detail.tags?.filter((tag) => tag !== "All tags")
        const newUrl = new URL(window.location.href)
        
        newUrl.searchParams.set("page", detail.page.toString())
        newUrl.searchParams.set("size", detail.size.toString())
        
        if (tagsToStore?.length) newUrl.searchParams.set("tags", tagsToStore.join(","))
        else newUrl.searchParams.delete("tags")
        
        if (detail.q) newUrl.searchParams.set("q", detail.q)
        else newUrl.searchParams.delete("q")

        navigate(newUrl.pathname + newUrl.search)
    }

    const generateCardHref = (blueprint: Blueprint) => `/blueprints/${blueprint.id}`

    let queryTimeout: ReturnType<typeof setTimeout>
    watch(searchQueryModel, (newQuery) => {
        if (queryTimeout) clearTimeout(queryTimeout)
        queryTimeout = setTimeout(() => {
            changePage({ q: newQuery, page: 1 })
        }, 500)
    })
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    section {
        background: var(--ks-background-body);
        padding: $spacer * 4 0;
    }

    .header-container {
        background: url("/landing/plugins/bg.svg") no-repeat top;
        .header {
            padding-bottom: calc($spacer * 4.125);
            h1, h4 {
                color: var(--ks-content-primary);
                text-align: center;
                margin-bottom: 0;
            }
            .search-input {
                max-width: 21rem;
                input {
                    border-radius: $border-radius;
                    border: $block-border;
                    background-color: var(--ks-background-input);
                    color: var(--ks-content-primary);
                    padding-left: 2.5rem;
                    font-size: $font-size-md;
                    &::placeholder {
                        color: var(--ks-content-secondary);
                        font-size: $font-size-md;
                    }
                    &:focus {
                        border-color: var(--ks-border-active);
                        box-shadow: none;
                    }
                }
                .search-icon {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: calc($spacer * 1.125);
                    font-size: calc($spacer * 1.125);
                    color: var(--ks-content-primary);
                }
            }
        }
    }

    .rounded-button {
        border-radius: $border-radius;
        color: var(--ks-content-primary);
        padding: calc($spacer / 2) $spacer;
        margin-right: calc($spacer / 2);
        background-color: var(--ks-background-tertiary);
        border: 0.063rem solid var(--ks-border-primary);
        font-weight: bold;
        font-size: $font-size-sm;
        line-height: 1.375rem;
        cursor: pointer;
        transition: all 0.2s ease;
        &.active {
            background-color: var(--ks-background-button-primary-hover);
            border-color: var(--ks-background-button-primary-hover);
            color: #fff;
        }
        &:hover:not(.active) {
            background-color: var(--ks-background-secondary);
        }
    }

    :deep(.pagination-container) {
        .form-select {
            border-radius: 4px;
            border: $block-border;
            color: var(--ks-content-primary);
            text-align: center;
            font-size: $font-size-sm;
            font-weight: 700;
        }
    }
</style>