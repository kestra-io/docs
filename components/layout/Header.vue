<template>
    <nav class="navbar navbar-expand-lg bg-white sticky-top">
        <div class="container">
            <a class="navbar-brand" href="/">
                <img src="/logo.svg" alt="Kestra" width="30" height="24">
            </a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#main-header" aria-controls="main-header" aria-expanded="false" aria-label="Toggle navigation">
                Menu <Segment />
            </button>

            <div class="collapse navbar-collapse" id="main-header">
                <ul class="navbar-nav ms-auto me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Product</a>
                        <ul class="dropdown-menu">
                            <li>
                                <a class="dropdown-item" href="/features">
                                    <FeatureSearch />
                                    <p>
                                        <span>Features</span>
                                        Discover all the features of Kestra
                                    </p>
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="/solutions">
                                    <AccountNetworkOutline />
                                    <p>
                                        <span>Usages</span>
                                        How Kestra can help on your daily workflow
                                    </p>
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="/enterprise">
                                    <Security />
                                    <p>
                                        <span>Enterprise Edition</span>
                                        Security and High Availability for enterprise
                                    </p>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="/solutions" role="button" >Solutions</a>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Learn</a>
                        <ul class="dropdown-menu">
                            <li>
                                <a class="dropdown-item" href="/blogs">
                                    <PostOutline />
                                    <p>
                                        <span>Blogs</span>
                                        Product updates, user stories, and more
                                    </p>
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="/docs">
                                    <FileDocumentOutline />
                                    <p>
                                        <span>Documentation</span>
                                        Get started with Kestra
                                    </p>
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="/plugins">
                                    <Security />
                                    <p>
                                        <span>Plugins documentation</span>
                                        Extends Kestra with many plugins
                                    </p>
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="/community" role="button" >Community</a>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Company</a>
                        <ul class="dropdown-menu">
                            <li>
                                <a class="dropdown-item" href="/company">
                                    <AccountStarOutline />
                                    <p>
                                        <span>About us</span>
                                        Discover our story and our team
                                    </p>
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="/company/careers">
                                    <AccountStarOutline />
                                    <p>
                                        <span>Careers</span>
                                        Join an open company
                                    </p>
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="/company/contact">
                                    <Email />
                                    <p>
                                        <span>Contact us</span>
                                        Extends Kestra with many plugins
                                    </p>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>

                <ul class="navbar-nav mb-2 mb-lg-0 nav-button">
                    <li class="nav-item">
                        <a class="btn btn-secondary me-2" href="https://github.com/kestra-io/kestra" target="_blank" role="button" >
                            <Github />
                            {{ stargazersText }} ⭐️
                        </a>

                        <a class="btn btn-primary me-2" href="/docs/getting-started" role="button" >
                            <Flash />
                            Getting Started
                        </a>

                        <a class="btn search" data-bs-toggle="modal" data-bs-target="#search-modal"><Magnify /></a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="modal fade" id="search-modal" tabindex="-1" aria-labelledby="search-modal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="col-12">
                        <label class="visually-hidden" for="search-input">Email</label>
                        <input type="text" class="form-control" id="search-input" @input="event => search(event.target.value)" placeholder="Search">
                    </div>
                    <div class="search-result mt-3" v-if="searchResults">
                        <div v-for="results in searchResults">
                            <a :href="results.slug">
                                <h5>{{ results.title }}</h5>
                                <h6>{{ results.slug }}</h6>
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
    import AccountNetworkOutline from "vue-material-design-icons/AccountNetworkOutline.vue"
    import Security from "vue-material-design-icons/Security.vue"
    import PostOutline from "vue-material-design-icons/PostOutline.vue"
    import AccountStarOutline from "vue-material-design-icons/AccountStarOutline.vue"
    import Segment from "vue-material-design-icons/Segment.vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import Github from "vue-material-design-icons/Github.vue"
    import Flash from "vue-material-design-icons/Flash.vue"
</script>

<script>
    import axios from "axios";
    import {stargazers} from "../../utils/github.js";

    export default {
        data() {
            return {
                stargazersText: undefined,
                searchResults: undefined
            }
        },
        created() {
            stargazers().then(value => this.stargazersText = value);
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
        },
    }
</script>

<style lang="scss">
    @import "../../assets/styles/variable";



    nav {
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
                        --bs-dropdown-link-hover-bg: #F5F5FD;
                        padding: var(--bs-dropdown-padding-y);

                        .dropdown-item {
                            padding-left: calc($spacer / 4);
                            padding-right: calc($spacer / 4);
                            margin-bottom: calc($spacer / 2);
                            align-items: flex-start;
                            border-radius: $border-radius;
                            &:not(:last-child) {
                                margin-bottom: calc($spacer/4);
                            }

                            .material-design-icon, span {
                                color: $purple-12;
                            }

                            &:hover {
                                .material-design-icon, span {
                                    color: $primary;
                                }
                            }

                            span {
                                font-weight: 800;
                                line-height: 1;
                                display: block;
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
        .search-result {
            overflow: auto;
            h5 {
                font-size: $h6-font-size;
                margin-bottom: 0;
                color: $primary;
            }

            h6 {
                font-size: $font-size-sm;
                color: $success;
            }
        }
    }

</style>