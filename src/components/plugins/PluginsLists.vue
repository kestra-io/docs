<template>
    <ListsLayout
        v-model="activeCategory"
        :categories="normalizedCategories"
        id-prefix="cat"
    >
        <template #top-bar>
            <h1>Connect anything to everything</h1>
            <p>
                Extend Kestra with {{ props.totalPluginCount }} plugins
            </p>
            <div class="search-input">
                <Magnify class="search-icon" />
                <input
                    v-model="searchQuery"
                    type="text"
                    :placeholder="`Search across ${props.totalPluginCount} plugins`"
                />
                <Close
                    v-if="searchQuery"
                    class="clear-icon"
                    @click="searchQuery = ''"
                    title="Clear search"
                />
                <div class="ai-wrapper">
                    <span class="or-text">or</span>
                    <div class="ai-button-inside">
                        <button
                            class="btn btn-sm btn-primary"
                            title="Ask Kestra AI"
                            data-bs-toggle="modal"
                            data-bs-target="#search-ai-modal"
                        >
                            <img
                                :src="KSAIImg.src"
                                alt="Kestra AI"
                                width="30"
                                height="30"
                            />
                            <span>Ask AI</span>
                        </button>
                    </div>
                </div>
            </div>
        </template>

        <div class="d-flex align-items-center justify-content-end">
            <div class="d-flex align-items-center gap-2">
                <CustomSelect
                    v-model="sortBy"
                    :options="sortOptions"
                    label="Sort by:"
                    id="sortSelect"
                />
            </div>
        </div>

        <div class="row" data-usal="fade-u-2 threshold-0">
            <template v-if="pluginsSlice?.length">
                <div
                    class="col-lg-4 col-md-6 mb-3"
                    v-for="plugin in pluginsSlice"
                    :key="plugin.group + (plugin.subGroup ?? '')"
                >
                    <PluginCard :plugin="pluginsInformation(plugin)" />
                </div>
            </template>
            <div
                v-else-if="!pluginsSlice?.length && props.plugins?.length"
                class="alert alert-warning mb-0"
                role="alert"
            >
                No result found for the current search
            </div>
        </div>

        <PaginationContainer
            :current-url="fullPath"
            :total-items="categoryFilteredPlugins.length"
            :showTotal="false"
            @update="
                ({ page, size }) => {
                    currentPage = page
                    itemsPerPage = size
                    scrollToTop()
                }
            "
        />
    </ListsLayout>
</template>

