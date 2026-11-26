<template>
    <dialog
        class="modal modal-xl"
        id="search-modal"
        ref="modal"
        aria-label="Search"
        @modalshown="focusSearch"
        @close="onHiddenSearch"
        @click.self="close"
    >
        <div class="modal-dialog d-flex w-100 mx-auto">
            <div class="modal-content">
                <div class="modal-body row">
                    <div class="search">
                        <label class="visually-hidden" for="search-input"
                            >Search</label
                        >
                        <div class="input-group">
                            <span class="input-group-text"
                                ><Magnify v-if="!loading" /><MagnifyExpand
                                    v-if="loading"
                            /></span>
                            <input
                                type="text"
                                class="form-control form-control-lg"
                                id="search-input"
                                @input="(event) => search(event.target.value)"
                                autocomplete="off"
                                placeholder="Search Kestra.io"
                            />
                            <div
                                class="align-items-center d-flex input-group-append"
                            >
                                <button
                                    class="btn btn-sm btn-primary"
                                    title="Ask Kestra AI"
                                    data-modal-target="#search-ai-modal"
                                >
                                    <img
                                        :src="KSAIImg.src"
                                        alt="Kestra AI"
                                        width="30"
                                        height="30"
                                    />
                                    <span class="title d-none d-md-inline"
                                        >Ask Kestra AI</span
                                    >
                                    <span class="title d-md-none">Ask AI</span>
                                </button>
                                <span class="esc">ESC</span>
                            </div>
                        </div>
                    </div>
                    <div
                        class="facets overflow-x-auto overflow-y-hidden p-0"
                        role="tablist"
                    >
                        <button
                            class="facet"
                            :class="{
                                'facet-active': selectedFacet === undefined,
                            }"
                            role="tab"
                            @click="() => selectFacet(undefined)"
                        >
                            <span>All</span>
                            <span v-if="allSum !== undefined"
                                >({{ allSum }})</span
                            >
                        </button>
                        <button
                            class="facet"
                            v-for="key in tabKeys"
                            @click="() => selectFacet(key)"
                            :class="{ 'facet-active': selectedFacet === key }"
                            role="tab"
                            :key="key"
                        >
                            <span>{{
                                key.charAt(0).toUpperCase() +
                                key.slice(1).toLowerCase()
                            }}</span>
                            <span v-if="tabCount(key) !== undefined"
                                >({{ tabCount(key) }})</span
                            >
                        </button>
                    </div>
                    <div :class="{ loading: loading }">
                        <div
                            v-if="initialLoad === false"
                            class="row search-results"
                            role="status"
                            aria-label="Loading results"
                        >
                            <div class="search-loading col-12 col-md-6">
                                <div
                                    v-for="n in 6"
                                    :key="n"
                                    class="search-loading-row"
                                >
                                    <span class="search-loading-icon"></span>
                                    <span class="search-loading-text">
                                        <span></span>
                                        <span></span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            class="row"
                            v-else-if="
                                searchResults && searchResults.length === 0
                            "
                        >
                            <div
                                class="col-12 not-found-content d-flex flex-column justify-content-center"
                            >
                                <img
                                    src="/search/emoticon-dead-icon.svg"
                                    alt="emoticon icon"
                                    class="mx-auto"
                                />
                                <p class="text-center mt-3">
                                    No results found for the current search
                                </p>
                            </div>
                        </div>
                        <div class="row search-results" v-else>
                            <div class="search-result col-12 col-md-6">
                                <div
                                    v-for="(result, index) in searchResults"
                                    @mouseover="
                                        () => onItemMouseOver(result, index)
                                    "
                                >
                                    <a
                                        :href="resultHref(result)"
                                        :class="{
                                            active: index === selectedIndex,
                                        }"
                                        @click="close"
                                    >
                                        <div
                                            v-if="result.plugin"
                                            class="result plugin-result"
                                        >
                                            <div class="plugin-icon">
                                                <img
                                                    :src="result.plugin.icon"
                                                    alt=""
                                                    width="30"
                                                    height="30"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div class="result-text">
                                                <div class="plugin-title-row">
                                                    <h5>{{ result.title }}</h5>
                                                    <span
                                                        v-if="
                                                            result.plugin
                                                                .isEnterprise
                                                        "
                                                        class="enterprise-badge"
                                                        >Enterprise</span
                                                    >
                                                </div>
                                                <p
                                                    v-if="
                                                        result.plugin
                                                            .description
                                                    "
                                                    class="result-description"
                                                >
                                                    {{
                                                        result.plugin
                                                            .description
                                                    }}
                                                </p>
                                                <div class="plugin-categories">
                                                    <span
                                                        v-for="category in result
                                                            .plugin.categories"
                                                        :key="category"
                                                        class="category-tag"
                                                        >{{ category }}</span
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else class="result">
                                            <div class="w-100">
                                                <span class="type">{{
                                                    result.type
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                    result.type
                                                        .slice(1)
                                                        .toLowerCase()
                                                }}</span>
                                                <h5
                                                    v-if="result.highlightTitle"
                                                    v-html="
                                                        result.highlightTitle
                                                    "
                                                ></h5>
                                                <h5 v-else>
                                                    {{ result.title }}
                                                </h5>
                                                <div class="slug">
                                                    <span
                                                        :class="{
                                                            first: index === 0,
                                                        }"
                                                        v-for="(
                                                            item, index
                                                        ) in breadcrumb(
                                                            result.url,
                                                        )"
                                                        :key="item"
                                                    >
                                                        {{ item }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                            <div
                                class="search-detail p-3 col-6 d-none d-md-flex"
                            >
                                <div
                                    class="rounded-3 w-100 plugin-detail"
                                    v-if="selectedItem?.plugin"
                                >
                                    <div class="plugin-detail-header">
                                        <div class="plugin-icon large">
                                            <img
                                                :src="selectedItem.plugin.icon"
                                                alt=""
                                                width="45"
                                                height="45"
                                            />
                                        </div>
                                        <div>
                                            <div class="plugin-title-row">
                                                <h5>
                                                    {{ selectedItem.title }}
                                                </h5>
                                                <span
                                                    v-if="
                                                        selectedItem.plugin
                                                            .isEnterprise
                                                    "
                                                    class="enterprise-badge"
                                                    >Enterprise</span
                                                >
                                            </div>
                                            <div class="slug">
                                                <span
                                                    v-for="item in breadcrumb(
                                                        selectedItem.url,
                                                    )"
                                                    :key="item"
                                                    >{{ item }}</span
                                                >
                                            </div>
                                        </div>
                                    </div>
                                    <div class="plugin-categories">
                                        <span
                                            v-for="category in selectedItem
                                                .plugin.categories"
                                            :key="category"
                                            class="category-tag"
                                            >{{ category }}</span
                                        >
                                    </div>
                                    <p class="plugin-detail-description">
                                        {{ selectedItem.plugin.description }}
                                    </p>
                                    <p class="plugin-stats">
                                        <span
                                            v-if="
                                                selectedItem.plugin
                                                    .elementCounts
                                            "
                                            ><strong>{{
                                                selectedItem.plugin
                                                    .elementCounts
                                            }}</strong>
                                            tasks</span
                                        >
                                        <span
                                            v-if="
                                                selectedItem.plugin.blueprints
                                            "
                                            ><strong>{{
                                                selectedItem.plugin.blueprints
                                            }}</strong>
                                            blueprints</span
                                        >
                                    </p>
                                    <section
                                        v-for="group in selectedItem.plugin
                                            .elements"
                                        :key="group.type"
                                        class="plugin-elements"
                                    >
                                        <h6>
                                            {{ group.type }} ({{ group.total }})
                                        </h6>
                                        <a
                                            v-for="element in group.items"
                                            :key="element.cls"
                                            :href="
                                                element.href ??
                                                resultHref(selectedItem)
                                            "
                                            class="plugin-element"
                                            @click="close"
                                        >
                                            <img
                                                :src="`/icons/${element.cls}.svg`"
                                                alt=""
                                                width="22"
                                                height="22"
                                                loading="lazy"
                                            />
                                            <div>
                                                <strong>{{
                                                    element.name
                                                }}</strong>
                                                <span v-if="element.title">{{
                                                    element.title
                                                }}</span>
                                            </div>
                                        </a>
                                        <a
                                            v-if="
                                                group.total > group.items.length
                                            "
                                            :href="resultHref(selectedItem)"
                                            class="plugin-elements-more"
                                            @click="close"
                                            >See all {{ group.total }}
                                            {{ group.type.toLowerCase() }}</a
                                        >
                                    </section>
                                </div>
                                <div
                                    class="rounded-3 w-100"
                                    v-else-if="selectedItem"
                                >
                                    <div>
                                        <span class="type">{{
                                            selectedItem.type
                                                .charAt(0)
                                                .toUpperCase() +
                                            selectedItem.type
                                                .slice(1)
                                                .toLowerCase()
                                        }}</span>
                                        <h5>
                                            {{ selectedItem.title }}
                                        </h5>
                                        <div class="slug">
                                            <span
                                                :class="{ first: index === 0 }"
                                                v-for="(
                                                    item, index
                                                ) in breadcrumb(
                                                    selectedItem.url,
                                                )"
                                                :key="item"
                                            >
                                                {{ item }}
                                            </span>
                                        </div>
                                        <p
                                            v-for="(
                                                highlight, index
                                            ) in selectedItem.highlights"
                                            :key="index"
                                            v-html="highlight"
                                            class="extract"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </dialog>

    <dialog
        class="modal modal-xl"
        id="search-ai-modal"
        ref="ai-modal"
        aria-label="Ask Kestra AI"
        @modalshown="focusSearchAi"
        @click.self="closeAi"
    >
        <div class="modal-dialog d-flex w-100 mx-auto">
            <div class="modal-content">
                <div class="modal-body row">
                    <Suspense>
                        <AiChatDialog
                            ref="aiChatDialog"
                            :randomAiQuestions
                            @close="closeAiDialog"
                            @backToSearch="backToSearch"
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    </dialog>
</template>

