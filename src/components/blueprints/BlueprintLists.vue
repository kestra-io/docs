<template>
    <section class="lists">
        <div class="container-xxl">
            <aside class="sidebar">
                <h6 class="sidebar-title">Categories</h6>
                <div class="list">
                    <label class="item" for="tag-all">
                        <input
                            class="input"
                            type="radio"
                            id="tag-all"
                            name="category"
                            :checked="isSelected('')"
                            @change="handleTagChange('')"
                        />
                        <span class="label">
                            All categories
                        </span>
                    </label>
                    <label
                        v-for="tag in props.tags"
                        :key="tag.name"
                        class="item"
                        :for="`tag-${tag.name}`"
                    >
                        <input
                            class="input"
                            type="radio"
                            :id="`tag-${tag.name}`"
                            name="category"
                            :checked="isSelected(tag.name)"
                            @change="handleTagChange(tag.name)"
                        />
                        <span class="label">
                            {{ tag.name }}
                        </span>
                    </label>
                </div>
            </aside>

            <div class="content">
                <div class="top-bar">
                    <h1>Blueprints</h1>
                    <p>
                        The first step is always the hardest. Explore blueprints
                        to kick-start your next flow
                    </p>
                    <slot name="search" />
                </div>

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
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
    import { navigate } from "astro:transitions/client"
    import { computed, ref, watch, onMounted } from "vue"
    import CustomSelect from "~/components/common/CustomSelect.vue"
    import PaginationContainer from "~/components/common/PaginationContainer.vue"

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

    const isSelected = (tagName: string) => {
        return tagName === ""
            ? !props.tagsSelected
            : props.tagsSelected === tagName
    }

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

<style lang="scss" scoped>
    @import "~/assets/styles/variable";

    section.lists {
        padding: 1.875rem 0.75rem;

        @include media-breakpoint-down(lg) {
            padding-inline: 1rem;
        }

        .container-xxl {
            display: flex;
            gap: 2rem;
            position: relative;
            min-height: inherit;

            @include media-breakpoint-down(lg) {
                flex-direction: column;
            }
        }

        .sidebar {
            min-width: 209px;
            position: sticky;
            top: calc(4.5rem + var(--announce-height));
            z-index: 10;
            height: fit-content;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;

            @include media-breakpoint-down(lg) {
                position: static;
                width: 100%;
                overflow: visible;
                min-width: unset;
                padding: 0;
            }

            &-title {
                margin-bottom: 0.25rem;
                font-weight: 700;
                font-size: $font-size-sm;
                color: var(--ks-content-primary);

                @include media-breakpoint-down(lg) {
                    display: none;
                }
            }

            .list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;

                @include media-breakpoint-down(lg) {
                    flex-direction: row;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin: 0;
                    padding: 0;
                    width: 100%;
                }
            }

            .item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                cursor: pointer;

                @include media-breakpoint-down(lg) {
                    gap: 0;
                }

                .input {
                    position: relative;
                    flex-shrink: 0;
                    width: 1.25rem;
                    height: 1.25rem;
                    margin: 0;
                    border: 2px solid var(--ks-border-secondary);
                    border-radius: 50%;
                    appearance: none;
                    cursor: pointer;
                    transition: border-color 0.2s;

                    &:checked {
                        border-color: var(--ks-content-link);

                        &::after {
                            content: "";
                            position: absolute;
                            inset: 0.1875rem;
                            background: var(--ks-content-link);
                            border-radius: 50%;
                        }
                    }

                    @include media-breakpoint-down(lg) {
                        display: none;
                    }
                }

                .label {
                    margin: 0;
                    font-size: $font-size-sm;
                    line-height: normal;
                    color: var(--ks-content-primary);
                    cursor: pointer;

                    @include media-breakpoint-down(lg) {
                        padding: 0.25rem 1rem;
                        border: 1px solid var(--ks-border-secondary);
                        border-radius: 2rem;
                        white-space: nowrap;
                        background: var(--ks-background-secondary);
                        transition: all 0.2s ease;

                        &:hover {
                            border-color: var(--ks-content-link);
                        }
                    }
                }

                .input:checked + .label {
                    @include media-breakpoint-down(lg) {
                        border-color: var(--ks-border-active);
                        background: var(--ks-backgroung-tag-category);
                        color: var(--ks-content-tag-category);
                        font-weight: 600;
                    }
                }
            }
        }

        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2rem;

            @include media-breakpoint-down(lg) {
                display: contents;
            }

            .top-bar {
                display: flex;
                flex-direction: column;
                padding: 4rem 2.625rem;
                background: url("~/components/blueprints/assets/bar-bg.webp")
                    center / cover no-repeat;
                border-radius: $border-radius-lg;
                color: $white;

                @include media-breakpoint-down(lg) {
                    padding: 2rem 1.5rem;
                    order: -1;
                }
            }
        }
    }
</style>