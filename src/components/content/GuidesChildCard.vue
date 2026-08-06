<template>
    <div class="guides">
        <div class="guides-filters">
            <div class="guides-search">
                <input
                    type="text"
                    class="guides-search-input"
                    placeholder="Search guides"
                    aria-label="Search guides"
                    v-model="search"
                />
                <Magnify class="guides-search-icon" />
            </div>
            <div class="guides-filter">
                <MultiSelect
                    name="topic"
                    :selectedValue="topic"
                    :options="topicOptions"
                    :removeItem="removeTopicItem"
                    :selectItem="selectTopicItem"
                    :toggleDropdown="toggleTopicDropdown"
                    :showDropdown="showTopicDropdown"
                />
            </div>
            <div class="guides-filter">
                <MultiSelect
                    name="stage"
                    :selectedValue="stage"
                    :options="stageOptions"
                    :removeItem="removeStageItem"
                    :selectItem="selectStageItem"
                    :toggleDropdown="toggleStageDropdown"
                    :showDropdown="showStageDropdown"
                />
            </div>
            <button
                v-if="hasActiveFilters"
                type="button"
                class="guides-clear"
                @click="removeFilter"
            >
                <DeleteOutline />
                <span>Clear filters</span>
            </button>
        </div>

        <p class="guides-count">
            {{ filtered.length }}
            {{ filtered.length === 1 ? "Guide" : "Guides" }}
        </p>

        <!-- Suspense so the async SSR markdown renderer can resolve during server
             rendering instead of leaving skeletons in the HTML. -->
        <Suspense>
            <div class="guides-grid">
                <a
                    class="guide-card"
                    :href="item.path"
                    v-for="item in paginated"
                    :key="item.path"
                >
                    <div class="guide-card-head">
                        <div class="guide-card-logo">
                            <img
                                v-if="item.icon"
                                class="guide-card-logo-img"
                                :src="item.icon"
                                :alt="item.title"
                                width="48"
                                height="48"
                                loading="lazy"
                            />
                            <BookOpenVariantOutline
                                v-else
                                class="guide-card-logo-icon"
                            />
                        </div>
                        <div class="guide-card-body">
                            <h3 class="guide-card-title">{{ item.title }}</h3>
                            <MDCParserAndRendererSSR
                                :content="item.description"
                                class="guide-card-description"
                            />
                        </div>
                    </div>
                    <div class="guide-card-tags">
                        <span
                            v-if="item.stage"
                            class="guide-tag"
                            :class="stageClass(item.stage)"
                        >
                            {{ item.stage }}
                        </span>
                        <span
                            v-for="(topicName, index) in item.topics"
                            :key="index"
                            class="guide-tag guide-tag-topic"
                        >
                            {{ topicName }}
                        </span>
                    </div>
                </a>
            </div>
        </Suspense>

        <p v-if="!filtered.length" class="guides-empty">
            No guides match your filters.
        </p>

        <div v-else class="guides-pagination">
            <PaginationContainer
                :totalItems="filtered.length"
                :currentUrl="currentUrl"
                :sizeOptions="PAGE_SIZE_OPTIONS"
                :defaultSize="DEFAULT_PAGE_SIZE"
                nofollow
                @update="onPaginationUpdate"
            />
        </div>
    </div>
</template>