<script setup>
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import MagnifyExpand from "vue-material-design-icons/MagnifyExpand.vue"
    import AiChatDialog from "~/components/ai/AiChatDialog.vue"
    import KSAIImg from "../docs/assets/ks-ai.svg"
    import { defineAsyncComponent } from "vue"

</script>

<script>
    import PostOutline from "vue-material-design-icons/PostOutline.vue"
    import TextBoxOutline from "vue-material-design-icons/TextBoxOutline.vue"
    import BullhornOutline from "vue-material-design-icons/BullhornOutline.vue"
    import PowerPlugOutline from "vue-material-design-icons/PowerPlugOutline.vue"
    import ContentCopy from "vue-material-design-icons/ContentCopy.vue"
    import posthog from "posthog-js"
    import { $fetchApi } from "~/utils/fetch"
    import { prepareSearchResults } from "~/utils/searchResults"
    import { markRaw } from "vue"
    import {
        loadPluginsIndex,
        pluginsSearchResults,
    } from "~/utils/search/plugins"
    import { searchResultHref, searchScope } from "~/utils/versionedDocs"
    import { isEventInModal, openModal } from "~/utils/modal"

    // Tabs searched in the browser, from indexes the popup loads when it opens.
    const LOCAL_TABS = {
        PLUGINS: {
            load: loadPluginsIndex,
            search: (indexes, query) =>
                pluginsSearchResults(indexes.PLUGINS, query),
        },
    }

    export default {
        props: {
            randomAiQuestions: {
                type: Array,
                required: true,
            },
            /** MAJOR.MINOR the unversioned /docs serves, so search can be scoped to it. */
            docsLatest: {
                type: String,
                default: undefined,
            },
        },
        data() {
            return {
                searchResults: [],
                searchFacets: {},
                selectedFacet: undefined,
                selectedIndex: 0,
                selectedItem: null,
                searchValue: undefined,
                loading: true,
                showAiDialog: false,
                initialLoad: false,
                abortController: undefined,
                indexes: {},
                failedIndexes: [],
                localResults: {},
                // Version whose segment the current results' docs hits need
                // back; unset for docs-latest hits and for latest fallbacks.
                hrefVersion: undefined,
            }
        },
        mounted() {
            window.addEventListener("keydown", this.handleKeyboard)
            document.addEventListener("pointerover", this.preloadIndexes)
            document.addEventListener("focusin", this.preloadIndexes)
        },
        unmounted() {
            window.removeEventListener("keydown", this.handleKeyboard)
            document.removeEventListener("pointerover", this.preloadIndexes)
            document.removeEventListener("focusin", this.preloadIndexes)
        },
        computed: {
            tabKeys() {
                return [
                    ...new Set([
                        ...Object.keys(LOCAL_TABS),
                        ...Object.keys(this.searchFacets),
                    ]),
                ]
            },
            allSum() {
                const counts = this.tabKeys.map((key) => this.tabCount(key))
                if (counts.includes(undefined)) return undefined
                return counts.reduce((sum, count) => sum + count, 0)
            },
        },
        methods: {
            // Starts downloading when a search button is hovered or focused, ahead of the click.
            preloadIndexes(event) {
                if (
                    !event.target.closest?.(
                        '[data-modal-target="#search-modal"]',
                    )
                ) {
                    return
                }
                for (const tab of Object.values(LOCAL_TABS)) {
                    tab.load().catch(() => {})
                }
                document.removeEventListener("pointerover", this.preloadIndexes)
                document.removeEventListener("focusin", this.preloadIndexes)
            },
            focusSearch() {
                document.querySelector("#search-input").value = ""
                document.querySelector("#search-input").focus()
                if (window.location.pathname.startsWith("/plugins")) {
                    this.selectedFacet = "PLUGINS"
                } else {
                    this.selectedFacet = undefined
                }
                this.search()
                for (const [type, tab] of Object.entries(LOCAL_TABS)) {
                    tab.load().then(
                        (index) => this.settleIndex(type, index),
                        () => this.settleIndex(type),
                    )
                }
            },
            onHiddenSearch() {
                this.selectedIndex = null
                this.selectedItem = null
            },
            focusSearchAi() {
                const prefill = this.$refs.modal?.open
                    ? this.searchValue?.trim() || ""
                    : ""
                this.$refs.aiChatDialog?.setUserInput(prefill)
            },
            search(value = "") {
                // https://developer.mozilla.org/en-US/docs/Web/API/AbortController
                if (this.abortController) {
                    this.abortController.abort("Search restarted")
                }
                const controller = new AbortController()
                this.abortController = controller
                // A newer search has started: this one must not touch the state.
                const isStale = () => this.abortController !== controller
                this.loading = true

                this.searchValue = value
                this.updateLocalResults(value)
                const params = new URLSearchParams()
                params.append("q", value)
                if (this.selectedFacet) {
                    params.append("type", this.selectedFacet)
                }
                const scope = searchScope(
                    window.location.pathname,
                    this.docsLatest,
                )
                return this.fetchSearch(
                    params,
                    scope.version,
                    controller.signal,
                )
                    .then((response) => {
                        // A version indexed before this content existed (or not
                        // indexed at all) answers empty rather than 404 — fall
                        // back to unscoped search instead of showing nothing.
                        if (scope.version && !response?.results?.length) {
                            return this.fetchSearch(
                                params,
                                undefined,
                                controller.signal,
                            ).then((fallback) => {
                                this.hrefVersion = undefined
                                return fallback
                            })
                        }
                        this.hrefVersion = scope.hrefVersion
                        return response
                    })
                    .then((response) => {
                        if (isStale()) return
                        // Server rows would flash before the local results replace them.
                        const waiting = this.waitsForLocalResults()
                        if (!waiting) this.initialLoad = true
                        if (!this.usesLocalResults() && !waiting) {
                            const results = prepareSearchResults(
                                response?.results,
                                value,
                            )
                            if (results.length) {
                                this.searchResults = results

                                this.selectedIndex = 0
                                this.selectedItem = this.searchResults[0]
                                this.loading = false
                            } else {
                                this.resetData()
                            }
                        }

                        if (response?.facets) {
                            this.searchFacets = this.sortFacet(response.facets)
                        }


                        posthog.capture("search", {
                            text: value,
                            type: this.selectedFacet,
                            resultsCount: this.usesLocalResults()
                                ? this.tabCount(this.selectedFacet)
                                : response?.results?.length || 0,
                        })
                    })
                    .catch(() => {
                        if (!isStale() && !this.usesLocalResults()) {
                            this.resetData()
                        }
                    })
                    .finally(() => {
                        if (isStale()) return
                        this.abortController = undefined
                        this.loading = false
                    })
            },
            usesLocalResults(type = this.selectedFacet) {
                if (type === undefined) return false
                return type in this.indexes
            },
            settleIndex(type, index) {
                const waited = this.waitsForLocalResults()
                if (index) {
                    this.indexes = { ...this.indexes, [type]: markRaw(index) }
                } else {
                    this.failedIndexes = [...this.failedIndexes, type]
                }
                this.updateLocalResults(this.searchValue ?? "", true)
                // Nothing local to show: fetch the server answer the popup held back.
                if (
                    waited &&
                    !this.waitsForLocalResults() &&
                    !this.usesLocalResults()
                ) {
                    this.search(this.searchValue ?? "")
                }
            },
            waitsForLocalResults(type = this.selectedFacet) {
                if (type === undefined) return false
                if (!(type in LOCAL_TABS)) return false
                return (
                    !(type in this.indexes) &&
                    !this.failedIndexes.includes(type)
                )
            },
            updateLocalResults(value, keepSelection = false) {
                const localResults = {}
                for (const [type, tab] of Object.entries(LOCAL_TABS)) {
                    if (!(type in this.indexes)) continue
                    localResults[type] = tab.search(this.indexes, value)
                }
                this.localResults = localResults
                if (!this.usesLocalResults()) {
                    if (this.waitsForLocalResults()) this.initialLoad = false
                    return
                }

                this.showResults(localResults[this.selectedFacet].results, keepSelection)
            },
            showResults(results, keepSelection = false) {
                const kept = keepSelection
                    ? results.findIndex(
                          (result) => result.url === this.selectedItem?.url,
                      )
                    : -1
                this.searchResults = results
                this.selectedIndex = Math.max(kept, 0)
                this.selectedItem = results[this.selectedIndex] ?? null
                this.initialLoad = true
                this.loading = false
            },
            tabCount(key) {
                if (this.waitsForLocalResults(key)) return undefined
                if (!this.usesLocalResults(key)) {
                    return Number(this.searchFacets[key]) || 0
                }
                return this.localResults[key]?.total ?? 0
            },
            fetchSearch(params, version, signal) {
                const path = version
                    ? `/search/versions/${version}?${params.toString()}`
                    : `/search?${params.toString()}`
                return $fetchApi(path, { signal })
            },
            resultHref(result) {
                return searchResultHref(result, this.hrefVersion)
            },
            sortFacet(facets) {
                const result = new Map(
                    Object.entries(facets).sort((a, b) => {
                        return (
                            this.sortFacetIndex(a[0]) -
                            this.sortFacetIndex(b[0])
                        )
                    }),
                )

                return Object.fromEntries(result.entries())
            },
            sortFacetIndex(value) {
                const index = [
                    "PLUGINS",
                    "BLUEPRINTS",
                    "DOCS",
                    "BLOGS",
                    "JOBS",
                ].indexOf(value)

                return index === -1 ? Number.MAX_SAFE_INTEGER : index
            },
            resetData() {
                this.selectedIndex = null
                this.selectedItem = null
                this.searchResults = []
                this.searchFacets = {}
            },
            breadcrumb(slug) {
                return [...new Set(slug.split("/").filter((r) => r !== ""))]
            },
            onItemMouseOver(item, index) {
                this.selectedIndex = index
                this.selectedItem = item
            },
            selectFacet(facet) {
                if (this.selectedFacet !== facet) {
                    this.selectedFacet = facet
                    this.search(this.searchValue)
                }
            },
            handleKeyboard(e) {
                if (e.key === "k" && e.ctrlKey) {
                    e.preventDefault() // present "Save Page" from getting triggered.

                    document.getElementById("header-search-button").click()
                }

                if (!isEventInModal(this.$refs.modal, e)) return

                if (e.key === "ArrowUp") {
                    this.selectedIndex =
                        this.selectedIndex <= 1 ? 0 : this.selectedIndex - 1
                    this.selectedItem = this.searchResults[this.selectedIndex]
                    this.handleSearchScroll()
                }

                if (e.key === "ArrowDown" && this.searchResults) {
                    this.selectedIndex =
                        this.selectedIndex >= this.searchResults.length - 1
                            ? this.searchResults.length - 1
                            : this.selectedIndex + 1
                    this.selectedItem = this.searchResults[this.selectedIndex]
                    this.handleSearchScroll()
                }

                // if (e.key === "ArrowLeft" && this.searchFacets) {
                //     this.handleFacetsKeys(false);
                // }
                //
                // if (e.key === "ArrowRight" && this.searchFacets) {
                //     this.handleFacetsKeys(true);
                // }

                if (
                    e.key === "Enter" &&
                    this.searchResults &&
                    this.searchResults[this.selectedIndex]
                ) {
                    document.querySelector(".search-result .active").click()
                }
            },
            handleSearchScroll() {
                let active = document.querySelector(".search-result .active")
                let container = document.querySelector(".search-result")

                if (active) {
                    if (
                        active.offsetTop + active.offsetHeight >=
                        container.offsetHeight
                    ) {
                        container.scrollTop = active.offsetTop
                    } else if (active.offsetTop < container.offsetHeight) {
                        container.scrollTop = 0
                    }
                }
            },
            handleFacetsKeys(isRight) {
                const keys = Object.keys(this.searchFacets)

                let selected = keys.indexOf(this.selectedFacet)

                if (isRight) {
                    selected = selected + 1
                    if (selected > keys.length) {
                        selected = -1
                    }
                } else {
                    selected = selected - 1
                    if (selected === -2) {
                        selected = keys.length - 1
                    }
                }

                if (selected === -1) {
                    this.selectedFacet = undefined
                } else {
                    this.selectedFacet = keys[selected]
                }

                this.search(this.searchValue)
            },
            iconByType(type) {
                switch (type) {
                    case "JOBS":
                        return BullhornOutline
                    case "BLOGS":
                        return PostOutline
                    case "PLUGINS":
                        return PowerPlugOutline
                    case "BLUEPRINTS":
                        return ContentCopy
                    default:
                        return TextBoxOutline
                }
            },
            close() {
                this.$refs.modal?.close()
            },
            closeAi() {
                this.$refs["ai-modal"]?.close()
            },
            openDialog() {
                this.close()
                this.showAiDialog = true
            },
            closeAiDialog() {
                this.showAiDialog = false
            },
            backToSearch() {
                this.showAiDialog = false
                this.closeAi()
                openModal("#search-modal")
            },
        },
    }
