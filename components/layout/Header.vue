<template>
    <nav id="top-bar" ref="navbar" class="navbar navbar-expand-lg fixed-top" :class="{open: isOpen, scrolled: scrolled }">
        <div class="container-xl">
            <NuxtLink class="navbar-brand" href="/" @click="logoClick" @contextmenu.prevent="showDownloadLogosModal">
                <img :src="isOpen ? '/Logo_Kestra.svg' : '/logo-white.svg'" alt="Kestra, Open source declarative data orchestration" />
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
                    <li class="nav-item dropdown" @mouseover="mouseOver('product')" @mouseleave="mouseOut('product')">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                           aria-expanded="false">
                            Product
                            <ChevronDown class="d-inline-block d-lg-none" />
                        </a>
                        <ul class="dropdown-menu d-lg-none">
                            <div class="d-flex flex-column w-100 py-lg-0">
                                <li>
                                    <NuxtLink class="dropdown-item" href="/features" @click="globalClick(true)">
                                        <NoteSearchOutline />
                                        <p>
                                            <span>Open Source</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/enterprise" @click="globalClick(true)">
                                        <Security />
                                        <p>
                                            <span>Enterprise Edition</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/cloud" @click="globalClick(true)">
                                        <CloudOutline />
                                        <p>
                                            <span>Cloud Edition</span>
                                            <strong class="tag">Early Adopter</strong>
                                        </p>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/overview" @click="globalClick(true)">
                                        <RefreshAuto />
                                        <p>
                                            <span>Platform Overview</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                            </div>
                        </ul>
                    </li>
                    <li class="nav-item dropdown" @mouseover="mouseOver('solutions')" @mouseleave="mouseOut('solutions')">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                           aria-expanded="false">
                            Solutions
                            <ChevronDown class="d-inline-block d-lg-none" />
                        </a>
                        <div class="dropdown-menu pb-1 d-lg-none">
                            <ul class="dropdown-column">
                                <p class="column-caption">Features</p>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/features/declarative-data-orchestration"
                                              @click="globalClick(true)">
                                        <CodeNotEqualVariant />
                                        <p>
                                            <span>Declarative Orchestration</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/features/scheduling-and-automation"
                                              @click="globalClick(true)">
                                        <Sync />
                                        <p>
                                            <span>Automation Platform</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/features/code-in-any-language"
                                              @click="globalClick(true)">
                                        <CodeTags />
                                        <p>
                                            <span>Language Agnostic</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/terraform-provider"
                                              @click="globalClick(true)">
                                        <RefreshAuto />
                                        <p>
                                            <span>Kestra's Terraform Provider</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/features/api-first" @click="globalClick(true)">
                                        <Earth />
                                        <p>
                                            <span>API-First</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <p class="column-caption">Use Cases</p>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/data-engineers"
                                              @click="globalClick(true)">
                                        <ChartBar />
                                        <p>
                                            <span>For Data Engineers</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/software-engineers"
                                              @click="globalClick(true)">
                                        <Api />
                                        <p>
                                            <span>For Software Engineers</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/platform-engineers" @click="globalClick(true)">
                                        <ServerNetworkOutline/>
                                        <p>
                                            <span>For Platform Engineers</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <p class="column-caption">Industries</p>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/retail"
                                              @click="globalClick(true)">
                                        <BasketOutline />
                                        <p>
                                            <span>For Retail</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/healthcare"
                                              @click="globalClick(true)">
                                        <PillMultiple />
                                        <p>
                                            <span>For Healthcare</span>
                                        </p>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/automotive" @click="globalClick(true)">
                                        <CarHatchback/>
                                        <p>
                                            <span>For Automotive
                                            </span>
                                        </p>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item dropdown" @mouseover="mouseOver('resources')" @mouseleave="mouseOut('resources')">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                           aria-expanded="false">
                            Resources
                            <ChevronDown class="d-inline-block d-lg-none" />
                        </a>
                        <div class="dropdown-menu pb-1 d-lg-none">
                            <ul class="dropdown-column">
                                <p class="column-caption">RESOURCES</p>
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
                                        <MessageQuestionOutline />
                                        <p>
                                            <span>FAQ</span><br />
                                            FAQ about the product and the company
                                        </p>
                                    </NuxtLink>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <p class="column-caption">DISCOVER</p>
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
                                    <NuxtLink class="dropdown-item" href="/about-us" @click="globalClick(true)">
                                        <HandshakeOutline />
                                        <p>
                                            <span>About Us</span><br />
                                            Discover the team and values behind Kestra
                                        </p>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
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
                        <NuxtLink class="nav-link" href="/blueprints" role="button" @click="globalClick(true)">
                            <span>
                                Blueprints
                            </span>
                        </NuxtLink>
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
                                Talk to us
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

        <div class="d-lg-block d-none menu-container" :style="{ opacity: showMenu || mouseoverMenu ? 100 : 0 }">
            <div class="header-arrow" :style="{ transform: `translateY(12px) translateX(${headerArrowTranslateX}px) rotate(45deg)` }"></div>
            <div class="menu-shadow-container">
                <div
                    class="header-menu"
                    @mouseover="mouseOverMenu()"
                    :style="{
                        transform: `translateX(${headerMenuTranslateX}) rotateX(-15deg)`,
                        width: headerMenuSize.width,
                        height: headerMenuSize.height,
                        pointerEvents: headerMenuPointerEvents,
                    }"
                >
                    <div
                        class="header-menu-card"
                    >
                        <div @mouseleave="mouseLiveMenu()" id="product" class="header-menu-card-section">
                            <div class="header-menu-left">
                                <div class="header-menu-card-section-column">
                                    <ul class="d-flex flex-column w-100 gap-3 py-lg-0 py-1">
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/features" @click="globalClick(true)">
                                                <NoteSearchOutline />
                                                <p>
                                                    <span>Core Features</span><br />
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
                                                    <strong class="tag">Early Access</strong>
                                                    <br />
                                                    Register for the Cloud Edition
                                                </p>
                                            </NuxtLink>
                                        </li>
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/overview" @click="globalClick(true)">
                                                <RefreshAuto />
                                                <p>
                                                    <span>Preview Access</span><br />
                                                    Live Access in Read-Only
                                                </p>
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div @mouseleave="mouseLiveMenu()" id="solutions" class="header-menu-card-section">
                            <div class="row m-0 w-100 flex-nowrap">
                                <div class="header-menu-left col-12 col-xl">
                                    <div class="header-menu-card-section-column col-lg-6">
                                        <div class="menu-title">
                                            <p>Capabilities</p>
                                        </div>
                                        <ul>
                                            <li>
                                                <NuxtLink class="dropdown-item"
                                                    href="/features/declarative-data-orchestration"
                                                    @click="globalClick(true)">
                                                    <CodeNotEqualVariant />
                                                    <p>
                                                        <span>Declarative Orchestration</span><br />
                                                        Infrastructure as Code for All Your Workflows
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item"
                                                    href="/features/scheduling-and-automation"
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
                                                <NuxtLink class="dropdown-item" href="/features/api-first"
                                                    @click="globalClick(true)">
                                                    <Earth />
                                                    <p>
                                                        <span>API-First</span><br />
                                                        Learn more about Kestra’s API features
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="header-menu-card-section-column col-lg-6">
                                        <div class="menu-title">
                                            <p>By Roles</p>
                                        </div>
                                        <ul>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/data-engineers"
                                                    @click="globalClick(true)">
                                                    <ChartBar />
                                                    <p>
                                                        <span>Data Engineers</span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/software-engineers"
                                                    @click="globalClick(true)">
                                                    <Api />
                                                    <p>
                                                        <span>Software Engineers</span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/platform-engineers"
                                                    @click="globalClick(true)">
                                                    <ServerNetworkOutline />
                                                    <p>
                                                        <span>Platform Engineers</span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                        <div class="menu-title">
                                            <p>By Industries</p>
                                        </div>
                                        <ul>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/retail"
                                                    @click="globalClick(true)">
                                                    <BasketOutline />
                                                    <p>
                                                        <span>Retail & Supply Chain</span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/healthcare"
                                                    @click="globalClick(true)">
                                                    <PillMultiple />
                                                    <p>
                                                        <span>Healthcare & Pharmaceuticals</span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/automotive"
                                                    @click="globalClick(true)">
                                                    <CarHatchback />
                                                    <p>
                                                        <span>Automotive & Heavy Equipment
                                                        </span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/docs/use-cases"
                                                    @click="globalClick(true)">
                                                    <ArrowRight />
                                                    <p>
                                                        <span>All use-cases
                                                        </span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="header-menu-card-section-column col-lg-6">
                                        <div class="menu-title">
                                            <p>Resources</p>
                                        </div>
                                        <ul>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/about-us"
                                                    @click="globalClick(true)">
                                                    <HandshakeOutline />
                                                    <p>
                                                        <span>About Us</span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/partners"
                                                    @click="globalClick(true)">
                                                    <HandshakeOutline />
                                                    <p>
                                                        <span>Partner</span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/faq" @click="globalClick(true)">
                                                    <MessageQuestionOutline />
                                                    <p>
                                                        <span>FAQ</span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/community"
                                                    @click="globalClick(true)">
                                                    <AccountGroupOutline />
                                                    <p>
                                                        <span>Community Overview</span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/blogs/community"
                                                    @click="globalClick(true)">
                                                    <AccountGroupOutline />
                                                    <p>
                                                        <span>Community Contents</span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/stories"
                                                    @click="globalClick(true)">
                                                    <MessageQuestionOutline />
                                                    <p>
                                                        <span>Customer Stories</span>
                                                    </p>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div @mouseleave="mouseLiveMenu()" id="resources" class="header-menu-card-section">
                            <div class="header-menu-left">
                                <div class="header-menu-card-section-column">
                                    <ul>
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/docs" @click="globalClick(true)">
                                                <PostOutline />
                                                <p>
                                                    <span>Docs</span><br />
                                                    Everything Kestra
                                                </p>
                                            </NuxtLink>
                                        </li>
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
                                            <NuxtLink class="dropdown-item" href="/blueprints"
                                                @click="globalClick(true)">
                                                <PostOutline />
                                                <p>
                                                    <span>Blueprints</span><br />
                                                    A Library of ready to use Workflows.
                                                </p>
                                            </NuxtLink>
                                        </li>
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/tutorial-videos"
                                                @click="globalClick(true)">
                                                <VideoOutline />
                                                <p>
                                                    <span>Video Tutorials</span><br />
                                                    your favourite tutorials in video.
                                                </p>
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                                <div class="header-menu-card-section-column">
                                    <ul>
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/docs/how-to-guides"
                                                @click="globalClick(true)">
                                                <MessageQuestionOutline />
                                                <p>
                                                    <span>How to guides</span><br />
                                                    Learn step by step how to address use-cases.
                                                </p>
                                            </NuxtLink>
                                        </li>
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/docs/why-kestra"
                                                @click="globalClick(true)">
                                                <HandshakeOutline />
                                                <p>
                                                    <span>Why kestra</span><br />
                                                    Trust kestra as your unified orchestration tool.
                                                </p>
                                            </NuxtLink>
                                        </li>
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/docs/installation"
                                                @click="globalClick(true)">
                                                <HandshakeOutline />
                                                <p>
                                                    <span>Quick start installation guide.</span><br />
                                                    Trust kestra as your unified orchestration tool.
                                                </p>
                                            </NuxtLink>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
