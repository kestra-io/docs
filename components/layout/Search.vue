<template>
    <div v-on="{ 'shown.bs.modal': focusSearch }" class="modal modal-xl fade" id="search-modal" tabindex="-1" ref="modal" aria-labelledby="search-modal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body row">
                    <div class="search">
                        <label class="visually-hidden" for="search-input">Search</label>
                        <div class="input-group">
                            <span class="input-group-text"><Magnify/></span>
                            <input type="text" class="form-control form-control-lg" id="search-input" @input="event => search(event.target.value)" autocomplete="off" placeholder="Search"/>
                        </div>
                    </div>
                    <div v-if="searchResults && searchResults.length === 0" class="alert alert-warning mb-0"
                         role="alert">
                        No results found for the current search
                    </div>
                    <div class="row" v-if="searchResults && searchResults.length > 0" >
                        <div class="search-result p-3 col-12 col-md-6">
                            <div v-for="(result, index) in searchResults" @mouseover="() => onItemMouseOver(result, index)">
                                <NuxtLink :href="result.url" :class="{'active': index === selectedIndex}" @click="close">
                                    <div class="result rounded-3">
                                        <div class="w-100">
                                            <h5>
                                                <CommonTaskIcon v-if="result.cls" :cls="result.cls" />
                                                <component class="icon-wrapper" v-else :is="iconByType(result.type)" />
                                                {{ result.title }}
                                            </h5>
                                            <div class="slug">
                                                <span
                                                    :class="{first: index === 0}"
                                                    v-for="(item, index) in breadcrumb(result.url)" :key="item">
                                                        {{ item }}
                                                </span>
                                            </div>
                                            <span class="badge bg-light">{{result.type.charAt(0).toUpperCase() + result.type.slice(1).toLowerCase()}}</span>
                                        </div>
                                        <ArrowRight class="arrow" />
                                    </div>
                                </NuxtLink>
                            </div>
                        </div>
                        <div class="search-detail p-3 col-6 d-none d-md-flex">
                            <div class="rounded-3 w-100" v-if="selectedItem">
                                <div>
                                    <h4>
                                        <CommonTaskIcon v-if="selectedItem.cls" :cls="selectedItem.cls" />
                                        <component class="icon-wrapper" v-else :is="iconByType(selectedItem.type)" />
                                        {{ selectedItem.title }}
                                    </h4>
                                    <div class="slug">
                                        <span
                                            :class="{first: index === 0}"
                                            v-for="(item, index) in breadcrumb(selectedItem.url)" :key="item">
                                                {{ item }}
                                        </span>
                                    </div>
                                    <span class="badge bg-info">{{selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1).toLowerCase()}}</span>
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
                    <div class="facets">
                        <div class="facet" :class="{'facet-active': selectedFacet === undefined}" @click="() => selectFacet(undefined)">
                            <span>All</span>
                        </div>
                        <div class="facet" v-for="(result, key, index) in searchFacets" @click="() => selectFacet(key)" :class="{'facet-active': selectedFacet === key}" :key="index">
                            <span>{{key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}}</span>
                            <span class="badge rounded-pill bg-primary">{{ result }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue";
    import Magnify from "vue-material-design-icons/Magnify.vue";
</script>

<script>
    import axios from "axios";
    import PostOutline from "vue-material-design-icons/PostOutline.vue";
    import TextBoxOutline from "vue-material-design-icons/TextBoxOutline.vue";
    import BullhornOutline from "vue-material-design-icons/BullhornOutline.vue";
    import PowerPlugOutline from "vue-material-design-icons/PowerPlugOutline.vue";

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
            }
        },
        created() {
            if (process.client) {
                window.addEventListener('keydown', this.handleKeyboard);
            }
        },
        unmounted() {
            if (process.client) {
                window.removeEventListener('keydown', this.handleKeyboard);
                document.documentElement.style.removeProperty("--top-bar-height");
            }
        },
        methods: {
            focusSearch() {
                document.querySelector('#search-input').focus();
                this.search();
            },
            search(value = '') {
                if (this.cancelToken !== undefined) {
                    this.cancelToken.cancel('cancel all');
                }
                this.cancelToken = axios.CancelToken.source();

                this.searchValue = value;
                return axios.get('https://api.kestra.io/v1/search', {
                    params: {
                        q: value,
                        type: this.selectedFacet || '',
                    },
                    cancelToken: this.cancelToken.token
                }).then(response => {
                    if (response?.data?.results && response.data.results.length) {
                        this.searchResults = response.data.results;
                        this.searchFacets = response.data.facets;
                        this.selectedIndex = 0;
                        this.selectedItem = response.data.results[0];
                    } else {
                        this.resetData();
                    }
                }).catch(() => {
                    this.resetData();
                })
            },
            resetData() {
                this.selectedIndex = null;
                this.selectedItem = null;
                this.selectedFacet = undefined;
                this.searchResults = [];
                this.searchFacets = {};
            },
            breadcrumb(slug) {
                return [...new Set(slug.split("/")
                    .filter(r => r !== ""))
                ]
            },
            onItemMouseOver(item, index) {
                this.selectedIndex = index;
                this.selectedItem = item;
            },
            selectFacet(facet) {
                if (this.selectedFacet !== facet) {
                    this.selectedFacet = facet;
                    this.search(this.searchValue)
                }
            },
            handleKeyboard(e) {
                if (e.key === "k" && e.ctrlKey) {
                    e.preventDefault(); // present "Save Page" from getting triggered.

                    document.getElementById('header-search-button').click();
                }

                if (e.key === "ArrowUp") {
                    this.selectedIndex = this.selectedIndex <= 1 ? 0 : this.selectedIndex-1;
                    this.selectedItem = this.searchResults[this.selectedIndex];
                    this.handleSearchScroll();
                }

                if (e.key === "ArrowDown" && this.searchResults) {
                    this.selectedIndex = this.selectedIndex >= this.searchResults.length - 1 ? this.searchResults.length - 1 : this.selectedIndex+1;
                    this.selectedItem = this.searchResults[this.selectedIndex];
                    this.handleSearchScroll();
                }

                if (e.key === "Enter" && this.searchResults && this.searchResults[this.selectedIndex]) {
                    document.querySelector(".search-result .active").click();
                }
            },
            handleSearchScroll() {
                let active = document.querySelector(".search-result .active");
                let container = document.querySelector(".search-result");

                if (active) {
                    if ((active.offsetTop + active.offsetHeight) >= container.offsetHeight) {
                        container.scrollTop = active.offsetTop;
                    } else if (active.offsetTop < container.offsetHeight) {
                        container.scrollTop = 0;
                    }
                }
            },
            iconByType(type) {
                switch (type) {
                    case "JOBS":
                        return BullhornOutline;
                    case "BLOGS":
                        return PostOutline;
                    case "PLUGINS":
                        return PowerPlugOutline;
                    default:
                        return TextBoxOutline;

                }
            },
            close() {
                if (this.$refs.modal) {
                    const modal = this.$bootstrap.Modal.getInstance(this.$refs.modal);
                    if (modal) {
                        modal.hide();
                    }
                }
            }
        }
    }
