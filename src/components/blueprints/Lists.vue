<template>
    <div class="mt-5">
        <div class="header-container">
            <div class="header container d-flex flex-column align-items-center gap-3">
                <h1 data-usal="fade-l">Blueprints</h1>
                <h4 data-usal="fade-r">
                    The first step is always the hardest. Explore blueprints to kick-start your next
                    flow
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
                :class="{
                    active: props.tagsSelected?.some((item) => item === tag.name),
                }"
                @click="setTagBlueprints(tag)"
                class="m-1 rounded-button"
            >
                {{ tag.name }}
            </button>
        </div>
        <div class="row my-5">
            <div
                v-if="blueprints && blueprints.length > 0"
                class="col-lg-4 col-md-6 mb-4"
                v-for="blueprint in blueprints"
                :key="blueprint.id"
                data-usal="zoomin"
            >
                <BlueprintsListCard
                    :blueprint="blueprint"
                    :tags="tags"
                    :href="generateCardHref(blueprint)"
                />
            </div>

            <div
                v-else
                class="col-12 d-flex flex-column align-items-center justify-content-center py-5"
            >
                <h4 class="text-white mb-4">No blueprints for your selection</h4>
                <button class="rounded-button active" @click="resetFilters">Reset all tags</button>
            </div>

            <CommonPaginationContainer
                :current-url="currentUrl"
                :total-items="total"
                @update="
                    (payload) => {
                        changePage(payload)
                    }
                "
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, ref, watch } from "vue"
    import { navigate } from "astro:transitions/client"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import BlueprintsListCard from "~/components/blueprints/ListCard.vue"
    import CommonPaginationContainer from "~/components/common/PaginationContainer.vue"

    const props = defineProps<{
        tags: BlueprintTag[],
        tagsSelected?: string[],
        currentPage: number,
        itemsPerPage: number,
        total: number
        currentUrl: string
        blueprints: Blueprint[]
        q?: string
    }>()

    const searchQueryModel = ref(props.q ?? "")
    watch(() => props.q, (newVal) => {
        searchQueryModel.value = newVal ?? ""
    })

    const filteredTags = computed(() => {
        return props.tagsSelected?.filter((tag => tag !== "All tags") )
    })

    const CUSTOM_ORDER = [
        "Getting Started",
        "Core",
        "Infrastructure",
        "Data",
        "AI",
        "Business",
        "Cloud",
    ]

    const orderedTags = computed(() => {
        const sortedTags = [...props.tags].sort((a, b) => {
            let indexA = CUSTOM_ORDER.indexOf(a.name)
            let indexB = CUSTOM_ORDER.indexOf(b.name)
            if (indexA === -1) indexA = 999
            if (indexB === -1) indexB = 999
            return indexA - indexB
        })
        return [{ name: "All tags" }, ...sortedTags]
    })

    const setTagBlueprints = (tagVal: BlueprintTag) => {
        if (tagVal.name === "All tags") {
            changePage({tags: ["All tags"]})
            return
        }

        let currentTags = props.tagsSelected?.filter((t) => t !== "All tags") ?? []
        const index = currentTags.findIndex((t) => t === tagVal.name)
        if (index === -1) {
            currentTags.push(tagVal.name)
        } else {
            currentTags.splice(index, 1)
        }

        if (currentTags.length === 0) {
            changePage({tags: ["All tags"]})
        } else {
            changePage({tags: currentTags})
        }
    }

    const resetFilters = () => {
        changePage({tags: ["All tags"], q: "", page: 1})
    }

    const changePage = (detailPayload: {
        page?:number,
        size?:number,
        tags?:string[],
        q?: string
    }) => {
        if (typeof window !== "undefined") {
            const detail = {
                page: props.currentPage,
                size: props.itemsPerPage,
                tags: filteredTags.value,
                q: props.q,
                ...detailPayload,
            }

            if (
                detail.page === props.currentPage
                && detail.size === props.itemsPerPage
                && JSON.stringify(detail.tags) === JSON.stringify(filteredTags.value)
                && ((detail.q === undefined && props.q === undefined) || detail.q === props.q)
            ) {
                return
            }

            const detailsTags = detail.tags?.filter((tag) => tag !== "All tags")

            const newUrl = new URL(window.location.href)
            newUrl.searchParams.set("page", detail.page.toString())
            newUrl.searchParams.set("size", detail.size.toString())
            if(detailsTags?.length) newUrl.searchParams.set("tags", detailsTags?.join(","))
            else newUrl.searchParams.delete("tags")
            if(detail.q) newUrl.searchParams.set("q", detail.q)
            else newUrl.searchParams.delete("q")

            // navigate in astro world
            navigate(newUrl.pathname + newUrl.search)
        }
    }

    const generateCardHref = (blueprint: Blueprint) => {
        return `/blueprints/${blueprint.id}`
    }

    let queryTimeout: ReturnType<typeof setTimeout>

    watch(searchQueryModel,
        (newQuery) => {
            if(queryTimeout) clearTimeout(queryTimeout)
            queryTimeout = setTimeout(() => {
                changePage({q: newQuery, page: 1})
            }, 500)
        },
    )
</script>

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    .header-container {
        background: url("/landing/plugins/bg.svg") no-repeat top;
        .header {
            padding-bottom: calc($spacer * 4.125);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);

            h1,
            h4 {
                color: $white;
                text-align: center;
                font-weight: 300;
                margin-bottom: 0;
            }

            h1 {
                font-size: $font-size-4xl;
            }

            h4 {
                font-size: $font-size-xl;
            }

            .search-input {
                max-width: 21rem;

                input {
                    border-radius: 4px;
                    border: 1px solid #404559;
                    background-color: #1c1e27;

                    &,
                    &::placeholder {
                        color: $white;
                        font-size: $font-size-md;
                        font-weight: 400;
                    }
                }

                .search-icon {
                    position: absolute;
                    top: calc($spacer * 0.563);
                    left: calc($spacer * 1.125);
                    font-size: calc($spacer * 1.125);
                    color: $white;
                }
            }
        }
    }
    .form-control {
        padding-left: 2.5rem;

        &:focus {
            border-color: var(--bs-border-color);
            box-shadow: none;
        }
    }

    .rounded-button {
        border-radius: 0.25rem;
        color: var(--bs-white);
        padding: calc($spacer / 2) calc($spacer / 1);
        margin-right: calc($spacer / 2);
        background-color: $black-2;
        border: 0.063rem solid $black-3;
        font-weight: bold;
        font-size: $font-size-sm;
        line-height: 1.375rem;

        &.active {
            background-color: $primary-1;
            border-color: $primary-1;
        }
    }

    .pagination-container .form-select {
        border-radius: 4px;
        border: $block-border;
        color: $white;
        text-align: center;
        font-family: $font-family-sans-serif;
        font-size: $font-size-sm;
        font-style: normal;
        font-weight: 700;
    }
</style>