<template>
    <nav id="top-bar" ref="navbar" class="navbar navbar-expand-lg fixed-top" :class="{open: isOpen}">
        <div class="container-xl">
            <NuxtLink class="navbar-brand" href="/" @click="logoClick">
                <img class="icon" src="/icon.svg" alt="Kestra, Open source declarative data orchestration" />
                <img src="/logo-white.svg" alt="Kestra, Open source declarative data orchestration" />
            </NuxtLink>

            <button class="navbar-toggler" @click="globalClick(false)" type="button" aria-controls="main-header"
                aria-expanded="false" aria-label="Toggle navigation">
                {{ isOpen ? "Close" : "Menu" }}
                <Segment />
            </button>

            <div class="collapse navbar-collapse" id="main-header">
                <ul class="navbar-nav ms-auto me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown" @mouseover="mouseOver" @mouseleave="mouseOut">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Product
                            <ChevronDown />
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <NuxtLink class="dropdown-item" href="/features" @click="globalClick(true)">
                                    <FeatureSearch />
                                    <p>
                                        <span>Open Source</span><br />
                                        Discover all the features of Kestra
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/enterprise" @click="globalClick(true)">
                                    <Security />
                                    <p>
                                        <span>Enterprise Edition</span><br />
                                        Security and High Availability for enterprise
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/features/declarative-data-orchestration"
                                    @click="globalClick(true)">
                                    <FileCodeOutline />
                                    <p>
                                        <span>Declarative Orchestration</span><br />
                                        Simplified data workflow creation and execution
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/features/scheduling-and-automation"
                                          @click="globalClick(true)">
                                    <Sync />
                                    <p>
                                        <span>Automation Platform</span><br />
                                        Automate all your workflows with Kestra
                                    </p>
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item dropdown" @mouseover="mouseOver" @mouseleave="mouseOut">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Solutions
                            <ChevronDown />
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <NuxtLink class="dropdown-item" href="/use-cases" @click="globalClick(true)">
                                    <ChartDonut />
                                    <p>
                                        <span>Use cases</span><br />
                                        Uncover a wide range of use cases
                                    </p>
                                </NuxtLink>
                            </li>
                            <!--                            <li>-->
                            <!--                                <NuxtLink class="dropdown-item" href="/use-cases/ci-cd" @click="globalClick(true)">-->
                            <!--                                    <Github/>-->
                            <!--                                    <p>-->
                            <!--                                        <span>CI/CD for Kestra Workflows</span><br/>-->
                            <!--                                        Treat your workflow as code and embrace CI/CD practices-->
                            <!--                                    </p>-->
                            <!--                                </NuxtLink>-->
                            <!--                            </li>-->
                            <li>
                                <NuxtLink class="dropdown-item" href="/use-cases/terraform-provider"
                                    @click="globalClick(true)">
                                    <Terraform />
                                    <p>
                                        <span>Kestra's Terraform Provider</span><br />
                                        Manage and deploy Kestra workflows in your Terraform environment
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/use-cases/stories" @click="globalClick(true)">
                                    <BookOpenVariant />
                                    <p>
                                        <span>Customers stories</span><br />
                                        Learn how Kestra helped companies manage their critical operations
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/use-cases/modern-data-stack"
                                    @click="globalClick(true)">
                                    <AxisArrow />
                                    <p>
                                        <span>Modern Data Stack Integration</span><br />
                                        Integrate leading data tools with Kestra
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/use-cases/change-data-capture"
                                    @click="globalClick(true)">
                                    <Reload />
                                    <p>
                                        <span>Change Data Capture</span><br />
                                        Leverage Kestra's Change Data Capture capabilities
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/blueprints" @click="globalClick(true)">
                                    <Ballot />
                                    <p>
                                        <span>Blueprints</span><br />
                                        Explore blueprints to kick-start your next flow
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/use-cases/retail" @click="globalClick(true)">
                                    <BasketOutline />
                                    <p>
                                        <span>Kestra for Retail</span><br />
                                        Orchestrate Your Retail Ecosystem
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
                        <NuxtLink class="nav-link dropdown-toggle" href="/blogs" role="button" @click="globalClick(true)">
                            <span>
                                Blog
                            </span>
                        </NuxtLink>
                    </li>
                    <li class="nav-item dropdown" @mouseover="mouseOver" @mouseleave="mouseOut">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Resources
                            <ChevronDown />
                        </a>
                        <ul class="dropdown-menu">
                            <li>
                                <NuxtLink class="dropdown-item" href="/community" @click="globalClick(true)">
                                    <AccountGroup />
                                    <p>
                                        <span>Community Overview</span><br />
                                        Ask any questions and share your feedback
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/partners" @click="globalClick(true)">
                                    <Handshake />
                                    <p>
                                        <span>Partners</span><br />
                                        Elevate your Kestra use through our partner ecosystem
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/faq" @click="globalClick(true)">
                                    <AccountGroup />
                                    <p>
                                        <span>FAQ</span><br />
                                        FAQ about the product and the company
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/about-us" @click="globalClick(true)">
                                    <Domain />
                                    <p>
                                        <span>About us</span><br />
                                        Discover our story and meet our team
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/careers" @click="globalClick(true)">
                                    <AccountStarOutline />
                                    <p>
                                        <span>Careers</span><br />
                                        Join a remote-first company
                                    </p>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink class="dropdown-item" href="/contact-us" @click="globalClick(true)">
                                    <Email />
                                    <p>
                                        <span>Contact us</span><br />
                                        Get in touch with us
                                    </p>
                                </NuxtLink>
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link dropdown-toggle" href="/pricing" role="button" @click="globalClick(true)">
                            <span>
                                Pricing
                            </span>
                        </NuxtLink>
                    </li>
                </ul>

                <ul class="navbar-nav mb-2 mb-lg-0 nav-button">
                    <li class="nav-item">
                        <a href="/slack"
                            class="btn btn-sm d-inline-block d-inline-block d-lg-none d-xxl-inline-block icon-button"
                            target="_blank" title="Join our slack">
                            <Slack />
                        </a>

                        <GithubButton :small="true" />

                        <NuxtLink @click="globalClick(true)"
                            class="d-block d-sm-inline-block mb-1 mn-sm-0 btn btn-sm me-0 me-sm-2 d-inline-block d-lg-none d-xxl-inline-block"
                            href="/demo">
                            <span>
                                <CalendarOutline />
                                Talk to Us
                            </span>
                        </NuxtLink>

                        <NuxtLink @click="globalClick(true)"
                            class="d-block d-sm-inline-block mb-1 mn-sm-0 btn btn-animated btn-purple-animated btn-sm"
                            href="/docs/getting-started">
                            <span>
                                <Flash />
                                Get Started
                            </span>
                        </NuxtLink>

                        <a @click="globalClick(true)" href="#"
                            class="d-block d-sm-none d-sm-inline-block mb-1 mn-sm-0 btn btn-info btn-sm"
                            id="header-search-button" data-bs-toggle="modal" data-bs-target="#search-modal">
                            <Magnify /> Search
                        </a>

                        <a @click="globalClick(true)" href="#" class="btn btn-sm d-none d-sm-inline-block icon-button"
                            data-bs-toggle="modal" data-bs-target="#search-modal" title="Search">
                            <Magnify />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup>