</script>

<style lang="scss">
    #search-modal {
        .not-found-content {
            color: var(--ks-content-primary);
            padding: 3.125rem 0;
            border-top: 1px solid var(--ks-border-primary);
            img {
                width: 1.5rem;
            }
        }
        .search {
            width: 100%;
            border: 1px solid var(--ks-border-primary);
            padding: 8px 16px;
            gap: 8px;
            background: var(--ks-background-body);
            opacity: 1;
            .input-group-text {
                background: transparent;
                font-size: 1.25rem;
                border-bottom-left-radius: 0;
                border-top-left-radius: $border-radius-lg;
                border: none;
                color: var(--ks-content-secondary);
                padding: 0;
            }
            .magnify-icon {
                font-size: 20px;
                color: var(--ks-content-secondary);
                margin-top: -4px;
            }
            .ai-button {
                padding: 4px 12px;
            }
            .esc {
                color: var(--ks-content-tertiary);
                font-size: 0.563rem;
                margin-left: 0.5rem;
            }
        }
        .form-control {
            border-left: 0;
            background: transparent !important;
            border-bottom-right-radius: 0;
            border: none;
            padding-left: 8px;
            &,
            &::placeholder {
                color: var(--ks-content-secondary);
                font-size: $font-size-md;
                font-weight: 400;
            }
        }
        .form-control:focus {
            box-shadow: none;
        }
        .badge {
            font-weight: normal;
            &.bg-light {
                background: var(--ks-gray-400) !important;
            }
        }
        .icon-wrapper {
            width: 16px;
            height: 16px;
            margin-right: 0.375rem;
        }
        .modal-body {
            .search,
            .facets {
                color: var(--ks-content-secondary);
                background: var(--ks-background-body);
            }
            .facets {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 0 1rem;
                font-size: $font-size-sm;
                border-top: 1px solid var(--ks-border-primary);
                @include media-breakpoint-down(md) {
                    width: 97%;
                }
                .facet {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem 1rem;
                    gap: 5px;
                    cursor: pointer;
                    background-color: transparent;
                    appearance: none;
                    border: none;
                    border-top: 1px solid transparent;
                    color: var(--ks-content-primary);
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                    &-active {
                        border-top: 1px solid var(--ks-border-active);
                        color: var(--ks-content-color-highlight);
                    }
                    &:focus-visible {
                        outline: none;
                        text-decoration: underline;
                    }
                }
                &::-webkit-scrollbar {
                    display: none;
                }
            }
        }
        .search-result,
        .search-detail {
            overflow-x: hidden;
            overflow-y: auto;
            height: calc(100vh - 175px);
            background: var(--ks-background-body);
            &::-webkit-scrollbar {
                width: 4px;
                height: 4px;
            }
            &::-webkit-scrollbar-track {
                background: transparent;
            }
            &::-webkit-scrollbar-thumb {
                background: var(--ks-background-button-primary-hover);
            }
            &::-webkit-scrollbar-thumb:hover {
                background: #370883;
            }
            .type {
                color: var(--ks-content-secondary);
                font-size: $font-size-sm;
                font-weight: 400;
                line-height: 14px;
            }
            h5 {
                color: var(--ks-content-primary);
                font-size: $font-size-sm;
                font-weight: 700;
                line-height: 22px;
                margin-bottom: 0;
            }
            .slug {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
                font-size: $font-size-xs;
                color: var(--ks-gray-600);
                margin-bottom: calc($spacer / 3);
                span {
                    color: var(--ks-content-tertiary);
                    font-size: 0.688rem;
                    font-weight: 400;
                    margin-right: 0.25rem;
                    line-height: 14px;
                    &:before {
                        content: "/";
                        margin-right: 0.25rem;
                    }
                    &:first-child {
                        &:before {
                            display: none;
                        }
                    }
                }
                .breadcrumb-item + .breadcrumb-item::before {
                    color: $pink;
                }
            }
        }
        .search-result {
            border-right: 1px solid var(--ks-border-primary);
            padding: 0 !important;
            .result {
                transition: background-color 0.2s ease;
                padding: 1rem;
                display: flex;
                cursor: pointer;
                border-bottom: 1px solid var(--ks-border-primary);
                > div {
                    flex-grow: 1;
                }
                span.material-design-icon.arrow {
                    font-size: 1rem;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }
            }
            .active .result,
            .result:hover {
                background: var(--ks-background-primary);
            }
        }
        .search-detail {
            .extract {
                margin-top: 1rem;
                font-family: var(--ks-font-monospace);
                font-size: 80%;
                max-width: 100%;
                color: var(--ks-content-primary);
                p {
                    white-space: pre;
                    word-break: break-all;
                }
            }
        }
        .plugin-icon {
            width: 44px;
            height: 44px;
            flex-shrink: 0;
            background: $white;
            border-radius: 8px;
            border: $block-border;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
                width: 30px;
                height: 30px;
                object-fit: contain;
            }

            &.large {
                width: 60px;
                height: 60px;

                img {
                    width: 45px;
                    height: 45px;
                }
            }
        }
        .search-result .plugin-result {
            gap: 1rem;
            align-items: flex-start;

            > .plugin-icon {
                flex: 0 0 44px;
            }
        }
        .result-text {
            flex: 1 1 auto;
            min-width: 0;
        }
        .plugin-title-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            h5 {
                margin: 0;
            }
        }
        .enterprise-badge {
            border-radius: 40px;
            font-size: $font-size-xs;
            background: var(--ks-background-tag-EE);
            color: var(--ks-content-tag-EE);
            padding: 0.1rem 0.5rem;
            font-weight: 600;
            white-space: nowrap;
        }
        .result-description {
            color: var(--ks-content-secondary);
            font-size: $font-size-xs;
            margin: 0.25rem 0 0.5rem;
            overflow: hidden;
            display: -webkit-box;
            line-clamp: 1;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
        .plugin-categories {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;

            .category-tag {
                background: var(--ks-background-tag-category);
                color: var(--ks-content-tag-category);
                padding: 0.125rem 0.5rem;
                border-radius: 40px;
                font-size: $font-size-xs;
                font-weight: 600;
                white-space: nowrap;
            }
        }
        .plugin-detail {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            .plugin-detail-header {
                display: flex;
                gap: 1rem;
                align-items: center;
            }

            .plugin-detail-description {
                margin: 0;
                color: var(--ks-content-primary);
                font-size: $font-size-sm;
            }

            .plugin-stats {
                margin: 0;
                display: flex;
                gap: 1rem;
                font-size: $font-size-xs;
                color: var(--ks-content-primary);
            }

            .plugin-elements {
                display: flex;
                flex-direction: column;
                gap: 0.4rem;

                h6 {
                    margin: 0;
                    font-size: $font-size-xs;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                    color: var(--ks-content-secondary);
                }
            }

            .plugin-element {
                display: flex;
                gap: 0.75rem;
                align-items: flex-start;
                padding: 0.5rem 0.6rem;
                border: 1px solid var(--ks-border-primary);
                border-radius: 8px;
                background: var(--ks-background-primary);
                color: var(--ks-content-primary);
                text-decoration: none;

                &:hover {
                    border-color: var(--ks-border-active);
                }

                img {
                    flex-shrink: 0;
                    margin-top: 2px;
                    object-fit: contain;
                }

                strong {
                    display: block;
                    font-size: $font-size-sm;
                }

                span {
                    font-size: $font-size-xs;
                    color: var(--ks-content-secondary);
                }
            }

            .plugin-elements-more {
                font-size: $font-size-xs;
                color: var(--ks-content-link);
                text-decoration: none;
            }
        }
        .loading {
            opacity: 0.6;
        }
        .search-loading-row {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.9rem 1rem;
            border-bottom: 1px solid var(--ks-border-primary);
        }
        .search-loading-icon,
        .search-loading-text span {
            background: var(--ks-background-secondary);
            animation: search-loading 1.2s ease-in-out infinite alternate;

            @media (prefers-reduced-motion: reduce) {
                animation: none;
            }
        }
        .search-loading-icon {
            flex: 0 0 44px;
            height: 44px;
            border-radius: 8px;
        }
        .search-loading-text {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            span {
                height: 0.75rem;
                width: 85%;
                border-radius: 4px;

                &:first-child {
                    height: 0.9rem;
                    width: 45%;
                }
            }
        }
        .search-results {
            border-top: 1px solid var(--ks-border-primary);
        }
        mark {
            background-color: transparent;
            color: var(--ks-content-color-highlight);
            font-weight: 700;
            padding: 0;
            margin: 0;
        }
    }

    @keyframes search-loading {
        to {
            opacity: 0.45;
        }
    }
</style>