<script setup>
    import { computed, onMounted, ref } from "vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import DeleteOutline from "vue-material-design-icons/DeleteOutline.vue"
    import BookOpenVariantOutline from "vue-material-design-icons/BookOpenVariantOutline.vue"
    import MultiSelect from "~/components/select/MultiSelect.vue"
    import MDCParserAndRendererSSR from "~/components/MDCParserAndRendererSSR.vue"
    import PaginationContainer from "~/components/common/PaginationContainer.vue"

    const props = defineProps({
        pageUrl: {
            type: String,
            default: undefined,
        },
        navigation: {
            type: Array,
            default: undefined,
        },
    })

    const stage = ref([])
    const topic = ref([])
    const showStageDropdown = ref(false)
    const showTopicDropdown = ref(false)
    const search = ref("")
    const stageOptions = ["Getting Started", "Intermediate", "Advanced"]
    const topicOptions = [
        "Scripting",
        "DevOps",
        "Integrations",
        "Version Control",
        "Kestra Workflow Components",
        "Kestra Concepts",
        "Best Practices",
    ]

    // `--ks-*` pairs the design assigns to each stage: success for the entry
    // level, danger for the hardest. Intermediate sits between them on warning.
    const stageClasses = {
        "Getting Started": "guide-tag-stage-success",
        Intermediate: "guide-tag-stage-warning",
        Advanced: "guide-tag-stage-danger",
    }

    const stageClass = (value) => stageClasses[value] ?? "guide-tag-topic"

    // This route is prerendered (`getStaticPaths`), so `pageUrl` never carries a
    // query string. Render with it so the server HTML and the first client render
    // agree, then swap in the live URL once mounted — that is what lets a shared
    // `?page=`/`?size=` link restore its slice, via PaginationContainer's own
    // `currentUrl` watcher.
    const currentUrl = ref(props.pageUrl)

    onMounted(() => {
        currentUrl.value = window.location.href
    })

    const toggleStageDropdown = (value = !showStageDropdown.value) => {
        showStageDropdown.value = value
    }

    const toggleTopicDropdown = (value = !showTopicDropdown.value) => {
        showTopicDropdown.value = value
    }

    const selectStageItem = (option) => {
        if (!stage.value.includes(option)) {
            stage.value = [...stage.value, option]
        }
        showStageDropdown.value = false
    }

    const selectTopicItem = (option) => {
        if (!topic.value.includes(option)) {
            topic.value = [...topic.value, option]
        }
        showTopicDropdown.value = false
    }

    const removeStageItem = (index) => {
        stage.value = stage.value.filter((item, i) => i !== index)
    }

    const removeTopicItem = (index) => {
        topic.value = topic.value.filter((item, i) => i !== index)
    }

    const removeFilter = () => {
        stage.value = []
        topic.value = []
        search.value = ""
    }

    const hasActiveFilters = computed(
        () =>
            stage.value.length > 0 || topic.value.length > 0 || !!search.value,
    )

    const filtered = computed(() => {
        let results = props.navigation ?? []

        if (stage.value.length > 0) {
            results = results.filter((item) => stage.value.includes(item.stage))
        }

        if (topic.value.length > 0) {
            results = results.filter((item) => {
                for (const t of topic.value) {
                    if (!item.topics?.includes(t)) return false
                }
                return true
            })
        }

        if (search.value) {
            const q = search.value.toLowerCase()
            results = results.filter(
                (item) =>
                    (item.title || "").toLowerCase().includes(q) ||
                    (item.description || "").toLowerCase().includes(q),
            )
        }

        return results
    })

    // Four rows of the two-column grid, as laid out in the design.
    const DEFAULT_PAGE_SIZE = 8
    const PAGE_SIZE_OPTIONS = [8, 16, 32, 64]

    const pageSize = ref(DEFAULT_PAGE_SIZE)
    const currentPage = ref(1)

    const onPaginationUpdate = ({ size, page }) => {
        pageSize.value = size
        currentPage.value = page
    }

    const paginated = computed(() => {
        const lastPage = Math.max(
            1,
            Math.ceil(filtered.value.length / pageSize.value),
        )
        // Filtering can shrink the list under the active page — clamp rather
        // than render an empty grid.
        const page = Math.min(currentPage.value, lastPage)
        const start = (page - 1) * pageSize.value
        return filtered.value.slice(start, start + pageSize.value)
    })
</script>