</script>


<style lang="scss">
    @import "../../assets/styles/variable";

    #search-modal {
        .input-group-text {
            background: transparent !important;
            font-size: 1.25rem;
            border-bottom-left-radius: 0;
            background: var(--bs-white);
            border-top-left-radius: $border-radius-lg;
        }

        .form-control {
            border-left: 0;
            background: transparent !important;
            border-bottom-right-radius: 0;
        }

        .form-control:focus {
            box-shadow: none;
            border-color: var(--bs-border-color);
        }

        .modal-content {
            background: none;
            border: 0;
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
            background: var(--bs-gray-300);
            border: 1px solid var(--bs-border-color);
            border-radius: $border-radius-lg;
            padding: 0;


            .search, .facets {
                color: var(--bs-black);

            }

            .facets {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 0 1rem;
                font-size: $font-size-sm;

                .facet {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem 1rem;
                    gap: 5px;
                    cursor: pointer;
                    border-top: 4px solid transparent;

                    &:hover {
                        border-top: 4px solid var(--bs-gray-500);
                    }

                    &-active, &-active:hover {
                        border-top: 4px solid var(--bs-primary);
                    }
                }
            }
        }

        .search-result, .search-detail {
            overflow: auto;
            max-height: 90vh;


            &::-webkit-scrollbar {
                width: 4px;
            }

            &::-webkit-scrollbar-track {
                background: var(--bs-gray-300);
            }

            &::-webkit-scrollbar-thumb {
                background: var(--bs-gray-400);
                border-radius: 4px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background: var(--bs-gray-500);
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
                    margin-left: 0.25rem;

                    &:before {
                        content: '/';
                        margin-right: 0.25rem;

                    }

                    &:first-child {
                        &:before {
                            display: none;
                        }
                    }

                    &.first {
                        font-weight: bold;
                    }
                }

                .breadcrumb-item + .breadcrumb-item::before {
                    color: $pink;
                }
            }
        }

        .search-result {
            background: var(--bs-white);
            border-top-right-radius: $border-radius-lg;
            border-bottom-right-radius: $border-radius-lg;
            .result {
                background: var(--bs-gray-100);
                transition: background-color 0.2s ease;
                padding: 1.25rem ;
                margin-bottom: calc($spacer * 0.5);
                display: flex;
                cursor: pointer;

                > div {
                    flex-grow: 1;

                    h5 {
                        font-size: $font-size-lg;
                        font-weight: bold;
                        margin-bottom: 0;
                        color: var(--bs-dark);
                    }

                    p {
                        color: var(--bs-gray-600);
                        font-size: $font-size-sm;
                        margin-bottom: 0;
                    }
                }

                span.material-design-icon.arrow {
                    font-size: 1rem;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }
            }

            .active .result, .result:hover {
                background: var(--bs-gray-200);

                span.material-design-icon.arrow {
                    opacity: 1;
                }
            }
        }

        .search-detail {
            .extract {
                overflow: auto;
                margin-top: 1rem;
                background: var(--bs-gray-100);
                border-radius: $border-radius-lg;
                font-family: var(--bs-font-monospace);

                font-size: 80%;
                padding: 1rem;
                max-wdith: 100%;

                p {
                    white-space: pre;
                    word-break: break-all;
                }

                mark {
                    color: $primary;
                }
            }
        }
    }
</style>