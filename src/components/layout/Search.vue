<template>
    <div
        v-on="{
            'shown.bs.modal': focusSearch,
            'hidden.bs.modal': onHiddenSearch,
        }"
        class="modal modal-xl fade"
        id="search-modal"
        tabindex="-1"
        ref="modal"
        aria-labelledby="search-modal"
        aria-hidden="true"
    >
        <div class="modal-dialog d-flex w-100 mx-auto">
            <div class="modal-content">
                <div class="modal-body row bg-dark-4">
                    <div class="search">
                        <label class="visually-hidden" for="search-input">Search</label>
                        <div class="input-group">
                            <span class="input-group-text"
                                ><Magnify v-if="!loading" /><MagnifyExpand v-if="loading"
                            /></span>
                            <input
                                type="text"
                                class="form-control form-control-lg"
                                id="search-input"
                                @input="(event) => search(event.target.value)"
                                autocomplete="off"
                                placeholder="Search Kestra.io"
                            />
                            <div class="align-items-center d-flex input-group-append">
                                <div class="ai-button-wrapper me-2">
                                    <button
                                        class="ai-button"
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
                                        <span class="title d-none d-md-inline">Ask Kestra AI</span>
                                        <span class="title d-md-none">Ask AI</span>
                                    </button>
                                </div>
                                <span class="esc">ESC</span>
                            </div>
                        </div>
                    </div>
                    <div class="facets overflow-x-auto overflow-y-hidden p-0" role="tablist">
                        <button
                            class="facet"
                            :class="{
                                'facet-active': selectedFacet === undefined,
                            }"
                            role="tab"
                            @click="() => selectFacet(undefined)"
                        >
                            <span>All</span>
                            <span>({{ allSum }})</span>
                        </button>
                        <button
                            class="facet"
                            v-for="(result, key, index) in searchFacets"
                            @click="() => selectFacet(key)"
                            :class="{ 'facet-active': selectedFacet === key }"
                            role="tab"
                            :key="index"
                        >
                            <span>{{
                                key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
                            }}</span>
                            <span>({{ result }})</span>
                        </button>
                    </div>
                    <div :class="{ loading: loading }">
                        <div class="row" v-if="searchResults && searchResults.length === 0">
                            <div
                                class="col-12 not-found-content d-flex flex-column justify-content-center bg-dark-2"
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
                                    @mouseover="() => onItemMouseOver(result, index)"
                                >
                                    <a
                                        :href="'/' + result.url"
                                        :class="{
                                            active: index === selectedIndex,
                                        }"
                                        @click="close"
                                    >
                                        <div class="result">
                                            <div class="w-100">
                                                <span class="type">{{
                                                    result.type.charAt(0).toUpperCase() +
                                                    result.type.slice(1).toLowerCase()
                                                }}</span>
                                                <h5
                                                    v-if="result.highlightTitle"
                                                    v-html="result.highlightTitle"
                                                ></h5>
                                                <h5 v-else>
                                                    {{ result.title }}
                                                </h5>
                                                <div class="slug">
                                                    <span
                                                        :class="{
                                                            first: index === 0,
                                                        }"
                                                        v-for="(item, index) in breadcrumb(
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
                            <div class="search-detail p-3 col-6 d-none d-md-flex">
                                <div class="rounded-3 w-100" v-if="selectedItem">
                                    <div>
                                        <span class="type">{{
                                            selectedItem.type.charAt(0).toUpperCase() +
                                            selectedItem.type.slice(1).toLowerCase()
                                        }}</span>
                                        <h5>
                                            {{ selectedItem.title }}
                                        </h5>
                                        <div class="slug">
                                            <span
                                                :class="{ first: index === 0 }"
                                                v-for="(item, index) in breadcrumb(
                                                    selectedItem.url,
                                                )"
                                                :key="item"
                                            >
                                                {{ item }}
                                            </span>
                                        </div>
                                        <p
                                            v-for="(highlight, index) in selectedItem.highlights"
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
    </div>

    <div
        v-on="{
            'shown.bs.modal': focusSearchAi,
            'hidden.bs.modal': onHiddenAi,
        }"
        class="modal modal-xl fade"
        id="search-ai-modal"
        tabindex="-2"
        ref="ai-modal"
        aria-labelledby="search-ai-modal"
        aria-hidden="true"
    >
        <div class="modal-dialog d-flex w-100 mx-auto">
            <div class="modal-content">
                <div class="modal-body row bg-dark-4">
                    <Suspense>
                        <AiChatDialog @close="closeAiDialog" @backToSearch="backToSearch" />
                    </Suspense>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import MagnifyExpand from "vue-material-design-icons/MagnifyExpand.vue"
    import AiChatDialog from "~/components/ai/AiChatDialog.vue"
    import KSAIImg from "../docs/assets/ks-ai.svg"
