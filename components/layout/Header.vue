<template>
    <nav id="top-bar" ref="navbar" class="navbar navbar-expand-lg fixed-top" :class="{open: isOpen}">
        <div class="container-xl">
            <NuxtLink class="navbar-brand" href="/" @click="logoClick" @contextmenu.prevent="showDownloadLogosModal">
                <img src="/logo-white.svg" alt="Kestra, Open source declarative data orchestration" />
            </NuxtLink>

            <div class="download-logos-container" v-if="showDownloadLogos" @click="closeDownloadLogosModal">
                <div class="download-logos" @click.stop>
                    <NuxtImg
                        width="24px"
                        height="24px"
                        loading="lazy"
                        format="webp"
                        class="close-icon"
                        src="/landing/header-menu/window-close.svg"
                        alt="close"
                        @click="closeDownloadLogosModal"
                    />
                    <p class="title">Looking for our logo?</p>
                    <NuxtImg
                        width="236px"
                        height="123px"
                        loading="lazy"
                        format="webp"
                        class="img-fluid"
                        src="/landing/header-menu/download-logo.svg"
                        alt="Looking for our logo"
                    />
                    <a
                        download
                        class="btn btn-animated btn-purple-animated mt-2"
                        href="/kestra-logo-kit.zip"
                    >
                        Download Logo Pack
                    </a>
                </div>
            </div>


            <div class="nav-items d-flex align-items-center">
                <a @click="globalClick(true)" href="#" class="btn btn-sm  icon-button p-0 d-lg-none"
                   data-bs-toggle="modal" data-bs-target="#search-modal" title="Search">
                    <Magnify />
                </a>
                <button class="navbar-toggler d-flex d-lg-none align-items-center gap-2" @click="globalClick(isOpen)" type="button" aria-controls="main-header"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span class="menu-text">{{ isOpen ? "Close" : "Menu" }}</span>
                    <Segment v-if="!isOpen" />
                    <Close v-if="isOpen" />
                </button>
            </div>

            <div class="collapse navbar-collapse" id="main-header">
                <ul class="navbar-nav ms-auto me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown" @mouseover="mouseOver" @mouseleave="mouseOut">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Product
                            <ChevronDown />
                        </a>
                        <ul class="dropdown-menu product-menu">
                            <li class="dropdown-columns">
                                <ul class="dropdown-column list-unstyled">
                                    <p class="column-caption">Product</p>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/features" @click="globalClick(true)">
                                            <NoteSearchOutline />
                                            <p>
                                                <span>Open Source</span><br />
                                                Explore Kestra's Core Capabilities
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/enterprise" @click="globalClick(true)">
                                            <Security />
                                            <p>
                                                <span>Enterprise Edition</span><br />
                                                Security and Governance for Enterprise Needs
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/cloud" @click="globalClick(true)">
                                            <CloudOutline />
                                            <p>
                                                <span>Cloud Edition</span>
                                                <span class="tag">Private Alpha</span>
                                                <br />
                                                Register for the Cloud Edition
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/overview" @click="globalClick(true)">
                                            <RefreshAuto />
                                            <p>
                                                <span>Platform Overview</span><br />
                                                Orchestrate your business-critical applications and deliver business and analytics-ready data at scale
                                            </p>
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </li>
                            <li class="dropdown-menu-right">
                                <NuxtLink
                                    class="btn btn-animated btn-purple-animated text-start"
                                    href="/blueprints"
                                    @click="globalClick(true)"
                                >
                                    <p class="title">
                                        Start <br/>orchestrating your first workflows.
                                    </p>
                                    <span class="link">
                                        Quickstart Guide
                                        <ChevronRight class="d-none d-lg-inline-flex"/>
                                    </span>
                                </NuxtLink>
                                <ul class="p-0 list-unstyled">
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/features" @click="globalClick(true)">
                                            <NoteSearchOutline />
                                            <p>
                                                <span>Workflow components</span><br />
                                                Get to know the main orchestration components of a Kestra workflow
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/features" @click="globalClick(true)">
                                            <NoteSearchOutline />
                                            <p>
                                                <span>Videos tutorials</span><br />
                                                Get started with our video tutorials
                                            </p>
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li class="nav-item dropdown" @mouseover="mouseOver" @mouseleave="mouseOut">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Solutions
                            <ChevronDown />
                        </a>
                        <ul class="dropdown-menu solutions-menu mb-lg-3">
                            <li class="dropdown-columns">
                                <ul class="dropdown-column list-unstyled">
                                    <p class="column-caption">Features</p>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/features/declarative-data-orchestration"
                                                  @click="globalClick(true)">
                                            <CodeNotEqualVariant />
                                            <p>
                                                <span>Declarative Orchestration</span><br />
                                                Infrastructure as Code for All Your Workflows
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/features/scheduling-and-automation"
                                                  @click="globalClick(true)">
                                            <Sync />
                                            <p>
                                                <span>Automation Platform</span><br />
                                                Scheduling and Automation Made Easy
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/features/code-in-any-language"
                                                  @click="globalClick(true)">
                                            <CodeTags />
                                            <p>
                                                <span>Language Agnostic</span><br />
                                                Separate your Business Logic from Orchestration Logic
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/use-cases/terraform-provider"
                                                  @click="globalClick(true)">
                                            <RefreshAuto />
                                            <p>
                                                <span>Kestra's Terraform Provider</span><br />
                                                Deploy and manage all Kestra resources with Terraform
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/features/api-first" @click="globalClick(true)">
                                            <Earth />
                                            <p>
                                                <span>API-First</span><br />
                                                Learn more about Kestra’s API features
                                            </p>
                                        </NuxtLink>
                                    </li>
                                </ul>
                                <ul class="dropdown-column list-unstyled">
                                    <p class="column-caption">Use Cases</p>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/use-cases/data-engineers"
                                                  @click="globalClick(true)">
                                            <ChartBar />
                                            <p>
                                                <span>For Data Engineers</span><br />
                                                Orchestrate your Data Pipelines, Automate Processes, and Harness the Power of Your Data
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/use-cases/software-engineers"
                                                  @click="globalClick(true)">
                                            <Api />
                                            <p>
                                                <span>For Software Engineers</span><br />
                                                Boost Productivity, Simplify Processes, and Accelerate Microservice Deployment
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/use-cases/platform-engineers" @click="globalClick(true)">
                                            <ServerNetworkOutline/>
                                            <p>
                                                <span>For Platform Engineers</span><br/>
                                                Automate, Scale, Provision and Optimize Your Infrastructure
                                            </p>
                                        </NuxtLink>
                                    </li>
                                </ul>
                                <ul class="dropdown-column list-unstyled">
                                    <p class="column-caption">Industries</p>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/use-cases/retail"
                                                  @click="globalClick(true)">
                                            <BasketOutline />
                                            <p>
                                                <span>For Retail</span><br />
                                                Empowers retail businesses with an event-driven, language-agnostic orchestration platform that scales
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/use-cases/healthcare"
                                                  @click="globalClick(true)">
                                            <PillMultiple />
                                            <p>
                                                <span>For Healthcare</span><br />
                                                Streamline data processing, accelerate research, and enhance collaboration in healthcare
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/use-cases/automotive" @click="globalClick(true)">
                                            <CarHatchback/>
                                            <p>
                                            <span>For Automotive
                                            </span><br/>
                                                Ensure seamless operations and optimized performance across all processes.
                                            </p>
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </li>
                            <li class="dropdown-menu-right">
                                <NuxtLink
                                    class="btn btn-animated btn-purple-animated"
                                    href="/blueprints"
                                    @click="globalClick(true)"
                                >
                                    <div class="submenu-btn-img">
                                        <NuxtImg width="516" height="227" loading="lazy" format="webp" src="/landing/header-menu/platform-blueprints.png" alt="Platform blueprints" />
                                    </div>
                                    <p class="title">
                                        Explore blueprints
                                        to kick-start <br/>
                                        your next flow.
                                    </p>
                                    <span class="link">
                                        Explore
                                        <ChevronRight class="d-none d-lg-inline-flex"/>
                                    </span>
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
                    <li class="nav-item dropdown" @mouseover="mouseOver" @mouseleave="mouseOut">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                           aria-expanded="false">
                            Resources
                            <ChevronDown />
                        </a>
                        <ul class="dropdown-menu resources-menu">
                            <li class="dropdown-columns">
                                <ul class="dropdown-column list-unstyled">
                                    <p class="column-caption">Resources</p>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/blogs" @click="globalClick(true)">
                                            <PostOutline />
                                            <p>
                                                <span>Blog</span><br />
                                                Company news, product updates, and engineering deep dives
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/tutorial-videos" @click="globalClick(true)">
                                            <VideoOutline />
                                            <p>
                                                <span>Video Tutorials</span><br />
                                                Get started with our video tutorials
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/faq" @click="globalClick(true)">
                                            <CommentQuestionOutline />
                                            <p>
                                                <span>FAQ</span><br />
                                                FAQ about the product and the company
                                            </p>
                                        </NuxtLink>
                                    </li>
                                </ul>
                                <ul class="dropdown-column list-unstyled">
                                    <p class="column-caption">Discover</p>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/community" @click="globalClick(true)">
                                            <AccountGroupOutline />
                                            <p>
                                                <span>Community Overview</span><br />
                                                Ask any questions and share your feedback
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/partners" @click="globalClick(true)">
                                            <HandshakeOutline />
                                            <p>
                                                <span>Partners</span><br />
                                                Use our partner ecosystem to accelerate your Kestra adoption
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/use-cases/platform-engineers" @click="globalClick(true)">
                                            <HandshakeOutline />
                                            <p>
                                                <span>About Us</span><br/>
                                                Discover the team and values behind Kestra
                                            </p>
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </li>
                            <li class="dropdown-menu-right">
                                <NuxtLink
                                    class="btn btn-animated btn-purple-animated"
                                    href="/blueprints"
                                    @click="globalClick(true)"
                                >
                                    <div class="submenu-btn-img">
                                        <NuxtImg width="516" height="227" loading="lazy" format="webp" src="/landing/header-menu/resources-menu.png" alt="Using Declarative Data" />
                                    </div>
                                    <p class="text-title">
                                        Gorgias,<br/>
                                        Using Declarative
                                        Data Engineering
                                        Orchestration<br/>
                                        With Kestra
                                    </p>
                                    <h2 class="detail-text">
                                        20 000+
                                    </h2>
                                    <span class="detail-desc">
                                        Executions per month
                                    </span>
                                </NuxtLink>
                                <ul class="p-0 list-unstyled">
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/use-cases/stories" @click="globalClick(true)">
                                            <BookOpenVariant />
                                            <p>
                                                <span>Customers Stories</span><br />
                                                Learn how Enterprises orchestrate their business-critical workflows
                                            </p>
                                        </NuxtLink>
                                    </li>
                                </ul>
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

                <ul class="navbar-nav mb-2 mb-lg-0 nav-button nav-footer">
                    <li class="nav-item">
                        <GithubButton :small="true" />

                        <NuxtLink @click="globalClick(true)"
                                  class="d-none mb-1 mn-sm-0 btn btn-sm me-0 me-sm-2 d-lg-inline-block talk-us"
                                  href="/demo">
                            <span>
                                <CalendarOutline class="d-none d-xl-inline-flex"/>
                                Talk to Us
                            </span>
                        </NuxtLink>

                        <NuxtLink @click="globalClick(true)"
                            class="d-block d-sm-inline-block mb-1 mn-sm-0 btn btn-animated btn-purple-animated btn-sm get-started"
                            href="/docs/getting-started/quickstart#start-kestra">
                            <span>
                                <Flash class="d-none d-xl-inline-flex"/>
                                Get Started
                            </span>
                        </NuxtLink>

                        <NuxtLink @click="globalClick(true)"
                                  class="d-lg-none d-sm-inline-block d-xs-block mb-1 mn-sm-0 btn btn-animated btn-dark-animated btn-md"
                                  href="/demo">
                            <span>
                                <CalendarOutline />
                                Talk to Us
                            </span>
                        </NuxtLink>

                        <a @click="globalClick(true)" href="#" id="header-search-button" class="btn btn-sm d-none d-lg-inline-block icon-button"
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
import NoteSearchOutline from "vue-material-design-icons/NoteSearchOutline.vue"
import ViewDashboardOutline from "vue-material-design-icons/ViewDashboardOutline.vue"
import Security from "vue-material-design-icons/Security.vue"
import CloudOutline from "vue-material-design-icons/CloudOutline.vue"
import AccountGroupOutline from "vue-material-design-icons/AccountGroupOutline.vue"
import CommentQuestionOutline from "vue-material-design-icons/CommentQuestionOutline.vue"
import PostOutline from "vue-material-design-icons/PostOutline.vue"
import VideoOutline from "vue-material-design-icons/VideoOutline.vue"
import HandshakeOutline from "vue-material-design-icons/HandshakeOutline.vue"
import AccountStarOutline from "vue-material-design-icons/AccountStarOutline.vue"
import Segment from "vue-material-design-icons/Segment.vue"
import Close from "vue-material-design-icons/Close.vue"
import Magnify from "vue-material-design-icons/Magnify.vue"
import Flash from "vue-material-design-icons/Flash.vue"
import Domain from "vue-material-design-icons/Domain.vue"
import CalendarOutline from "vue-material-design-icons/CalendarOutline.vue"
import CodeNotEqualVariant from "vue-material-design-icons/CodeNotEqualVariant.vue"
import ArrowRight from "vue-material-design-icons/ArrowRight.vue";
import ServerNetworkOutline from "vue-material-design-icons/ServerNetworkOutline.vue"
import Slack from "vue-material-design-icons/Slack.vue"
import Graph from "vue-material-design-icons/Graph.vue"
import Ballot from "vue-material-design-icons/Ballot.vue"
import ChartBar from "vue-material-design-icons/ChartBar.vue"
import ChartDonut from "vue-material-design-icons/ChartDonut.vue"
import BookOpenVariant from "vue-material-design-icons/BookOpenVariant.vue"
import Sync from "vue-material-design-icons/Sync.vue"
import BasketOutline from "vue-material-design-icons/BasketOutline.vue"
import BankOutline from "vue-material-design-icons/BankOutline.vue"
import PillMultiple from "vue-material-design-icons/PillMultiple.vue"
import Translate from "vue-material-design-icons/Translate.vue"
import Earth from "vue-material-design-icons/Earth.vue"
import CodeTags from "vue-material-design-icons/CodeTags.vue"
import Api from "vue-material-design-icons/Api.vue"
import CarHatchback from "vue-material-design-icons/CarHatchback.vue"
import RefreshAuto from "vue-material-design-icons/RefreshAuto.vue"
</script>

