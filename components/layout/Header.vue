<template>
    <nav id="top-bar" ref="navbar" class="navbar navbar-expand-lg fixed-top" :class="{transparent: transparentClass, open: isOpen}">
        <div class="container-xl">
            <NuxtLink class="navbar-brand" href="/" @click="logoClick">
                <img class="icon" src="/icon.svg" alt="Kestra, Open source declarative data orchestration" />
                <img v-if="transparentClass" src="/logo-white.svg" alt="Kestra, Open source declarative data orchestration" />
                <img v-else src="/logo.svg" alt="Kestra, Open source declarative data orchestration" />
            </NuxtLink>

            <button class="navbar-toggler" @click="globalClick(false)" type="button" aria-controls="main-header" aria-expanded="false" aria-label="Toggle navigation">
                {{ isOpen ? "Close" : "Menu" }}
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
                            <li>
                                <NuxtLink class="dropdown-item" href="/features" @click="globalClick(true)">
                                    <FeatureSearch />
                                    <p>
                                        <span>Open Source</span><br/>
                                        Discover all the features of Kestra
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/enterprise" @click="globalClick(true)">
                                    <Security />
                                    <p>
                                        <span>Enterprise Edition</span><br/>
                                        Security and High Availability for enterprise
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/features/declarative-data-orchestration" @click="globalClick(true)">
                                    <FileCodeOutline />
                                    <p>
                                        <span>Declarative Orchestration</span><br/>
                                        Simplified data workflow creation and execution
                                    </p>
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item dropdown" @mouseover="mouseOver" @mouseleave="mouseOut">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Solutions
                            <ChevronDown />
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <NuxtLink class="dropdown-item" href="/use-cases" @click="globalClick(true)">
                                    <ChartDonut/>
                                    <p>
                                        <span>Use cases</span><br/>
                                        Uncover a wide range of use cases
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/use-cases/ci-cd" @click="globalClick(true)">
                                    <Github/>
                                    <p>
                                        <span>CI/CD for Kestra Workflows</span><br/>
                                        Treat your workflow as code and embrace CI/CD practices
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/use-cases/modern-data-stack" @click="globalClick(true)">
                                    <AxisArrow/>
                                    <p>
                                        <span>Modern Data Stack Integration</span><br/>
                                        Integrate leading data tools with Kestra
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/use-cases/change-data-capture" @click="globalClick(true)">
                                    <Reload/>
                                    <p>
                                        <span>Change Data Capture</span><br/>
                                        Leverage Kestra's Change Data Capture capabilities
                                    </p>
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link" href="/docs" role="button" @click="globalClick(true)">
                            <span>
                                Docs
                            </span>
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link" href="/plugins" role="button" @click="globalClick(true)">
                            <span>
                                Plugins
                            </span>
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link" href="/blogs" role="button" @click="globalClick(true)">
                            <span>
                                Blog
                            </span>
                        </NuxtLink>
                    </li>
                    <li class="nav-item dropdown" @mouseover="mouseOver" @mouseleave="mouseOut">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Resources
                            <ChevronDown />
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <NuxtLink class="dropdown-item" href="/community" @click="globalClick(true)">
                                    <AccountGroup/>
                                    <p>
                                        <span>Community Overview</span><br/>
                                        Ask any questions and share your feedback
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/partners" @click="globalClick(true)">
                                    <Handshake />
                                    <p>
                                        <span>Partners</span><br/>
                                        Elevate your Kestra use through our partner ecosystem
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/faq" @click="globalClick(true)">
                                    <AccountGroup/>
                                    <p>
                                        <span>FAQ</span><br/>
                                        FAQ about the product and the company
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/about-us" @click="globalClick(true)">
                                    <Domain/>
                                    <p>
                                        <span>About us</span><br/>
                                        Discover our story and meet our team
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/careers" @click="globalClick(true)">
                                    <AccountStarOutline/>
                                    <p>
                                        <span>Careers</span><br/>
                                        Join a remote-first company
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/contact-us" @click="globalClick(true)">
                                    <Email/>
                                    <p>
                                        <span>Contact us</span><br/>
                                        Get in touch with us
                                    </p>
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>
                </ul>

                <ul class="navbar-nav mb-2 mb-lg-0 nav-button">
                    <li class="nav-item">
                        <a href="/slack" class="btn btn-sm d-inline-block d-inline-block d-lg-none d-xxl-inline-block icon-button" target="_blank" title="Join our slack">
                            <Slack />
                        </a>

                        <a class="d-sm-inline-block mb-1 mn-sm-0 btn btn-dark btn-sm me-sm-2" href="https://github.com/kestra-io/kestra" target="_blank">
                            <Github /> Star us
                        </a>

                        <NuxtLink @click="globalClick(true)" class="d-block d-sm-inline-block mb-1 mn-sm-0 btn btn-sm btn-dark me-0 me-sm-2 d-inline-block d-lg-none d-xxl-inline-block" href="/demo">
                            <span>
                                <CalendarOutline /> 
                                Book a demo
                            </span>
                        </NuxtLink>

                        <NuxtLink @click="globalClick(true)" class="d-block d-sm-inline-block mb-1 mn-sm-0 btn btn-primary btn-sm" href="/docs/getting-started">
                            <span>
                                <Flash/>
                                Get Started
                            </span>
                        </NuxtLink>

                        <a @click="globalClick(true)" href="#" class="d-block d-sm-none d-sm-inline-block mb-1 mn-sm-0 btn btn-info btn-sm" ref="search-button" data-bs-toggle="modal" data-bs-target="#search-modal">
                            <Magnify/> Search
                        </a>

                        <a @click="globalClick(true)" href="#" class="btn btn-sm d-none d-sm-inline-block icon-button" data-bs-toggle="modal" data-bs-target="#search-modal" title="Search">
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
                    <div class="search-result p-3" v-if="searchValue" @mouseover="onSearchMouseOver" @mouseout="onSearchMouseOut">
                        <div v-for="(result, index) in searchResults">
                            <a :href="result.slug" :class="{'active': index === selectedIndex && !searchOver}">
                                <div class="slug">
                                    <span :class="{first: index === 0}"  v-for="(item, index) in breadcrumb(result.slug)" :key="item" >{{ item }}</span>
                                </div>
                                <div class="result rounded-3">
                                    <div>
                                        <h5>{{ result.title }}</h5>
                                        <p v-if="result.content.length > 0" v-html="result.content[0]" class="search-result-extract"/>
                                    </div>
                                    <ArrowRight />
                                </div>
                            </a>
                        </div>
                        <div v-if="searchValue && searchResults && searchResults.length === 0" class="alert alert-warning mb-0" role="alert">
                            No results found for the current search
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
    import AccountGroup from "vue-material-design-icons/AccountGroup.vue"
    import Handshake from "vue-material-design-icons/Handshake.vue"
    import AccountStarOutline from "vue-material-design-icons/AccountStarOutline.vue"
    import Segment from "vue-material-design-icons/Segment.vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import Flash from "vue-material-design-icons/Flash.vue"
    import Domain from "vue-material-design-icons/Domain.vue"
    import CalendarOutline from "vue-material-design-icons/CalendarOutline.vue"
    import FileCodeOutline from "vue-material-design-icons/FileCodeOutline.vue"
    import ArrowRight from "vue-material-design-icons/ArrowRight.vue";
    import Github from "vue-material-design-icons/Github.vue"
    import Slack from "vue-material-design-icons/Slack.vue"
    import Reload from "vue-material-design-icons/Reload.vue"
    import AxisArrow from "vue-material-design-icons/AxisArrow.vue"
    import ChartDonut from "vue-material-design-icons/ChartDonut.vue"
