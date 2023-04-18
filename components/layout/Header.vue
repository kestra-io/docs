<template>
    <nav class="navbar navbar-expand-lg bg-white sticky-top shadow">
        <div class="container">
            <NuxtLink class="navbar-brand" href="/">
                <img src="/logo.svg" alt="Kestra's logo black font" width="30" height="24">
            </NuxtLink>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-header" aria-controls="main-header" aria-expanded="false" aria-label="Toggle navigation">
                Menu <Segment />
            </button>

            <div class="collapse navbar-collapse" id="main-header">
                <ul class="navbar-nav ms-auto me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" @mouseover="mouseOver" @mouseout="mouseOut" role="button" data-bs-toggle="dropdown" aria-expanded="false">Product</a>
                        <ul class="dropdown-menu">
                            <li>
                                <NuxtLink class="dropdown-item" href="/features">
                                    <FeatureSearch />
                                    <p>
                                        <span>Features</span><br />
                                        Discover all the features of Kestra
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/enterprise">
                                    <Security />
                                    <p>
                                        <span>Enterprise Edition</span><br />
                                        Security and High Availability for enterprise
                                    </p>
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <NuxtLink class="nav-link" href="/use-cases" role="button" >Solutions</NuxtLink>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Learn</a>
                        <ul class="dropdown-menu">
                            <li>
                                <NuxtLink class="dropdown-item" href="/blogs">
                                    <PostOutline />
                                    <p>
                                        <span>Blogs</span><br />
                                        Product updates, user stories, and more
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/docs">
                                    <FileDocumentOutline />
                                    <p>
                                        <span>Documentation</span><br />
                                        Get started with Kestra
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/plugins">
                                    <Security />
                                    <p>
                                        <span>Plugins documentation</span><br />
                                        Extends Kestra with many plugins
                                    </p>
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <NuxtLink class="nav-link" href="/community" role="button" >Community</NuxtLink>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Company</a>
                        <ul class="dropdown-menu">
                            <li>
                                <NuxtLink class="dropdown-item" href="/about-us">
                                    <Domain />
                                    <p>
                                        <span>About us</span><br />
                                        Discover our story and our team
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/careers">
                                    <AccountStarOutline />
                                    <p>
                                        <span>Careers</span><br />
                                        Join an open company
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/contact-us">
                                    <Email />
                                    <p>
                                        <span>Contact us</span><br />
                                        Extends Kestra with many plugins
                                    </p>
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>
                </ul>

                <ul class="navbar-nav mb-2 mb-lg-0 nav-button">
                    <li class="nav-item">
                        <GithubButton class="btn-secondary me-2" />

                        <NuxtLink class="btn btn-primary me-2" href="/docs/getting-started" role="button" >
                            <Flash />
                            Getting Started
                        </NuxtLink>

                        <a class="btn search" data-bs-toggle="modal" data-bs-target="#search-modal"><Magnify /></a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="modal modal-lg fade" id="search-modal" tabindex="-1" aria-labelledby="search-modal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="col-12">
                        <label class="visually-hidden" for="search-input">Search</label>
                        <div class="input-group">
                            <span class="input-group-text"><Magnify /></span>
                            <input type="text" class="form-control form-control-lg" id="search-input" @input="event => search(event.target.value)" autocomplete="off" placeholder="Search" />
                        </div>


                    </div>
                    <div class="search-result mt-3" v-if="searchResults">
                        <div v-for="result in searchResults">
                            <a :href="result.slug">
                                <div class="slug">
                                    <span :class="{first: index === 0}"  v-for="(item, index) in breadcrumb(result.slug)" :key="item" >{{ item }}</span>
                                </div>
                                <div class="result rounded-3">
                                    <h5>{{ result.title }}</h5>
                                    <p v-if="result.content.length > 0" v-html="result.content[0]" class="search-result-extract"/>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import FileDocumentOutline from "vue-material-design-icons/FileDocumentOutline.vue";
    import Email from "vue-material-design-icons/Email.vue";
    import FeatureSearch from "vue-material-design-icons/FeatureSearch.vue"
    import Security from "vue-material-design-icons/Security.vue"
    import PostOutline from "vue-material-design-icons/PostOutline.vue"
    import AccountStarOutline from "vue-material-design-icons/AccountStarOutline.vue"
    import Segment from "vue-material-design-icons/Segment.vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import Flash from "vue-material-design-icons/Flash.vue"
    import Domain from "vue-material-design-icons/Domain.vue"
