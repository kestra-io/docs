<template>
    <nav ref="navbar" class="navbar navbar-expand-lg sticky-top" :class="{transparent: transparentClass, open: isOpen}">
        <div class="container">
            <NuxtLink class="navbar-brand" href="/">
                <img v-if="transparentClass" src="/logo-white.svg" alt="Kestra, Open source declarative data orchestration" width="30" height="24">
                <img v-else src="/logo.svg" alt="Kestra, Open source declarative data orchestration" width="30" height="24">
            </NuxtLink>

            <button class="navbar-toggler" @click="isOpen = !isOpen" type="button" data-bs-toggle="collapse" data-bs-target="#main-header" aria-controls="main-header" aria-expanded="false" aria-label="Toggle navigation">
                Menu
                <Segment/>
            </button>

            <div class="collapse navbar-collapse" id="main-header">
                <ul class="navbar-nav ms-auto me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown" @mouseover="mouseOver" @mouseleave="mouseOut">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Product
                            <ChevronDown />
                        </a>
                        <ul class="dropdown-menu">
                            <li data-bs-toggle="collapse" data-bs-target="#main-header.show">
                                <NuxtLink class="dropdown-item" href="/features">
                                    <FeatureSearch/>
                                    <p>
                                        <span>Features</span><br/>
                                        Discover all the features of Kestra
                                    </p>
                                </NuxtLink>
                            </li>
                            <li data-bs-toggle="collapse" data-bs-target="#main-header.show">
                                <NuxtLink class="dropdown-item" href="/enterprise">
                                    <Security/>
                                    <p>
                                        <span>Enterprise Edition</span><br/>
                                        Security and High Availability for enterprise
                                    </p>
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <NuxtLink class="nav-link" href="/use-cases" role="button">
                            <span data-bs-toggle="collapse" data-bs-target="#main-header.show">
                                Solutions
                            </span>
                        </NuxtLink>
                    </li>

                    <li class="nav-item dropdown" @mouseover="mouseOver" @mouseleave="mouseOut">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Docs
                            <ChevronDown />
                        </a>
                        <ul class="dropdown-menu">
                            <li data-bs-toggle="collapse" data-bs-target="#main-header.show" class="animation-slide-left">
                                <NuxtLink class="dropdown-item" href="/blogs">
                                    <PostOutline/>
                                    <p>
                                        <span>Blogs</span><br/>
                                        Product updates, user stories, and more
                                    </p>
                                </NuxtLink>
                            </li>
                            <li data-bs-toggle="collapse" data-bs-target="#main-header.show">
                                <NuxtLink class="dropdown-item" href="/docs">
                                    <FileDocumentOutline/>
                                    <p>
                                        <span>Documentation</span><br/>
                                        Get started with Kestra
                                    </p>
                                </NuxtLink>
                            </li>
                            <li data-bs-toggle="collapse" data-bs-target="#main-header.show">
                                <NuxtLink class="dropdown-item" href="/plugins">
                                    <Security/>
                                    <p>
                                        <span>Plugins documentation</span><br/>
                                        Extends Kestra with many plugins
                                    </p>
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <NuxtLink class="nav-link" href="/community">
                            <span data-bs-toggle="collapse" data-bs-target="#main-header.show">
                                Community
                            </span>
                        </NuxtLink>
                    </li>

                    <li class="nav-item dropdown" @mouseover="mouseOver" @mouseout="mouseOut">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Company <ChevronDown />
                        </a>
                        <ul class="dropdown-menu">
                            <li data-bs-toggle="collapse" data-bs-target="#main-header.show">
                                <NuxtLink class="dropdown-item" href="/about-us">
                                    <Domain/>
                                    <p>
                                        <span>About us</span><br/>
                                        Discover our story and our team
                                    </p>
                                </NuxtLink>
                            </li>
                            <li data-bs-toggle="collapse" data-bs-target="#main-header.show">
                                <NuxtLink class="dropdown-item" href="/careers">
                                    <AccountStarOutline/>
                                    <p>
                                        <span>Careers</span><br/>
                                        Join an open company
                                    </p>
                                </NuxtLink>
                            </li>
                            <li data-bs-toggle="collapse" data-bs-target="#main-header.show">
                                <NuxtLink class="dropdown-item" href="/contact-us">
                                    <Email/>
                                    <p>
                                        <span>Contact us</span><br/>
                                        Extends Kestra with many plugins
                                    </p>
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>
                </ul>

                <ul class="navbar-nav mb-2 mb-lg-0 nav-button">
                    <li class="nav-item">
                        <GithubButton class="btn-secondary me-2" data-bs-toggle="collapse" data-bs-target="#main-header.show" toto="test"/>

                        <a v-if="false" class="btn btn-dark me-2" target="_blank" href="https://meetings-eu1.hubspot.com/quentin-sinig/meeting-link-demo">
                            <CalendarOutline /> Book a demo
                        </a>

                        <NuxtLink class="btn btn-primary me-2" href="/docs/getting-started">
                            <span data-bs-toggle="collapse" data-bs-target="#main-header.show">
                                <Flash/>
                                Getting Started
                            </span>
                        </NuxtLink>

                        <a class="btn search" data-bs-toggle="modal" data-bs-target="#search-modal">
                            <Magnify/>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div v-on="{ 'shown.bs.modal': focusSearch }" class="modal modal-lg fade" id="search-modal" tabindex="-1" aria-labelledby="search-modal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="col-12">
                        <label class="visually-hidden" for="search-input">Search</label>
                        <div class="input-group">
                            <span class="input-group-text"><Magnify/></span>
                            <input type="text" class="form-control form-control-lg" id="search-input" @input="event => search(event.target.value)" autocomplete="off" placeholder="Search"/>
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
    import CalendarOutline from "vue-material-design-icons/CalendarOutline.vue"