<style lang="scss" scoped>
    .guides-filters {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
    }

    .guides-search {
        position: relative;
        flex: 0 1 305px;
        min-width: 0;
    }

    .guides-search-input {
        width: 100%;
        height: 50px;
        padding: 4px 48px 4px 16px;
        border: 1px solid var(--ks-border-secondary);
        border-radius: 4px;
        background-color: var(--ks-background-input);
        color: var(--ks-content-primary);
        font-size: $font-size-sm;
        line-height: 20px;
        &::placeholder {
            color: var(--ks-content-primary);
        }
        &:focus {
            outline: none;
            border-color: var(--ks-border-active);
        }
    }

    .guides-search-icon {
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        color: var(--ks-content-primary);
        pointer-events: none;
        :deep(.material-design-icon__svg) {
            bottom: 0;
        }
    }

    .guides-filter {
        flex: 0 0 168px;
        min-width: 0;
    }

    .guides-clear {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 0;
        border: none;
        background: none;
        color: var(--ks-content-secondary);
        font-size: $font-size-sm;
        :deep(.material-design-icon__svg) {
            bottom: 0;
            fill: var(--ks-content-secondary);
        }
    }

    @include media-breakpoint-down(sm) {
        .guides-search,
        .guides-filter {
            flex: 1 1 100%;
        }
    }

    .guides-count {
        margin: 16px 0;
        padding: 4px 0;
        font-size: $font-size-base;
        line-height: 24px;
        font-weight: 600;
        color: var(--ks-content-primary);
    }

    .guides-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
        @include media-breakpoint-down(md) {
            grid-template-columns: minmax(0, 1fr);
        }
    }

    .guide-card {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-height: 152px;
        padding: 16px;
        border: 1px solid var(--ks-border-secondary);
        border-radius: 8px;
        background-color: var(--ks-background-primary);
        box-shadow: 2px 3px 16px 0px var(--ks-shadows-light);
        color: var(--ks-content-primary);
        text-decoration: none;
        transition: border-color 0.3s;
        &:hover {
            border-color: var(--ks-border-active);
        }
    }

    .guide-card-head {
        display: flex;
        flex: 1;
        gap: 16px;
        min-height: 0;
    }

    .guide-card-logo {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        border: 1px solid var(--ks-border-primary);
        border-radius: 8px;
        // Guide logos are vendor marks drawn for a light backdrop, so the tile
        // stays white in both themes — matching `grey/white` in the design.
        background-color: #ffffff;
    }

    .guide-card-logo-img {
        width: 48px;
        height: 48px;
        max-width: unset;
        object-fit: contain;
    }

    .guide-card-logo-icon {
        color: var(--ks-icon-color);
        :deep(.material-design-icon__svg) {
            bottom: 0;
            width: 24px;
            height: 24px;
        }
    }

    .guide-card-body {
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }

    .guide-card-title {
        margin: 0;
        font-size: $font-size-base;
        line-height: 24px;
        font-weight: 600;
        color: var(--ks-content-primary);
    }

    .guide-card-description {
        height: 32px;
        overflow: hidden;
        :deep(p) {
            margin: 0;
            font-size: $font-size-xs;
            line-height: 16px;
            color: var(--ks-content-secondary);
            overflow: hidden;
            display: -webkit-box;
            line-clamp: 2;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
        }
    }

    .guide-card-tags {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-top: auto;
    }

    .guide-tag {
        padding: 2px 8px;
        border-radius: 40px;
        font-size: $font-size-xs;
        line-height: 16px;
        font-weight: 600;
        white-space: nowrap;
    }

    .guide-tag-topic {
        background-color: var(--ks-background-tertiary);
        color: var(--ks-content-secondary);
    }

    .guide-tag-stage-success {
        background-color: var(--ks-background-tag-success);
        color: var(--ks-content-tag-success);
    }

    .guide-tag-stage-warning {
        background-color: var(--ks-background-alert-warning);
        color: var(--ks-content-alert-warning);
    }

    .guide-tag-stage-danger {
        background-color: var(--ks-background-alert-danger);
        color: var(--ks-content-alert-danger);
    }

    .guides-empty {
        margin: 0;
        color: var(--ks-content-secondary);
        font-size: $font-size-sm;
    }

    // PaginationContainer ships the wider spacing used on blog/blueprint
    // listings; the docs layout puts it one 16px step under the grid.
    .guides-pagination :deep(.pagination-container) {
        margin-top: 16px !important;
        margin-bottom: 0 !important;
    }

    .guides-pagination :deep(.items-per-page .form-select) {
        width: 112px;
        height: 32px;
        padding: 4px 12px 4px 16px;
        border: 1px solid var(--ks-border-secondary);
        text-align: left;
        font-size: $font-size-sm;
        font-weight: 400;
    }

    .guides-pagination {
        :deep(.pagination) {
            li {
                margin-right: 0;
                & + li {
                    margin-left: 8px;
                }
            }
            .page-link {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 32px;
                border-radius: 4px;
            }
            .page-list-item {
                padding: 9px 13px;
                border-color: var(--ks-border-primary);
                font-size: $font-size-xs;
                font-weight: 400;
                line-height: 14px;
            }
            .active .page-list-item {
                border-color: var(--ks-border-active);
            }
            .arrow-button {
                padding: 9px 13px;
                font-size: 14px;
            }
        }
    }
</style>