</script>

<script>
    import axios from "axios";
    import GithubButton from "../layout/GithubButton.vue";

    export default {
        components: {
            GithubButton,
        },
        data() {
            return {
                searchResults: undefined
            }
        },
        methods: {
            search(query) {
                return axios.get("/api/search", {
                    params: {
                        query: query
                    }
                }).then(response => {
                    this.searchResults = response.data;

                    return response.data;
                })
            },
            breadcrumb(slug) {
                return [...new Set(slug.split("/")
                    .filter(r => r !== ""))
                ]
            }
        },
    }
</script>

<style lang="scss">
    @import "../../assets/styles/variable";

    nav {

        &.shadow {
            box-shadow: 0 1rem 3rem 0 rgba($primary, 0.05);
        }

        .navbar-brand {
            img {
                height: 100%;
                width: 200px;
            }
        }

        a, a.nav-link, button.navbar-toggler {
            color: var(--bs-black);
            box-shadow: none !important;
        }

        .navbar-toggler {
            border: 0;
            font-family: var(--bs-font-monospace);
            text-transform: uppercase;
            font-size: var(--bs-font-size-sm);
        }

        .navbar-collapse {
            ul.navbar-nav {
                li {
                    a.nav-link {
                        font-weight: bold;


                        &:after {
                            display: none;
                        }
                    }

                    .dropdown-menu {
                        --bs-dropdown-link-hover-bg: #{$purple-25};
                        --bs-dropdown-link-active-bg: #{$purple-25};
                        padding: 1rem;
                        margin-top: 25px;
                        box-shadow: $box-shadow;
                        border: 0;
                        border-radius: $border-radius-lg;

                        .dropdown-item {
                            padding-left: 1rem;
                            padding-right: 1rem;
                            margin-bottom: calc($spacer / 2);
                            align-items: flex-start;
                            border-radius: $border-radius;
                            &:not(:last-child) {
                                margin-bottom: calc($spacer/4);
                            }

                            &:last-child {
                                margin-bottom: 0;
                            }

                            .material-design-icon, span {
                                color: $purple-12;
                            }

                            &:hover {
                                .material-design-icon, span {
                                    color: $primary;
                                }

                                p span {
                                    &:after {
                                        content: '→';
                                        font-weight: bold;
                                        font-family: var(--bs-font-monospace);
                                        position: absolute;
                                        font-size: 26px;
                                        top: -8px;
                                        right: -25px;
                                    }
                                }
                            }

                            span {
                                font-weight: 800;
                                line-height: 1;
                                display: block;
                                position: relative;
                            }

                            display: flex;
                            flex-direction: row;
                            .material-design-icon {
                                font-size: 225%;
                                margin-right: calc($spacer / 2);

                                > .material-design-icon__svg {
                                    bottom: 0.125rem;
                                }
                            }

                            p {
                                color: var(--bs-black);
                                font-size: var(--bs-font-size-sm);
                                margin-bottom: 0;

                                span {
                                    display: inline-block;
                                }

                                mark {
                                    padding-left: 0;
                                    padding-right: 0;
                                }
                            }
                        }
                    }
                }
            }

            .nav-button {
                li {
                    vertical-align: center;
                }

                .btn {
                    font-weight: bold;
                    font-size: var(--bs-font-size-sm);
                    line-height: 2;

                    &.search {
                        font-size: $font-size-lg;
                        color: var(--bs-black);
                    }
                }
            }
        }
    }

    #search-modal {
        .input-group-text {
            background: transparent;
        }

        .form-control:focus {
            box-shadow: none;
        }

        .search-result {
            overflow: auto;

            .slug {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                width: 100%;
                font-size: $font-size-sm;
                color: $pink;
                font-family: var(--bs-font-monospace);
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

            .result {
                background: var(--bs-gray-100);
                padding: 0.5rem 1.5rem;
                margin-bottom: calc($spacer * 1.5);

                h5 {
                    font-size: $font-size-lg;
                    font-weight: bold;
                    margin-bottom: 0;
                    color: var(--bs-dark);
                }

                p {
                    color: var(--bs-gray-800);
                    font-size: $font-size-sm;
                    margin-bottom: 0;
                }

            }
        }
    }

</style>