</script>

<script>
    import axios from "axios";
    import GithubButton from "../layout/GithubButton.vue";
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue";

    export default {
        components: {
            GithubButton,
            ChevronDown,
            ChevronUp
        },
        data() {
            return {
                searchResults: undefined,
                transparentHeader: false,
                transparentClass: false,
                isOpen: false,
            }
        },
        created() {
            const route = useRoute();
            this.transparentHeader = route.meta.transparentHeader === true;
            this.transparentClass = route.meta.transparentHeader === true;

            if (process.client) {
                window.addEventListener('scroll', this.handleScroll);
            }
        },
        watch: {
            $route(to) {
                this.transparentHeader = to.meta.transparentHeader === true;
                this.transparentClass = to.meta.transparentHeader === true;
            }
        },
        unmounted() {
            if (process.client) {
                window.removeEventListener('scroll', this.handleScroll);
            }
        },
        methods: {
            focusSearch() {
                document.querySelector('#search-input').focus();
            },
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
            },
            mouseElement(element) {
                if (element.classList.contains("nav-link")) {
                    return element;
                } else {
                    return element.closest(".nav-item").firstElementChild;
                }
            },
            mouseOver(event) {
                let element = this.mouseElement(event.target);

                element.classList.add('show');
                element.nextElementSibling.classList.add('show');
            },
            mouseOut(event) {
                let element = this.mouseElement(event.target);

                element.classList.remove('show');
                element.nextElementSibling.classList.remove('show');
            },
            handleScroll() {
                if (this.transparentHeader) {
                    if (window.scrollY > 30) {
                        this.transparentClass = false;
                    } else {
                        this.transparentClass = true;
                    }
                }
            },
        },
    }
</script>

<style lang="scss">
    @import "../../assets/styles/variable";

    nav {
        background: var(--bs-white);
        box-shadow: $box-shadow;
        transition: all ease 0.2s;

        .navbar-brand {
            img {
                height: 100%;
                width: 200px;
            }
        }

        a, a.nav-link, button.navbar-toggler, &.btn.search {
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
                    font-size: 1.125rem;

                    a.nav-link {
                        font-weight: bold;
                        border-radius: $border-radius;

                        @include media-breakpoint-down(lg) {
                            padding-left: 2rem;
                        }

                        &:after {
                            display: none;
                        }

                        &.show {
                            color: $primary;
                            background: var(--bs-gray-100);
                        }
                    }


                    .dropdown-menu {
                        --bs-dropdown-link-hover-bg: var(--bs-gray-100);
                        --bs-dropdown-link-active-bg: var(--bs-gray-100);
                        padding: 1rem;
                        box-shadow: $box-shadow;
                        border-radius: $border-radius-lg;
                        border: 1px solid var(--bs-border-color);

                        @include media-breakpoint-down(lg) {
                            display: block;
                            padding: 0;
                            box-shadow: none;
                            border: 0;
                        }
                        animation-duration: 0.2s;
                        animation-fill-mode: forwards;
                        animation-name: slide-in;

                        .dropdown-item {
                            padding-left: 1rem;
                            padding-right: 1rem;
                            margin-bottom: calc($spacer / 2);
                            align-items: flex-start;
                            border-radius: $border-radius;

                            &:not(:last-child) {
                                margin-bottom: calc($spacer / 4);
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

                    &.search {
                        font-size: 1.5rem;

                        &:hover {
                            color: $primary;
                        }
                    }
                }
            }
        }


        &.transparent {
            background: transparent;
            box-shadow: none;

            a, a.nav-link, button.navbar-toggler, &.btn.search {
                color: var(--bs-white);
            }

            .navbar-collapse {
                ul.navbar-nav {
                    li {
                        a.nav-link {
                            &.show {
                                color: $secondary;
                                background: rgba($gray-100, 5%);
                            }
                        }
                    }
                }
            }

            @include media-breakpoint-down(lg) {
                &.open {
                    background: #200149;
                }

                .navbar-collapse ul.navbar-nav li .dropdown-menu .dropdown-item  {
                    color: var(--bs-white);
                    --bs-dropdown-link-hover-bg: #{rgba($gray-100, 5%)};
                    --bs-dropdown-link-active-bg: #{rgba($gray-100, 5%)};

                    &:hover {
                        .material-design-icon, span {
                            color: var(--bs-white);
                        }
                    }

                    .material-design-icon > .material-design-icon__svg {
                        color: var(--bs-white);
                    }
                    p {
                        color: var(--bs-gray-400);

                        span {
                            color: var(--bs-white);
                        }
                    }
                }
                .dropdown-menu {
                    background: transparent;
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