</script>

<script>
    import axios from "axios";
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
    import ChevronUp from "vue-material-design-icons/ChevronUp.vue";

    export default {
        components: {
            ChevronDown,
            ChevronUp
        },
        data() {
            return {
                searchResults: undefined,
                transparentHeader: false,
                transparentClass: false,
                isOpen: false,
                cancelToken: undefined,
                selectedIndex: 0,
                searchValue: undefined,
                searchOver: false
            }
        },
        collapse: undefined,
        created() {
            const route = useRoute();
            this.transparentHeader = route.meta.transparentHeader === true;
            this.transparentClass = route.meta.transparentHeader === true;

            if (process.client) {
                window.addEventListener('scroll', this.handleScroll);
                window.addEventListener('keydown', this.handleKeyboard);
            }

            if (process.client) {
                this.collapse = new this.$bootstrap.Collapse('#main-header', {
                    toggle: false
                })
            }

            this.cancelToken = axios.CancelToken.source();
        },
        watch: {
            $route(to) {
                this.transparentHeader = to.meta.transparentHeader === true;
                this.transparentClass = to.meta.transparentHeader === true;
            }
        },
        mounted() {
            if(process.client) {
                document.documentElement.style.setProperty("--top-bar-height", this.$refs.navbar.offsetHeight + "px");
            }
        },
        unmounted() {
            if (process.client) {
                window.removeEventListener('scroll', this.handleScroll);
                window.removeEventListener('keydown', this.handleKeyboard);
                document.documentElement.style.removeProperty("--top-bar-height");
            }
        },
        methods: {
            focusSearch() {
                document.querySelector('#search-input').focus();
            },
            search(query) {
                this.searchValue = query;
                this.selectedIndex = 0;

                return axios.get("/api/search", {
                    params: {
                        query: query
                    },
                    cancelToken: this.cancelToken.token
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
            onSearchMouseOver(event) {
                this.searchOver = true;
            },
            onSearchMouseOut(event) {
                this.searchOver = false;
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
            handleKeyboard(e) {
                if (e.key === "k" && e.ctrlKey) {
                    e.preventDefault(); // present "Save Page" from getting triggered.

                    this.$refs["search-button"].click();
                }

                if (e.key === "ArrowUp") {
                    this.selectedIndex = this.selectedIndex <= 1 ? 0 : this.selectedIndex-1;
                    this.handleSearchScroll();
                }

                if (e.key === "ArrowDown" && this.searchResults) {
                    this.selectedIndex = this.selectedIndex >= this.searchResults.length - 1 ? this.searchResults.length - 1 : this.selectedIndex+1;
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
            globalClick(close) {
                if (close) {
                    if (this.$refs.navbar.classList.contains("open")) {
                        this.collapse.hide();
                        this.isOpen = false;
                    }
                } else {
                    this.collapse.toggle();
                    this.isOpen = !this.isOpen;
                }
            },
            logoClick(){
                if(this.$route.path === "/"){
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
                this.globalClick(true);
            }
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/variable";

    nav {
        background: var(--bs-white);
        box-shadow: $box-shadow;
        transition: all ease 0.2s;
        transform: translateY(0);
        max-height: 100%;

        .navbar-brand {
            img:not(.icon) {
                height: 100%;
                width: 180px;
            }

            .icon {
                display: none;
                height: 100%;
            }

            @media (max-width: 320px) {
                .icon {
                    width: 40px;
                    display: block;
                }

                img:not(.icon) {
                    display: none;
                }
            }
        }

        a.nav-link, button.navbar-toggler, &.btn.search {
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
            max-width: 100%;

            @include media-breakpoint-down(lg) {
                max-height: calc(100vh - 67px);
                overflow-y: auto;
                overflow-x: hidden;
            }

            ul.navbar-nav {
                li {
                    @include media-breakpoint-between(lg, xxl) {
                        font-size: 1rem;
                    }

                    font-size: 1.125rem;

                    a.nav-link {
                        font-weight: bold;
                        border-radius: $border-radius;

                        @include media-breakpoint-down(lg) {
                            padding-left: 1rem;
                        }

                        &:after {
                            display: none;
                        }

                        &.show {
                            color: $primary;
                            background: var(--bs-gray-100);
                        }
                    }

                    @include media-breakpoint-down(lg) {
                        .chevron-down-icon {
                            display: none;
                        }
                    }


                    .dropdown-toggle {
                        .chevron-down-icon {
                            transition: .2s all cubic-bezier(1, 0.25, 0.25, .8);
                            will-change: transform;
                        }

                        &.show .chevron-down-icon {
                            transform: rotate(180deg);
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
                                font-size: 135%;
                                margin-right: calc($spacer / 2);
                                flex-shrink: 0;

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
                white-space: nowrap;
                li {
                    vertical-align: center;
                }

                .btn {
                    border-radius: $border-radius;
                    &.icon-button {
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

                    .material-design-icon, span {
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

</style>

<style lang="scss">
    @import "../../assets/styles/variable";

    #search-modal {
        .input-group-text {
            background: transparent;
            font-size: 1.25rem;
            border-bottom-left-radius: 0;
            background: var(--bs-white);
            border-top-left-radius: $border-radius-lg;
        }

        .form-control {
            border-left: 0;
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

        .modal-body {
            padding: 0;
        }

        .search-result {
            overflow: auto;
            max-height: 93vh;
            background: var(--bs-white);
            border: 1px solid var(--bs-border-color);
            border-bottom-left-radius: $border-radius-lg;
            border-bottom-right-radius: $border-radius-lg;

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

            .result {
                background: var(--bs-gray-100);
                transition: background-color 0.2s ease;
                padding: 1.25rem ;
                margin-bottom: calc($spacer * 1.5);
                display: flex;
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


                span.material-design-icon {
                    font-size: 1rem;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                mark {
                    background-color: transparent;
                    padding: 0;
                    color: $primary;
                }
            }

            .active .result, .result:hover {
                background: var(--bs-gray-200);

                span.material-design-icon {
                    opacity: 1;
                }
            }
        }
    }
</style>