<script>
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
import ChevronRight from "vue-material-design-icons/ChevronRight.vue";
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
            showDownloadLogos: false,
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
          if (window.innerWidth > 991) {
            let element = this.mouseElement(event.target);

            element.classList.add('show');
            element.nextElementSibling.classList.add('show');
          }
        },
        mouseOut(event) {
          if (window.innerWidth > 991) {
            let element = this.mouseElement(event.target);

            element.classList.remove('show');
            element.nextElementSibling.classList.remove('show');
          }
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
          if (window.innerWidth < 992) {
            this.collapse.toggle();
          }
          if (close) {
                if (this.$refs.navbar.classList.contains("open")) {
                    this.isOpen = false;
                    document.body.style.overflow = 'unset';
                    document.body.style.position = 'unset';
                    document.body.style.width = 'unset';
                }
                const element = document.querySelector('.nav-link.show');
                if (element) {
                  element.classList.remove('show');
                  element.nextElementSibling.classList.remove('show');
                }
            } else {
              document.body.style.overflow = 'hidden';
              document.body.style.position = 'fixed';
              document.body.style.width = '100%';
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
        },
        showDownloadLogosModal(event) {
          event.preventDefault();
          this.showDownloadLogos = true;
        },
        closeDownloadLogosModal() {
          this.showDownloadLogos = false;
        },
    },
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/variable";

    ::deep(body) {
        @include media-breakpoint-down(lg) {
            overflow: hidden !important;
        }
    }

    .download-logos-container {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100vh;
        z-index: 4;
        .download-logos {
            position: fixed;
            top: 100%;
            left: 14%;
            border-radius: calc($border-radius-lg * 2);
            border: 1px solid $black-6;
            display: flex;
            flex-direction: column;
            gap: $spacer;
            padding: calc($spacer * 2);
            background-color: rgba(45, 45, 46, 0.93);
            transition-duration: 1s;
            z-index: 5;

            @include media-breakpoint-down(lg) {
                left: 5%;
                top: 110%;
            }

            p.title {
                font-size: 16px;
                font-weight: 400;
                line-height: 24px;
                color: $white;
            }

            .close-icon {
                position: absolute;
                top: 1rem;
                right: 1rem;
                cursor: pointer;
            }
        }
    }

    .container-xl {
        @include media-breakpoint-down(xl) {
            .navbar-brand {
                margin-left: 0;
                margin-right: 0;
            }
        }
    }

    .container-xl {
        @include media-breakpoint-down(lg) {
            padding-left: 0;
            padding-right: 0;
            padding-top: calc($spacer / 2);

            .navbar-brand {
                margin: 0 0 calc($spacer * 0.75) $spacer;
            }

            .nav-items {
                margin: 0 $spacer calc($spacer * 0.75) 0;

                span.menu-text {
                    margin-top: calc($spacer * 0.2);
                }
            }
        }
    }
    nav {
        background: $black-4;
        transform: translateY(0);
        max-height: 100%;
        width: 100vw;
        background: transparent;

        @include media-breakpoint-down(lg) {
            padding: 0;
            padding-top: 0;
            background-color: $black-9;
        }

        &::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
                & {
                    -webkit-backdrop-filter: $menu-backdrop-filter;
                    backdrop-filter: $menu-backdrop-filter;
                    background-color: $menu-bg;
                    @include media-breakpoint-down(lg) {
                        content: none;
                    }
                }
            }
        }

        .navbar-brand {
            img {
                height: 100%;
                width: 180px;
                @include media-breakpoint-down(xl) {
                    width: 150px;
                }
                @include media-breakpoint-down(lg) {
                    width: 110px;
                }
            }

        }

        a.nav-link, button.navbar-toggler, &.btn.search, .nav-item a, div.nav-items a {
            color: var(--gray-white, #FFF) !important;
            box-shadow: none !important;
        }

        a.talk-us {
            border:1px solid $black-6;
            background-color: $black-4;

            &:hover {
                background-color: $black-6;
            }
        }

        div.nav-items {
            a {
                margin-top: calc($spacer * 0.4);
            }
            a, button {
                :deep(.material-design-icon) {
                    width: calc($spacer * 1.5);
                    height: calc($spacer * 1.5);
                    .material-design-icon__svg {
                        width: calc($spacer * 1.5);
                        height: calc($spacer * 1.5);
                    }
                }
            }
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
            max-height: calc(100vh + 4.1rem);
            overflow-y: auto;
            overflow-x: hidden;
            background-color: $black-2;
            height: calc(100vh - 3.3rem);
        }

        ul.navbar-nav {
            li {
                position: unset;
                a.dropdown-item {
                    white-space: unset;
                }

                @include media-breakpoint-between(lg, xxl) {
                    font-size: 1rem;
                }

                &:last-child {
                    @include media-breakpoint-down(lg) {
                        border-bottom: 1px solid $black-6;
                    }
                }

                a.nav-link {
                    border-radius: $border-radius;

                    @include media-breakpoint-down(lg) {
                        padding: calc($spacer * 1.5) 2rem;
                        display: flex;
                        justify-content: space-between;
                        border-radius: 0;
                        background-color: $black-9;
                        border-top: 1px solid $black-6;
                    }

                    &:after {
                        display: none;
                    }

                    &.show, &:hover {
                        @include media-breakpoint-up(lg) {
                            color: #CDD5EF !important;
                        }
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

                @include media-breakpoint-down(lg) {
                    .dropdown-toggle {
                        border-radius: 0;
                        background-color: $black-9;
                        border-top: 1px solid $black-6;

                        &.show {
                            background-color: $black-2;
                        }
                    }
                }

                .dropdown-menu.show {
                    @include media-breakpoint-up(lg) {
                        display: flex !important;
                        justify-content: end;
                    }

                    @include media-breakpoint-down(lg) {
                        display: block;
                        border-radius: 0;
                        background-color: $black-2;
                    }
                }

                .dropdown-menu {
                    --bs-dropdown-link-hover-bg: $black-4;
                    --bs-dropdown-link-active-bg: $black-4;
                    padding: 0;
                    border: 1px solid $black-6;
                    background-color: $menu-dropdown-bg;
                    left: 0;
                    width: 100vw;
                    margin-top: 0;
                    border-radius: 0;
                    .dropdown-columns {
                        display: flex;
                        padding: 62px 192px 32px 172px;
                        gap: 6.25rem;
                        @include media-breakpoint-down(xxl) {
                            padding: 62px 32px 32px 32px;
                            gap: 3rem;
                        }
                    }

                    @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
                        & {
                            -webkit-backdrop-filter: $menu-backdrop-filter;
                            backdrop-filter: $menu-backdrop-filter;
                        }
                    }

                    @include media-breakpoint-down(lg) {
                        width: 100% !important;
                        box-shadow: none;
                        border: 0;
                        padding: 0 $spacer $spacer !important;
                        display: none;

                        li {
                            background-color: $black-3;
                            border-radius: calc($spacer * 0.25);
                            border: 0 !important;

                            a.dropdown-item {
                                white-space: unset;
                            }

                            .material-design-icon, span, p {
                                color: $white !important;
                            }
                        }
                    }

                    animation-duration: 0.2s;
                    animation-fill-mode: forwards;
                    animation-name: slide-in;

                    .dropdown-item {
                        padding: calc($spacer * 0.875) calc($spacer * 0.75);
                        margin-bottom: calc($spacer / 2);
                        align-items: flex-start;
                        border-radius: 4px;

                        &:not(:last-child) {
                            margin-bottom: calc($spacer / 4);
                        }

                        &:last-child {
                            margin-bottom: 0;
                        }

                        .material-design-icon {
                            color: $purple-37;
                            align-self: unset;
                        }

                        p {
                            color: $white-1 !important;
                            font-size: $font-size-sm;
                            font-weight: 400;
                            margin-bottom: 0;
                            line-height: $spacer;
                            margin-top: 3px;
                            span {
                                display: inline-block;
                                color: $white !important;
                                font-size: $font-size-md;
                                font-weight: 700;
                                line-height: calc($spacer * 1.37);

                            }

                            .tag {
                                border-radius: calc($spacer * 0.25);
                                color: $white;
                                background-color: #5A3ABC;
                                padding: 0 calc($spacer * 0.25);
                                margin-left: calc($spacer * 0.75);
                                font-size: $font-size-xs;
                                line-height: 1.5rem;
                                margin-bottom: calc($spacer * 0.25);
                            }

                            mark {
                                padding-left: 0;
                                padding-right: 0;
                            }
                        }

                        &:hover {
                            background-color: $black-2;

                            .material-design-icon, p {
                                color: $white-1 !important;
                            }

                            .material-design-icon, span {
                                color: $purple-35 !important;
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

                .product-menu {
                    @include media-breakpoint-down(lg) {
                        width: 100% !important;
                    }
                }

                .product-menu,
                .resources-menu {
                    align-items: flex-start;
                    gap: $spacer;


                    .submenu-item {
                        border-radius: calc($spacer * 0.5);
                        padding: calc($spacer * 0.25) $spacer;
                        background-color: $black-3;
                        position: relative;
                        overflow: hidden;
                        z-index: 1;
                        min-width: calc($spacer * 15.5);
                        pointer-events: none;


                        &:hover {
                            background: $black-6 !important;
                        }

                        &::before {
                            content: "";
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            background: url("/landing/header-menu/platform-overview-bg.svg");
                            transform: rotateX(180deg);
                            top: 0;
                            left: 0;
                        }

                        .dropdown-item {
                            padding: 0;
                            white-space: unset;
                            pointer-events: auto !important;
                            display: flex;
                            flex-direction: column;
                            gap: calc($spacer * 2.7);
                            position: relative;
                            z-index: 1;

                            .material-design-icon, span, p {
                                color: $white !important;
                            }
                            &:hover {
                                background-color: transparent;
                            }
                        }

                        @include media-breakpoint-down(lg) {
                            border-radius: calc($spacer * 0.25);
                            .dropdown-item {
                                white-space: unset;
                            }
                        }
                        li {
                            .submenu-img {
                                padding: calc($spacer * 1.8) calc($spacer * 0.4);
                                min-height: 113px;
                                min-width: 100%;
                                position: relative;

                                p {
                                    font-size: $spacer;
                                    font-style: italic;
                                    font-weight: 800;
                                    color: $white;
                                }

                                img {
                                    position: absolute;
                                    left: 8%;
                                }
                            }


                        }
                    }

                    .submenu-btn {
                        height: 5.375rem !important;
                        display: flex !important;
                        align-items: center;
                        justify-content: flex-end;
                        position: relative;
                        padding: 0 !important;
                        padding-right: $spacer !important;
                        border-radius: calc($spacer * 0.5);
                        .submenu-btn-img {
                            position: absolute;
                            left: -4.25rem;
                            top: -1rem;
                        }

                        p {
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            margin: 0;

                            span.material-design-icon {
                                width: 1.875rem !important;
                                height: 1.875rem !important;
                                display: block !important;
                                :deep(.material-design-icon__svg) {
                                    width: 1.875rem !important;
                                    height: 1.875rem !important;
                                    bottom: 0 !important;
                                }
                            }

                            span.title {
                                font-weight: 600;
                                font-size: $font-size-base;
                            }
                        }
                    }
                }

                .resources-menu {
                    .submenu-btn {

                        @include media-breakpoint-up(sm) {
                            padding-right: calc($spacer * 3.158) !important;
                        }

                        .submenu-btn-img {
                            left: 1.265rem !important;
                            top: -1.938rem;

                            @include media-breakpoint-down(sm) {
                                left: -7.265rem !important;
                            }
                        }
                    }
                }

                .solutions-menu {
                    max-height: 642px;
                    .dropdown-menu-right {
                        background: #252526;
                        min-width: 23%;
                        padding: 120px 67px;
                        a.btn-animated {

                        }
                        a {
                            max-width: 312px;
                            text-align: left;
                            padding: 47px 26px 40px 28px;
                            .submenu-btn-img {
                                margin-bottom: 25px;
                                img {
                                    width: 100%;
                                    height: auto;
                                }
                            }

                            p.title {
                                font-size: 27px;
                                font-weight: 500;
                                line-height: 34.6px;
                                color: #FFFFFF;
                            }

                            span.link {
                                font-size: 14px;
                                color: #CDD5EF;
                                vertical-align: middle;
                                span {
                                    font-size: 16px;
                                }
                            }
                        }

                    }
                }

                .product-menu {
                    max-height: 564px;
                    .dropdown-column {
                        max-width: 338px;
                    }
                    .dropdown-menu-right {
                        background: #252526;
                        min-width: 23%;
                        padding: 59px 32px;
                        height: 100%;
                        flex: 0.7;
                        li {
                            margin-top: 2.25rem;
                        }
                        a {
                            max-width: 312px;
                        }
                        a.btn {
                            padding: 2.19rem;
                            text-align: start;
                            .submenu-btn-img {
                                img {
                                    width: 100%;
                                    height: auto;
                                }

                            }
                            p.title {
                                font-size: 27px;
                                font-weight: 500;
                                line-height: 34.6px;
                                color: #FFFFFF;
                            }

                            p.text-title {
                                font-size: 26px;
                                font-weight: 600;
                                line-height: 27.6px;
                                color: #FFFFFF;
                                margin-bottom: 28px;
                            }

                            h2.detail-text {
                                font-size: 47px;
                                font-weight: 800;
                                line-height: 25.6px;
                            }

                            span.detail-desc {
                                font-size: 15px;
                                font-weight: 400;
                                line-height: 25.6px;
                                color: #FFFFFF99;
                            }

                            span.link {
                                font-size: 14px;
                                color: #CDD5EF;
                                vertical-align: middle;
                                span {
                                    font-size: 16px;
                                }
                            }
                        }

                    }
                }

                .resources-menu, .solutions-menu, .product-menu {
                    gap: 1rem;

                    .dropdown-column {
                        display: flex;
                        max-width: calc($spacer * 18);
                        flex-direction: column;
                        gap: $spacer;

                        @include media-breakpoint-down(lg) {
                            margin-bottom: calc($spacer * 2);
                            &:last-child {
                                margin-bottom: 0;
                            }
                        }

                        .dropdown-item {
                            white-space: unset;
                        }

                        .column-caption {
                            font-size: $font-size-xs;
                            font-weight: 600;
                            color: $white-3;
                            text-transform: uppercase;
                            letter-spacing: 1.4px;
                            margin: 0;
                            border-bottom: 1px solid #3D3D3F;
                            padding-bottom: 10px;
                        }
                    }
                }

                .resources-menu {
                    max-height: 582px;
                    .dropdown-menu-right {
                        background: #252526;
                        min-width: 39%;
                        @include media-breakpoint-down(xxl) {
                            min-width: 30%;
                        }
                        padding: 40px 32px;
                        height: 100%;
                        flex: 0.7;
                        li {
                            margin-top: 2.25rem;
                        }
                        a {
                            max-width: 312px;
                            max-height: 370px;
                        }
                        a.btn {
                            padding: 2.19rem;
                            text-align: start;
                            .submenu-btn-img {
                                img {
                                    width: 100%;
                                    height: auto;
                                }

                            }
                            p.title {
                                font-size: 27px;
                                font-weight: 500;
                                line-height: 34.6px;
                                color: #FFFFFF;
                            }

                            p.text-title {
                                font-size: 26px;
                                font-weight: 600;
                                line-height: 27.6px;
                                color: #FFFFFF;
                                margin-bottom: 28px;
                            }

                            h2.detail-text {
                                font-size: 47px;
                                font-weight: 800;
                                line-height: 25.6px;
                            }

                            span.detail-desc {
                                font-size: 15px;
                                font-weight: 400;
                                line-height: 25.6px;
                                color: #FFFFFF99;
                            }

                            span.link {
                                font-size: 14px;
                                color: #CDD5EF;
                                vertical-align: middle;
                                span {
                                    font-size: 16px;
                                }
                            }
                        }

                    }
                    .submenu-item {
                        min-height: 16rem;

                        .dropdown-item {
                            gap: calc($spacer * 5.5);

                            .submenu-img {
                                p {
                                    margin-bottom: calc($spacer * 0.7);
                                }
                            }
                        }
                    }
                    .aside-menu {
                        gap: $spacer;

                        li > a {
                            padding: calc($spacer * 0.5) $spacer;
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

    .nav-footer {
        @include media-breakpoint-down(lg) {
            display: flex;
            width: 100%;
            padding: 2rem 2rem 30%;

            li {
                display: flex;
                justify-content: space-around;
                align-items: center;
                border: 0 !important;
            }

            .get-started {
                padding: calc($spacer * 0.6) $spacer !important;
            }
        }
        @include media-breakpoint-down(md) {


            li {
                flex-direction: column-reverse;
                gap: $spacer;
                align-items: center;

                a {
                    width: 100%;
                }
            }
        }
    }

    :deep(.github .btn) {
        font-weight: bold !important;
        font-size: 12px !important;
    }

        &:not(.transparent) {
            :deep(.github) {
                background: #333336;

                &:hover {
                    .btn-dark {
                        background: #18181B !important;
                    }

                    .btn-outline-dark {
                        background: #333336 !important;
                    }
                }
            }
            :deep(.github .btn-dark) {
                color: $white-6;
            }

            :deep(.github .btn-outline-dark) {
                background: #18181B;
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
}

</style>

<style lang="scss">@import "../../assets/styles/variable";

.wrapper.announce {
    nav {
        top: 3rem;
    }
}
</style>