<script setup lang="ts">
    import { computed, ref, watch, onMounted } from "vue"
    import { useWindowScroll } from "@vueuse/core"
    import { formatCategoryName } from "~/utils/plugins/pluginUtils"
    import type { CardPlugin } from "~/utils/plugins/pruneForClient"

    import KSAIImg from "../docs/assets/ks-ai.svg"
    import Close from "vue-material-design-icons/Close.vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import PluginCard from "~/components/plugins/PluginCard.vue"
    import ListsLayout from "~/components/layouts/ListsLayout.vue"
    import CustomSelect from "~/components/common/CustomSelect.vue"
    import PaginationContainer from "~/components/common/PaginationContainer.vue"

    const currentPage = ref(1)
    const searchQuery = ref("")
    const itemsPerPage = ref(42)
    const activeCategory = ref("")
    const sortBy = ref("A-Z")
    const sortOptions = [
        { value: "A-Z", label: "Name A-Z" },
        { value: "Z-A", label: "Name Z-A" },
    ]

    const props = defineProps<{
        plugins: CardPlugin[]
        categories: string[]
        totalPluginCount: string
        fullPath: string
    }>()

    const normalizedCategories = computed(() =>
        props.categories.map((c) => ({ id: c, label: formatCategoryName(c) })),
    )

    const SEARCHABLE_FIELDS: (keyof CardPlugin)[] = ["title", "description", "name"]

    const sortPlugins = (plugins: CardPlugin[], ascending: boolean) =>
        [...plugins].sort((a, b) => {
            const aCore = a.group === "io.kestra.plugin.core" && !a.subGroup
            const bCore = b.group === "io.kestra.plugin.core" && !b.subGroup
            if (aCore !== bCore) return aCore ? -1 : 1

            const comparison = a.title.toLowerCase().localeCompare(b.title.toLowerCase())
            return ascending ? comparison : -comparison
        })

    const filterBySearch = (plugins: CardPlugin[], query: string) => {
        if (!query) return plugins
        const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
        return plugins.filter((plugin) =>
            SEARCHABLE_FIELDS.some((field) =>
                tokens.every((t) => (plugin[field] as string)?.toLowerCase().includes(t)),
            ),
        )
    }

    const searchFilteredPlugins = computed(() =>
        filterBySearch(props.plugins ?? [], searchQuery.value),
    )

    const categoryFilteredPlugins = computed(() =>
        activeCategory.value === ""
            ? searchFilteredPlugins.value
            : searchFilteredPlugins.value.filter((item) =>
                item.categories?.includes(activeCategory.value),
            ),
    )

    const pluginsSlice = computed(() =>
        sortPlugins(categoryFilteredPlugins.value, sortBy.value === "A-Z").slice(
            (currentPage.value - 1) * itemsPerPage.value,
            currentPage.value * itemsPerPage.value,
        ),
    )

    const pluginsInformation = (plugin: CardPlugin): PluginInformation => ({
        ...plugin,
        elementCounts: plugin.elementCounts ?? 0,
        blueprints: plugin.blueprints ?? 0,
    })

    onMounted(() => {
        const params = new URLSearchParams(window.location.search)
        searchQuery.value = params.get("q") ?? ""
        activeCategory.value = params.get("category") ?? ""
        sortBy.value = params.get("sort") ?? "A-Z"
    })

    const { y } = useWindowScroll({ behavior: "smooth" })

    function scrollToTop() {
        y.value = 0
    }

    watch([searchQuery, activeCategory, sortBy], ([q, cat, sort]) => {
        currentPage.value = 1
        const url = new URL(window.location.href)

        if (cat) url.searchParams.set("category", cat)
        else url.searchParams.delete("category")

        url.searchParams.set("sort", sort)

        if (q) url.searchParams.set("q", q)
        else url.searchParams.delete("q")

        window.history.replaceState(null, "", url)
    })
</script>

<style lang="scss" scoped>
    :deep(.top-bar) {
        background: url("~/components/plugins/assets/intro-bg.webp") center / cover no-repeat !important;
    }
    .search-input {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 0.25rem 0.35rem 0.25rem 1rem;
        background: var(--ks-background-input);
        border: 1px solid var(--ks-border-secondary);
        border-radius: $border-radius-lg;
        max-width: 612px;

        .search-icon {
            color: var(--ks-content-tertiary);
            font-size: $font-size-lg;
            flex-shrink: 0;
            margin-top: -0.25rem;
        }

        input {
            flex: 1;
            height: 100%;
            background: transparent;
            border: none;
            outline: none;
            color: var(--ks-content-primary);
            font-size: $font-size-md;
            padding: 0 0.5rem;
            min-width: 0;
            background: var(--ks-background-input);

            &::placeholder {
                color: var(--ks-content-tertiary);
            }
        }

        .clear-icon {
            color: var(--ks-content-tertiary);
            font-size: $font-size-md;
            cursor: pointer;
            flex-shrink: 0;
            margin: 0 0.25rem;

            &:hover {
                color: var(--ks-content-primary);
            }
        }

        .ai-wrapper {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            flex-shrink: 0;

            @include media-breakpoint-down(md) {
                gap: 0.25rem;

                .btn {
                    padding: 0.25rem 0.5rem;
                    font-size: 0.75rem;
                }
            }

            .or-text {
                font-size: $font-size-sm;
                color: var(--ks-content-tertiary);
            }
        }
    }

    .row > * {
        padding-inline: 8px;
    }
</style>