</script>

<script>
    import axios from "axios"
    import PostOutline from "vue-material-design-icons/PostOutline.vue"
    import TextBoxOutline from "vue-material-design-icons/TextBoxOutline.vue"
    import BullhornOutline from "vue-material-design-icons/BullhornOutline.vue"
    import PowerPlugOutline from "vue-material-design-icons/PowerPlugOutline.vue"
    import ContentCopy from "vue-material-design-icons/ContentCopy.vue"
    import posthog from "posthog-js"
    import { API_URL } from "astro:env/client"

    export default {
        data() {
            return {
                searchResults: [],
                searchFacets: {},
                selectedFacet: undefined,
                selectedIndex: 0,
                selectedItem: null,
                searchValue: undefined,
                cancelToken: undefined,
                loading: true,
                showAiDialog: false,
            }
        },
        mounted() {
            window.addEventListener("keydown", this.handleKeyboard)
        },
        unmounted() {
            window.removeEventListener("keydown", this.handleKeyboard)
            document.documentElement.style.removeProperty("--top-bar-height")
        },
        computed: {
            allSum() {
                return Object.values(this.searchFacets).reduce((accumulator, currentValue) => {
                    return accumulator + currentValue
                }, 0)
            },
        },
        methods: {
            focusSearch() {
                document.querySelector("#search-input").value = ""
                document.querySelector("#search-input").focus()
                if (window.location.pathname.startsWith("/plugins")) {
                    this.selectedFacet = "PLUGINS"
                } else {
                    this.selectedFacet = undefined
                }
                this.search()
            },
            onHiddenSearch() {
                this.selectedIndex = null
                this.selectedItem = null
            },
            focusSearchAi() {
                document.querySelector("#ai-chat-input").value = ""
                document.querySelector("#ai-chat-input").focus()
            },
            onHiddenAi() {},
            search(value) {
                if (this.cancelToken !== undefined) {
                    this.cancelToken.cancel("cancel all")
                }
                this.cancelToken = axios.CancelToken.source()
                this.loading = true

                this.searchValue = value
                return axios
                    .get(`${API_URL}/search`, {
                        params: {
                            q: value,
                            type: this.selectedFacet,
                        },
                        cancelToken: this.cancelToken.token,
                    })
                    .then((response) => {
                        if (response?.data?.results?.length) {
                            this.searchResults = response.data.results.map((result) => {
                                const searchTerm = value?.trim()?.toLowerCase()
                                if (searchTerm) {
                                    const index = result.title.toLowerCase().indexOf(searchTerm)
                                    if (index !== -1) {
                                        result.highlightTitle = `${result.title.slice(0, index)}<mark>${result.title.slice(index, index + searchTerm.length)}</mark>${result.title.slice(index + searchTerm.length)}`
                                    }
                                }
                                return result
                            })

                            this.selectedIndex = 0
                            this.selectedItem = this.searchResults[0]
                            this.loading = false
                        } else {
                            this.resetData()
                        }

                        if (response?.data.facets) {
                            this.searchFacets = this.sortFacet(response.data.facets)
                        }

                        posthog.capture("search", {
                            text: value,
                            type: this.selectedFacet,
                            resultsCount: response?.data?.results?.length || 0,
                        })
                    })
                    .catch((e) => {
                        if (e.code !== "ERR_CANCELED") {
                            this.resetData()
                        }
                    })
            },
            sortFacet(facets) {
                const result = new Map(
                    Object.entries(facets).sort((a, b) => {
                        return this.sortFacetIndex(a[0]) - this.sortFacetIndex(b[0])
                    }),
                )

                return Object.fromEntries(result.entries())
            },
            sortFacetIndex(value) {
                const index = ["PLUGINS", "DOCS", "BLUEPRINTS", "BLOGS", "JOBS"].indexOf(value)

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

                if (e.key === "ArrowUp") {
                    this.selectedIndex = this.selectedIndex <= 1 ? 0 : this.selectedIndex - 1
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
                    if (active.offsetTop + active.offsetHeight >= container.offsetHeight) {
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
                if (this.$refs.modal) {
                    const modal = window.$bootstrap.Modal.getInstance(this.$refs.modal)
                    if (modal) {
                        modal.hide()
                    }
                }
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

                if (this.$refs.modal) {
                    const searchModal = new window.$bootstrap.Modal(this.$refs.modal)
                    searchModal.show()
                }
            },
        },
    }
</script>

<style lang="scss">
    @import "~/assets/styles/variable";

    #search-modal {
        .not-found-content {
            color: $white;
            padding: 3.125rem 0;
            border-top: 1px solid $black-6;
            img {
                width: 1.5rem;
            }
        }

        .search {
            width: 100%;
            border: 1px solid $black-6;
            padding: 8px 16px;
            gap: 8px;
            background: $black-4;
            opacity: 1;

            .input-group-text {
                background: transparent;
                font-size: 1.25rem;
                border-bottom-left-radius: 0;
                border-top-left-radius: $border-radius-lg;
                border: none;
                color: $white-3;
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
                color: $black-10;
                font-size: 0.563rem;
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
                color: $white-3;
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
                background: var(--bs-gray-400) !important;
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
                color: $white-3;
                background: $black-4;
            }

            .facets {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 0 1rem;
                font-size: $font-size-sm;
                border-top: 1px solid $black-6;

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
                    color: $white;
                    -ms-overflow-style: none;
                    scrollbar-width: none;

                    &-active {
                        border-top: 1px solid $purple-36;
                        color: $purple-36;
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
            background: $black-4;

            &::-webkit-scrollbar {
                width: 4px;
                height: 4px;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
            }

            &::-webkit-scrollbar-thumb {
                background: $primary-1;
            }

            &::-webkit-scrollbar-thumb:hover {
                background: #370883;
            }

            .type {
                color: $white-3;
                font-size: $font-size-sm;
                font-weight: 400;
                line-height: 14px;
            }

            h5 {
                color: $white;
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
                color: var(--bs-gray-600);
                margin-bottom: calc($spacer / 3);

                span {
                    color: $black-8;
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
            border-right: 1px solid $black-6;
            padding: 0 !important;

            .result {
                transition: background-color 0.2s ease;
                padding: 1rem;
                display: flex;
                cursor: pointer;
                border-bottom: 1px solid $black-6;

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
                background: $black-3;
            }
        }

        .search-detail {
            .extract {
                margin-top: 1rem;
                font-family: var(--bs-font-monospace);
                font-size: 80%;
                max-width: 100%;
                color: $white;

                p {
                    white-space: pre;
                    word-break: break-all;
                }
            }
        }

        .loading {
            opacity: 0.6;
        }

        .search-results {
            border-top: 1px solid $black-6;
        }

        mark {
            background-color: transparent;
            color: $purple-36;
            font-family: $font-family-sans-serif;
            font-weight: 800;
            padding: 0;
            margin: 0;
        }
    }
</style>