import MessageQuestionOutline from "vue-material-design-icons/MessageQuestionOutline.vue"
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
import TimelineTextOutline from "vue-material-design-icons/TimelineTextOutline.vue"
import BookOpenVariantOutline from "vue-material-design-icons/BookOpenVariantOutline.vue"
</script>

<script>
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
import ChevronRight from "vue-material-design-icons/ChevronRight.vue";
import GithubButton from "../layout/GithubButton.vue";
import {menuSize} from "~/utils/menu-sizes.js";
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
            showMenu: false,
            showMenuId: null,
            headerArrowTranslateX: 0,
            headerMenuTranslateX: '50vw',
            mouseoverMenu: false,
            headerMenuSize: {
              width: 0,
              height: 0,
            },
            headerMenuPointerEvents: 'none',
        }
    },
    props: {
      scrolled: {
        type: Boolean,
        required: true
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
            // on route change always close the menu
            this.globalClick(true)
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
        mouseOverMenu() {
          this.mouseoverMenu = true
          this.headerMenuPointerEvents = 'auto'
        },
        mouseLiveMenu() {
          this.showMenu = false
          this.mouseoverMenu = false
          this.showMenuId = null
          this.headerMenuPointerEvents = 'none'
        },
        mouseElement(element) {
            if (element.classList.contains("nav-link")) {
                return element;
            } else {
                return element.closest(".nav-item").firstElementChild;
            }
        },
        mouseOver(id) {
          if (window.innerWidth > 991) {
            document.querySelectorAll('.header-menu-card-section').forEach(obj=>{
              obj.classList.remove("opacity-100")
              obj.classList.remove("z-1")
            });
            let menu = document.getElementById(id);
            if (menu) {
              this.mouseoverMenu = false
              this.showMenu = true
              this.showMenuId = id
              this.headerMenuSize = menuSize(id, window.innerWidth).size;
              this.headerMenuTranslateX = menuSize(id, window.innerWidth).headerMenuTranslateX;
              this.headerArrowTranslateX = menuSize(id, window.innerWidth).headerArrowTranslateX;
              menu.classList.add('z-1');
              menu.classList.add('opacity-100');
              this.headerMenuPointerEvents = 'auto'
            }
          }
        },
        mouseOut(id) {
          if (window.innerWidth > 991) {
            let menu = document.getElementById(id);
            if (menu) {
              this.headerMenuPointerEvents = 'none'
              this.showMenu = false
            }
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
            if(close === true){
                this.collapse.hide();
                this.isOpen = false;
            } else if (close === false){
                this.collapse.show()
                this.isOpen = true;
            }else{
                this.collapse.toggle();
                this.isOpen = !this.isOpen;
            }
            return
          }
          if (close) {
            this.showMenu = false
            this.mouseoverMenu = false
            this.showMenuId = null
            this.headerMenuPointerEvents = 'none'
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

    .menu-container {
        position: absolute;
        top: calc(100% - 1px - 13px);
        left: 0;
        width: 100%;
        height: 1000px;
        z-index: 1;
        perspective: 2000px;
        transition-property: opacity;
        transition: 450ms;
        pointer-events: none;
        .header-arrow {
            position: absolute;
            top: -12px;
            left: 50%;
            margin: 0 0 0 -6px;
            width: 22px;
            height: 22px;
            border-radius: 3px 0 0 0;
            box-shadow: -3px -3px 5px rgba(82, 95, 127, .04);
            transition-property: transform;
            transition-duration: 450ms;
            z-index: 2;
            background-image: linear-gradient(135deg, $black-6 50%, transparent 50%);
        }
        .menu-shadow-container {
            position: absolute;
            inset: 0;
            max-width: 100%;

            .header-menu {
                display: inline-block;
                padding-top: 12px;
                transform-origin: 50% -50px;
                transition: transform 450ms, width 450ms, height 450ms;
                z-index: 2;
                position: absolute;
                top: -1px;
                left: 0;
                pointer-events: none;
                max-width: 100vw;
                .header-menu-card {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    z-index: 1;
                    border-radius: 8px;
                    border: 1px solid $black-6;
                    overflow: hidden;
                    background: #ffffff;

                    &-section {
                        max-width: 100vw;
                        width: 100%;
                        display: flex;
                        opacity: 0;
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        &.opacity-100 {
                            transition: opacity 700ms ease;
                        }
                        &>.row {
                            &::-webkit-scrollbar {
                                width: 4px;
                                height: 4px;
                            }

                            &::-webkit-scrollbar-track {
                                background: transparent;
                            }

                            &::-webkit-scrollbar-thumb {
                                background: $white-5;
                            }

                            &::-webkit-scrollbar-thumb:hover {
                                background: #454445;
                            }
                            @media only screen and (max-width: 1570px) {
                                overflow: auto;
                            }
                        }

                        .header-menu-left {
                            padding: 2rem;
                            display: flex;
                            width: 100%;
                            overflow: auto;
                            justify-content: center;
                            column-gap: 3rem;
                            @media only screen and (min-width: 1300px) {
                                overflow: hidden;
                            }
                            @media only screen and (min-width: 1570px) {
                                column-gap: 5.5rem;
                            }
                            &::-webkit-scrollbar {
                                width: 4px;
                                height: 4px;
                            }

                            &::-webkit-scrollbar-track {
                                background: transparent;
                            }

                            &::-webkit-scrollbar-thumb {
                                background: $white-5;
                            }

                            &::-webkit-scrollbar-thumb:hover {
                                background: #454445;
                            }

                            @include media-breakpoint-down(xxl) {
                                &::-webkit-scrollbar {
                                    width: 4px;
                                    height: 4px;
                                }

                                &::-webkit-scrollbar-track {
                                    background: transparent;
                                }

                                &::-webkit-scrollbar-thumb {
                                    background: $white-5;
                                }

                                &::-webkit-scrollbar-thumb:hover {
                                    background: #454445;
                                }
                            }

                            .header-menu-card-section-column {
                                max-width: 272px;
                                
                                @media only screen and (min-width: 1600px) {
                                    max-width: 312px;
                                }

                                .menu-title {
                                    p {
                                        color: $black-8;
                                        font-size: $font-size-xs;
                                        font-weight: 700;
                                        text-transform: uppercase;
                                    }
                                }

                                ul {
                                    list-style: none;
                                    padding: 0;

                                    li {
                                        margin-top: 1rem;
                                    }
                                }
                            }
                        }

                        .dropdown-item {
                            align-items: flex-start;
                            border-radius: 8px !important;
                            display: flex !important;
                            flex-direction: row;
                            margin-bottom: .5rem;
                            padding: .875rem .75rem !important;
                            white-space: unset;
                            &:hover {
                                background: #F9F5FF;
                                color: #8405FF;
                                .material-design-icon {
                                    color: $purple-35 !important;
                                }
                                span {
                                    color: $purple-35 !important;
                                }
                            }
                            .material-design-icon {
                                flex-shrink: 0;
                                font-size: 25px;
                                margin-right: .5rem;
                                align-self: unset;
                                color: #8405FF;
                            }
                            p {
                                font-weight: 400;
                                font-size: $font-size-sm;
                                color: $black-10;
                                line-height: 21px;
                                margin-bottom: 0;
                                text-transform: capitalize;
                                span {
                                    color: $black-6;
                                    display: inline-block;
                                    font-size: $font-size-md;
                                    font-weight: 700;
                                    margin-bottom: 4px;
                                }
                                strong.tag {
                                    background-color:#c7f0ff;
                                    border: 1px solid #7FBBFF;
                                    padding: 4px 6px;
                                    border-radius: 4px;
                                    font-size: $font-size-sm;
                                    margin-left: 8px;
                                    font-weight: 700;
                                    color: #134ECC;
                                }
                            }
                        }
                    }
                }
            }
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
        @include media-breakpoint-down(xxl) {
            .navbar-brand {
                margin-left: 0;
                margin-right: 0;
            }
        }
        @include media-breakpoint-down(xxl) {
            .navbar-brand {
                margin-right: 0.5rem;
            }
        }
    }

    .container-xl {
        @include media-breakpoint-down(lg) {
            padding-left: calc($spacer * 2);
            padding-right: calc($spacer * 2);
            padding-top: calc($spacer / 2);
            
            .navbar-brand {
                margin: 0 0 calc($spacer * 0.75) 0;
            }

            .nav-items {
                margin: 0 0 calc($spacer * 0.75) 0;

                span.menu-text {
                    margin-top: calc($spacer * 0.2);
                    color: $white;
                }

                .open & {
                    span.menu-text, .material-design-icon {
                        color: $black-1 !important;
                    }
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

            &.open {
                background-color: $white;
            }
        }

        &.scrolled {
            @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
                & {
                    background-color: $menu-bg;
                    transition: background-color 250ms ease-in-out;
                }
            }
            &.open {
                @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
                    & {
                        background-color: white;
                    }
                }
            }
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
                    width: 130px;
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

        .nav-item {
            border: none !important;
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
            background-color: $white;
            height: calc(100vh - 3.3rem);
        }

        ul.navbar-nav {
            li {
                a.dropdown-item {
                    white-space: unset;
                    border-bottom: 1px solid $white-3;
                }

                @include media-breakpoint-between(lg, xxl) {
                    font-size: 1rem;
                }

                &:last-child {
                    @include media-breakpoint-down(lg) {
                        border-bottom: 0;
                    }
                }

                a.nav-link {
                    border-radius: $border-radius;
                    color: $black-1 !important;
                    span.material-design-icon {
                        transition: all .2s cubic-bezier(1,.25,.25,.8);
                        will-change: scaleY, top;
                        &.show {
                            top: 4px;
                            transform: scaleY(-1);
                        }
                    }

                    @include media-breakpoint-down(lg) {
                        display: flex;
                        justify-content: space-between;
                        border-radius: 0;
                        background-color: $white;
                    }
                    @include media-breakpoint-down(xl) {
                        font-size: 1rem;
                    }

                    @include media-breakpoint-down(lg) {
                        background-color: white;
                        border-radius: 0;
                        display: flex;
                        justify-content: space-between;
                        font-weight: 600;
                        line-height: 26px;
                        &:not(.show) {
                            border-bottom: 1px solid $white-3;
                        }
                    }

                    &:after {
                        display: none;
                    }

                    &.show, &:hover {
                        @include media-breakpoint-up(lg) {
                            color: #CDD5EF !important;
                        }
                    }

                    &.show {
                        @include media-breakpoint-down(lg) {
                            background-color: $white;
                        }
                    }
                }

                .dropdown-menu {
                    border: none;
                    margin-top: -1rem;
                    &.show {
                        @include media-breakpoint-down(lg) {
                            background-color: $white;
                            border-radius: 0;
                            display: block;
                        }
                    }

                    .dropdown-column {
                        margin-bottom: 2rem;
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        list-style: none;
                        padding-left: 0;
                        min-width: 312px;


                        .column-caption {
                            color: #B9B9BA;
                            font-size: 1rem;
                            font-weight: 600;
                            line-height: 24px;
                            padding-bottom: 9px;
                            margin: 0;
                        }
                    }

                    li {
                        .dropdown-item {
                            align-items: flex-start;
                            display: flex;
                            flex-direction: row;
                            margin-bottom: .5rem;
                            padding: 1rem 0;
                            color: $black-1;
                            p {
                                font-size: .813rem;
                                font-weight: 300;
                                line-height: 1rem;
                                margin-bottom: 0;

                                span {
                                    color: $black-1 !important;
                                    display: inline-block;
                                    font-size: .875rem;
                                    font-weight: 600;
                                    line-height: 1.37rem;
                                }

                                strong.tag {
                                    background-color: #5A3ABC;
                                    border: 1px solid $purple-35;
                                    padding: 2px 4px;
                                    border-radius: 4px;
                                    font-size: $font-size-sm;
                                    font-weight: 400;
                                    color: $white;
                                }
                            }

                            span {
                                flex-shrink: 0;
                                font-size: 135%;
                                margin-right: .5rem;

                                :deep(.material-design-icon__svg) {
                                    fill: #A396FF;
                                }
                            }

                            &:last-child {
                                margin-bottom: 0;
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

<style lang="scss">
@import "../../assets/styles/variable";

.wrapper.announce {
    nav {
        top: 3rem;
    }
}
</style>