import Email from "vue-material-design-icons/Email.vue";
import FeatureSearch from "vue-material-design-icons/FeatureSearch.vue"
import Security from "vue-material-design-icons/Security.vue"
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
import Terraform from "vue-material-design-icons/Terraform.vue"
import Slack from "vue-material-design-icons/Slack.vue"
import Reload from "vue-material-design-icons/Reload.vue"
import Ballot from "vue-material-design-icons/Ballot.vue"
import AxisArrow from "vue-material-design-icons/AxisArrow.vue"
import ChartDonut from "vue-material-design-icons/ChartDonut.vue"
import BookOpenVariant from "vue-material-design-icons/BookOpenVariant.vue"
import Sync from "vue-material-design-icons/Sync.vue"
import BasketOutline from "vue-material-design-icons/BasketOutline.vue"
</script>

<script>
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
import GithubButton from "../layout/GithubButton.vue";

export default {
    components: {
        ChevronDown,
        GithubButton
    },
    data() {
        return {
            transparentHeader: false,
            transparentClass: false,
            isOpen: false,

        }
    },
    collapse: undefined,
    created() {
        const route = useRoute();
        this.transparentHeader = route.meta.transparentHeader === true;
        this.transparentClass = route.meta.transparentHeader === true;

        if (process.client) {
            window.addEventListener('scroll', this.handleScroll);
        }

        if (process.client) {
            this.collapse = new this.$bootstrap.Collapse('#main-header', {
                toggle: false
            })
        }

    },
    watch: {
        $route(to) {
            this.transparentHeader = to.meta.transparentHeader === true;
            this.transparentClass = to.meta.transparentHeader === true;
        }
    },
    mounted() {
        if (process.client) {
            document.documentElement.style.setProperty("--top-bar-height", this.$refs.navbar.offsetHeight + "px");
        }
    },
    unmounted() {
        if (process.client) {
            window.removeEventListener('scroll', this.handleScroll);
            document.documentElement.style.removeProperty("--top-bar-height");
        }
    },
    methods: {
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
        logoClick() {
            if (this.$route.path === "/") {
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
        background: $black-4;
        transition: all ease 0.2s;
        transform: translateY(0);
        max-height: 100%;
        @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
            & {
                -webkit-backdrop-filter: blur(calc($spacer * 0.625));
                backdrop-filter: blur(calc($spacer * 0.625));
                background-color: rgb(17 17 19 / 65%);
            }
        }

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

        a.nav-link, button.navbar-toggler, &.btn.search, .nav-item a {
            color: var(--gray-white, #FFF) !important;
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

                a.nav-link {
                    border-radius: $border-radius;

                    @include media-breakpoint-down(lg) {
                        padding-left: 1rem;
                    }

                    &:after {
                        display: none;
                    }

                        &.show, &:hover {
                            color: $purple-36 !important;
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
                        will-change: scaleY, top;
                        position: relative;
                        top: 0;
                    }

                    &.show .chevron-down-icon {
                        transform: scaleY(-1);
                        top: 4px;
                    }
                }


                    .dropdown-menu {
                        --bs-dropdown-link-hover-bg: $black-4;
                        --bs-dropdown-link-active-bg: $black-4;
                        padding: 1rem;
                        border-radius: $border-radius-lg;
                        border: 1px solid $black-6;
                        background: $black-2;

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

                        .material-design-icon {
                            color: $black-8;
                        }

                        p {
                            color: $black-8 !important;
                            font-size: 0.813rem;
                            font-weight: 300;
                            margin-bottom: 0;

                            span {
                                display: inline-block;
                                color: $white !important;
                                font-size: $font-size-sm;
                                font-weight: 600;
                            }

                            mark {
                                padding-left: 0;
                                padding-right: 0;
                            }
                        }

                        &:hover {
                            background-color: $black-3;

                            .material-design-icon, span, p {
                                color: $white !important;
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

                            >.material-design-icon__svg {
                                bottom: 0.125rem;
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
                &.icon-button {
                    font-size: 1.5rem;

                    &:hover {
                        color: $purple-36 !important;
                    }
                }
            }

            :deep(.btn) {
                font-weight: normal;
            }
        }
    }

    :deep(.github .btn) {
        font-weight: bold !important;
        font-size: 12px !important;
    }

        &:not(.transparent) {
            :deep(.github .btn-dark) {
                border-color: $black-5;
                background: $black-5;
                color: $white-6;
            }

            :deep(.github .btn-outline-dark) {
                border-color: $black-5;
                color: $white-6;
            }
        }

    .btn:hover {
        color: $purple-36;
    }

    &.transparent {
        background: transparent;
        box-shadow: none;

        a,
        a.nav-link,
        button.navbar-toggler,
        &.btn.search {
            color: var(--bs-white);
        }


        :deep(.github .btn-outline-dark) {
            color: var(--bs-white);
        }

        .navbar-collapse {
            ul.navbar-nav {
                li {
                    a.nav-link {

                        &.show,
                        &:hover {
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

            .navbar-collapse ul.navbar-nav li .dropdown-menu .dropdown-item {
                color: var(--bs-white);
                --bs-dropdown-link-hover-bg: #{rgba($gray-100, 5%)};
                --bs-dropdown-link-active-bg: #{rgba($gray-100, 5%)};

                &:hover {

                    .material-design-icon,
                    span {
                        color: var(--bs-white);
                    }
                }

                .material-design-icon,
                span {
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
}</style>

<style lang="scss">@import "../../assets/styles/variable";

.wrapper.announce {
    nav {
        top: 40px;
    }
}</style>

<!-- 8405FF -->