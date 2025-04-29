<template>
    <nav id="top-bar" ref="navbar" class="navbar navbar-expand-lg fixed-top"
        :class="{open: isOpen, scrolled: scrolled }">
        <div class="container-xl">
            <NuxtLink class="navbar-brand" href="/" @click="logoClick" @contextmenu.prevent="showDownloadLogosModal">
                <img :src="isOpen ? '/logo-black.svg' : '/logo-white.svg'"
                    alt="Kestra, Open source declarative data orchestration" />
            </NuxtLink>

            <div class="download-logos-container" v-if="showDownloadLogos" @click="closeDownloadLogosModal">
                <div class="download-logos" @click.stop>
                    <NuxtImg width="24px" height="24px" loading="lazy" format="webp" class="close-icon"
                        src="/landing/header-menu/window-close.svg" alt="close" @click="closeDownloadLogosModal" />
                    <p class="title">Looking for our logo?</p>
                    <NuxtImg width="236px" height="123px" loading="lazy" format="webp" class="img-fluid"
                        src="/landing/header-menu/download-logo.svg" alt="Looking for our logo" />
                    <a download class="btn btn-animated btn-purple-animated mt-2" href="/kestra-logo-kit.zip">
                        Download Logo Pack
                    </a>
                </div>
            </div>

            <div class="nav-items d-flex align-items-center">
                <a @click="globalClick(true)" href="#" class="btn btn-sm  icon-button p-0 d-lg-none"
                    data-bs-toggle="modal" data-bs-target="#search-modal" title="Search">
                    <Magnify />
                </a>
                <button class="navbar-toggler d-flex d-lg-none align-items-center gap-2" @click="globalClick(isOpen)"
                    type="button" aria-controls="main-header" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="menu-text">Menu</span>
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
                            <ChevronDown class="d-inline-block d-lg-none dropdown-chevron" />
                        </a>
                        <div class="dropdown-menu pb-1 d-lg-none">
                            <ul class="dropdown-column">
                                <li>
                                    <NuxtLink class="dropdown-item" href="/features" @click="globalClick(true)">
                                        <div class="item-row">
                                            <OpenSourceInitiative />
                                            <span>Core Features</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/enterprise" @click="globalClick(true)">
                                        <div class="item-row">
                                            <Security />
                                            <span>Enterprise Edition</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/cloud" @click="globalClick(true)">
                                        <div class="item-row">
                                            <CloudOutline />
                                            <span>Cloud Edition</span>
                                            <strong class="tag">Early Access</strong>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/overview" @click="globalClick(true)">
                                        <div class="item-row">
                                            <CursorDefault />
                                            <span>Preview Access</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item dropdown" @mouseover="mouseOver('solutions')"
                        @mouseleave="mouseOut('solutions')">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Solutions
                            <ChevronDown class="d-inline-block d-lg-none dropdown-chevron" />
                        </a>
                        <div class="dropdown-menu pb-1 d-lg-none">
                            <ul class="dropdown-column">
                                <p class="column-caption">Capabilities</p>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/features/declarative-data-orchestration"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <Xml />
                                            <span>Declarative Orchestration</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/features/scheduling-and-automation"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <RefreshAuto />
                                            <span>Automation Platform</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/features/code-in-any-language"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <WebBox />
                                            <span>Language Agnostic</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/terraform-provider"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <Terraform />
                                            <span>Kestra's Terraform Provider</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/features/api-first"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <ArrowCollapseAll />
                                            <span>API-First</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/features/api-first"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <Binoculars />
                                            <span>Platform Capabilities</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <p class="column-caption">By Roles</p>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/data-engineers"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <ChartBarStacked />
                                            <span>Data Engineers</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/software-engineers"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <RefreshAuto />
                                            <span>Software Engineers</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/platform-engineers"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <ServerNetworkOutline />
                                            <span>Platform Engineers</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <p class="column-caption">By Industries</p>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/retail" @click="globalClick(true)">
                                        <div class="item-row">
                                            <BasketOutline />
                                            <span>Retail & Supply Chain</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/healthcare"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <MedicalBag />
                                            <span>Healthcare & Pharmaceuticals</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/automotive"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <CarBack />
                                            <span>Automotive & Heavy Equipment</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/docs/use-cases" @click="globalClick(true)">
                                        <div class="item-row">
                                            <ArrowRight />
                                            <span>All use-cases</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <p class="column-caption">Resources</p>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/about-us" @click="globalClick(true)">
                                        <div class="item-row">
                                            <Domain />
                                            <span>About Us</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/partners" @click="globalClick(true)">
                                        <div class="item-row">
                                            <HandshakeOutline />
                                            <span>Partner</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/faq" @click="globalClick(true)">
                                        <div class="item-row">
                                            <ProgressQuestion />
                                            <span>FAQ</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/community" @click="globalClick(true)">
                                        <div class="item-row">
                                            <AccountGroupOutline />
                                            <span>Community Overview</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/blogs/community" @click="globalClick(true)">
                                        <div class="item-row">
                                            <PostOutline />
                                            <span>Community Contents</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/stories"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <BookOpenPageVariant />
                                            <span>Customer Stories</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/docs/how-to-guides"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <LightbulbOn40 />
                                            <span>How to guides</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/docs/why-kestra" @click="globalClick(true)">
                                        <div class="item-row">
                                            <HeadQuestion />
                                            <span>Why kestra</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/docs/installation"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <Flare />
                                            <span>Quickstart installation guide.</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item dropdown" @mouseover="mouseOver('resources')"
                        @mouseleave="mouseOut('resources')">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            Learn
                            <ChevronDown class="d-inline-block d-lg-none dropdown-chevron" />
                        </a>
                        <div class="dropdown-menu pb-1 d-lg-none">
                            <ul class="dropdown-column">
                                <li>
                                    <NuxtLink class="dropdown-item" href="/docs" @click="globalClick(true)">
                                        <div class="item-row">
                                            <Tools />
                                            <span>Docs</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/blogs" @click="globalClick(true)">
                                        <div class="item-row">
                                            <PostOutline />
                                            <span>Blog</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/blueprints" @click="globalClick(true)">
                                        <div class="item-row">
                                            <ViewList />
                                            <span>Blueprints</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/tutorial-videos" @click="globalClick(true)">
                                        <div class="item-row">
                                            <VideoCheckOutline />
                                            <span>Video Tutorials</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/docs/how-to-guides"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <LightbulbOn40 />
                                            <span>How to guides</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/docs/why-kestra" @click="globalClick(true)">
                                        <div class="item-row">
                                            <HeadQuestion />
                                            <span>Why kestra</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/docs/installation"
                                        @click="globalClick(true)">
                                        <div class="item-row">
                                            <Flare />
                                            <span>Quickstart installation guide.</span>
                                        </div>
                                    </NuxtLink>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link" href="/plugins" role="button" @click="globalClick(true)">
                            <span>Plugins</span>
                        </NuxtLink>
                    </li>
                    <li class="nav-item">
                        <NuxtLink class="nav-link dropdown-toggle" href="/pricing" role="button"
                            @click="globalClick(true)">
                            <span>Pricing</span>
                        </NuxtLink>
                    </li>
                </ul>

                <ul class="navbar-nav mb-2 mb-lg-0 nav-button nav-footer">
                    <li class="nav-item">
                        <GithubButton :small="true" class="d-block d-sm-inline-block mb-1 mn-sm-0 btn btn-dark btn-sm" />
                        <NuxtLink @click="globalClick(true)"
                            class="d-none mb-1 mn-sm-0 btn btn-sm btn-secondary btn-sm me-0 me-sm-2 d-lg-inline-block" href="/demo">
                            <span>
                                Talk to us
                            </span>
                        </NuxtLink>
                        <NuxtLink @click="globalClick(true)"
                            class="d-block d-sm-inline-block mb-1 mn-sm-0 btn btn-primary btn-sm get-started"
                            href="/docs/getting-started/quickstart#start-kestra">
                            <span>
                                Get Started!
                            </span>
                        </NuxtLink>
                        <NuxtLink @click="globalClick(true)"
                            class="d-lg-none d-sm-inline-block d-xs-block mb-1 mn-sm-0 btn btn-secondary btn-md"
                            href="/demo">
                            <span>
                                Talk to Us
                            </span>
                        </NuxtLink>
                        <a @click="globalClick(true)" href="#" id="header-search-button"
                            class="btn btn-sm d-none d-lg-inline-block icon-button" data-bs-toggle="modal"
                            data-bs-target="#search-modal" title="Search">
                            <Magnify />
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <div class="d-lg-block d-none menu-container" :style="{ opacity: showMenu || mouseoverMenu ? 100 : 0 }">
            <div class="menu-shadow-container">
                <div class="header-menu" @mouseover="mouseOverMenu()" :style="{
                        transform: `translateX(${headerMenuTranslateX}) rotateX(-15deg)`,
                        width: headerMenuSize.width,
                        height: headerMenuSize.height,
                        pointerEvents: headerMenuPointerEvents,
                    }">
                    <div class="header-menu-card">
                        <div @mouseleave="mouseLiveMenu()" id="product" class="header-menu-card-section">
                            <div class="header-menu-content">
                                <div class="header-menu-card-section-column">
                                    <ul class="d-flex flex-column w-100 gap-2 py-lg-0">
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/features" @click="globalClick(true)">
                                                <div>
                                                    <div class="same-row">
                                                        <OpenSourceInitiative />
                                                        <span>Core Features</span>
                                                    </div>
                                                    <p>
                                                        Explore Kestra's Core Capabilities
                                                    </p>
                                                </div>
                                            </NuxtLink>
                                        </li>
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/enterprise"
                                                @click="globalClick(true)">
                                                <div>
                                                    <div class="same-row">
                                                        <Security />
                                                        <span>Enterprise Edition</span>
                                                    </div>
                                                    <p>
                                                        Security and Governance for Enterprise Needs
                                                    </p>
                                                </div>
                                            </NuxtLink>
                                        </li>
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/cloud" @click="globalClick(true)">
                                                <div>
                                                    <div class="same-row">
                                                        <CloudOutline />
                                                        <span>Cloud Edition</span>
                                                        <strong class="tag">Early Access</strong>
                                                    </div>
                                                    <p>
                                                        Register for the Cloud Edition
                                                    </p>
                                                </div>
                                            </NuxtLink>
                                        </li>
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/preview-access"
                                                @click="globalClick(true)">
                                                <div>
                                                    <div class="same-row">
                                                        <CursorDefault />
                                                        <span>Preview Access</span>
                                                    </div>
                                                    <p>
                                                        Live Access in Read-Only
                                                    </p>
                                                </div>
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div @mouseleave="mouseLiveMenu()" id="solutions" class="header-menu-card-section">
                            <div class="header-menu-content">
                                <div class="row m-0 w-100 pt-2">
                                    <div class="col-lg-4 header-solution-column">
                                        <div class="menu-title">
                                            <p>Capabilities</p>
                                        </div>
                                        <ul>
                                            <li>
                                                <NuxtLink class="dropdown-item"
                                                    href="/features/declarative-data-orchestration"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <Xml />
                                                            <span>Declarative Orchestration</span>
                                                        </div>
                                                        <p>
                                                            Infrastructure as Code of All Your Workflows
                                                        </p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item"
                                                    href="/features/scheduling-and-automation"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <RefreshAuto />
                                                            <span>Automation Platform</span>
                                                        </div>
                                                        <p>
                                                            Scheduling and Automation Made Easy
                                                        </p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/features/code-in-any-language"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <WebBox />
                                                            <span>Language Agnostic</span>
                                                        </div>
                                                        <p>
                                                            Orchestrate business logic in any language
                                                        </p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/terraform-provider"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <Terraform />
                                                            <span>Kestra's Terraform Provider</span>
                                                        </div>
                                                        <p>
                                                            Deploy & manage all resources with Terraform
                                                        </p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/features/api-first"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <ArrowCollapseAll />
                                                            <span>API-First</span>
                                                        </div>
                                                        <p>
                                                            Learn more about Kestra’s API features
                                                        </p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/features/api-first"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <Binoculars />
                                                            <span>Platform Capabilities</span>
                                                        </div>
                                                        <p>
                                                            Powerful Capabilities from the UI
                                                        </p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-4 header-solution-column">
                                        <div class="menu-title">
                                            <p>By Roles</p>
                                        </div>
                                        <ul>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/data-engineers"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <ChartBarStacked />
                                                            <span>Data Engineers</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/software-engineers"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <RefreshAuto />
                                                            <span>Software Engineers</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/platform-engineers"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <ServerNetworkOutline />
                                                            <span>Platform Engineers</span>
                                                        </div>
                                                    </div>
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
                                                    <div>
                                                        <div class="same-row">
                                                            <BasketOutline />
                                                            <span>Retail & Supply Chain</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/healthcare"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <MedicalBag />
                                                            <span>Healthcare & Pharmaceuticals</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/automotive"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <CarBack />
                                                            <span>Automotive & Heavy Equipment</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/docs/use-cases"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <ArrowRight />
                                                            <span>All use-cases</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-4 header-solution-column">
                                        <div class="menu-title">
                                            <p>Resources</p>
                                        </div>
                                        <ul class="d-flex flex-column w-100 list-unstyled">
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/about-us"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <Domain />
                                                            <span>About Us</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/partners"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <HandshakeOutline />
                                                            <span>Partner</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/faq" @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <ProgressQuestion />
                                                            <span>FAQ</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/community"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <AccountGroupOutline />
                                                            <span>Community Overview</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/blogs/community"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <PostOutline />
                                                            <span>Community Contents</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/stories"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <BookOpenPageVariant />
                                                            <span>Customer Stories</span>
                                                        </div>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div @mouseleave="mouseLiveMenu()" id="resources" class="header-menu-card-section">
                            <div class="header-menu-content">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-6">
                                        <ul>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/docs" @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <Tools />
                                                            <span>Docs</span>
                                                        </div>
                                                        <p>
                                                            Everything Kestra
                                                        </p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/blogs"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <PostOutline />
                                                            <span>Blog</span>
                                                        </div>
                                                        <p>
                                                            Tutorials, Guides, Market Trends and More!
                                                        </p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/blueprints"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <ViewList />
                                                            <span>Blueprints</span>
                                                        </div>
                                                        <p>
                                                            A Library of ready to use Workflows.
                                                        </p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/tutorial-videos"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <VideoCheckOutline />
                                                            <span>Video Tutorials</span>
                                                        </div>
                                                        <p>
                                                            your favourite tutorials in video.
                                                        </p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-6">
                                        <ul>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/docs/how-to-guides"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <LightbulbOn40 />
                                                            <span>How to guides</span>
                                                        </div>
                                                        <p>
                                                            Learn step by step how to address use-cases.
                                                        </p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/docs/why-kestra"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <HeadQuestion />
                                                            <span>Why kestra</span>
                                                        </div>
                                                        <p>
                                                            Trust kestra as your unified orchestration tool.
                                                        </p>
                                                    </div>
                                                </NuxtLink>
                                            </li>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/docs/installation"
                                                    @click="globalClick(true)">
                                                    <div>
                                                        <div class="same-row">
                                                            <Flare />
                                                            <span>Quickstart installation guide.</span>
                                                        </div>
                                                        <p>
                                                            Trust kestra as your unified orchestration tool.
                                                        </p>
                                                    </div>
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
        </div>
    </nav>
</template>

<script setup>
import Email from "vue-material-design-icons/Email.vue";
import OpenSourceInitiative from "vue-material-design-icons/OpenSourceInitiative.vue"
import ViewDashboardOutline from "vue-material-design-icons/ViewDashboardOutline.vue"
import Security from "vue-material-design-icons/Security.vue"
import CloudOutline from "vue-material-design-icons/CloudOutline.vue"
import AccountGroupOutline from "vue-material-design-icons/AccountGroupOutline.vue"
import MessageQuestionOutline from "vue-material-design-icons/MessageQuestionOutline.vue"
import BookOpenPageVariant from "vue-material-design-icons/BookOpenPageVariant.vue"
import ProgressQuestion from "vue-material-design-icons/ProgressQuestion.vue"
import CommentQuestionOutline from "vue-material-design-icons/CommentQuestionOutline.vue"
import PostOutline from "vue-material-design-icons/PostOutline.vue"
import HandshakeOutline from "vue-material-design-icons/HandshakeOutline.vue"
import AccountStarOutline from "vue-material-design-icons/AccountStarOutline.vue"
import Segment from "vue-material-design-icons/Segment.vue"
import Close from "vue-material-design-icons/Close.vue"
import Magnify from "vue-material-design-icons/Magnify.vue"
import Flash from "vue-material-design-icons/Flash.vue"
import Domain from "vue-material-design-icons/Domain.vue"
import CalendarOutline from "vue-material-design-icons/CalendarOutline.vue"
import Xml from "vue-material-design-icons/Xml.vue"
import ArrowRight from "vue-material-design-icons/ArrowRight.vue";
import ServerNetworkOutline from "vue-material-design-icons/ServerNetworkOutline.vue"
import LightbulbOn40 from "vue-material-design-icons/LightbulbOn40.vue"
import Slack from "vue-material-design-icons/Slack.vue"
import Graph from "vue-material-design-icons/Graph.vue"
import Ballot from "vue-material-design-icons/Ballot.vue"
import ChartBarStacked from "vue-material-design-icons/ChartBarStacked.vue"
import ChartDonut from "vue-material-design-icons/ChartDonut.vue"
import BookOpenVariant from "vue-material-design-icons/BookOpenVariant.vue"
import RefreshAuto from "vue-material-design-icons/RefreshAuto.vue"
import BasketOutline from "vue-material-design-icons/BasketOutline.vue"
import BankOutline from "vue-material-design-icons/BankOutline.vue"
import MedicalBag from "vue-material-design-icons/MedicalBag.vue"
import Translate from "vue-material-design-icons/Translate.vue"
import ArrowCollapseAll from "vue-material-design-icons/ArrowCollapseAll.vue"
import Binoculars from "vue-material-design-icons/Binoculars.vue"
import WebBox from "vue-material-design-icons/WebBox.vue"
import CarBack from "vue-material-design-icons/CarBack.vue"
import Terraform from "vue-material-design-icons/Terraform.vue"
import TimelineTextOutline from "vue-material-design-icons/TimelineTextOutline.vue"
import BookOpenVariantOutline from "vue-material-design-icons/BookOpenVariantOutline.vue"
import CursorDefault from "vue-material-design-icons/CursorDefault.vue"
import Tools from "vue-material-design-icons/Tools.vue"
import ViewList from "vue-material-design-icons/ViewList.vue"
import VideoCheckOutline from "vue-material-design-icons/VideoCheckOutline.vue"
import HeadQuestion from "vue-material-design-icons/HeadQuestion.vue"
import Flare from "vue-material-design-icons/Flare.vue"
</script>

<script>
import ChevronDown from "vue-material-design-icons/ChevronDown.vue";
import ChevronUp from "vue-material-design-icons/ChevronUp.vue";
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

    .menu-shadow-container {
        position: absolute;
        inset: 0;
        max-width: 100%;

        .header-menu {
            display: inline-block;
            padding-top: 12px;
            transform-origin: 50% -50px;
            transition: transform 400ms, height 400ms, width 400ms;
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
                background: $white;

                &-section {
                    max-width: 100vw;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    opacity: 0;
                    position: absolute;
                    top: 0;
                    bottom: 0;

                    &.opacity-100 {
                        transition: opacity 700ms ease;
                    }

                    .header-menu-content {
                        padding: 2rem;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                        position: relative;

                        .menu-title {
                            margin-bottom: 1.5rem;

                            p {
                                color: $black-8;
                                font-size: $font-size-xs;
                                font-weight: 400;
                                text-transform: uppercase;
                            }
                        }

                        ul {
                            list-style: none;
                            padding: 0;
                            margin: 0;

                            li {
                                &:last-child {
                                    margin-bottom: 0;
                                }
                            }
                        }

                        .dropdown-item {
                            align-items: flex-start;
                            border-radius: 8px !important;
                            display: flex !important;
                            flex-direction: row;
                            padding: 1rem !important;
                            min-width: 350px;
                            width: 100% !important;
                            text-transform: capitalize;

                            .same-row {
                                display: flex;
                                align-items: center;

                                strong.tag {
                                    background-color: #C7F0FF;
                                    border: 1px solid #7FBBFF;
                                    padding: 4px 6px;
                                    border-radius: 4px;
                                    font-size: $font-size-xs;
                                    margin-left: 8px;
                                    font-weight: 700;
                                    color: #134ECC;
                                }
                            }

                            span {
                                color: $black-1;
                                display: inline-flex;
                                font-size: $font-size-md;
                                font-weight: 600;
                                margin-bottom: 0.25rem;
                                transition: color 0.2s ease;
                            }

                            .material-design-icon {
                                flex-shrink: 0;
                                font-size: 24px;
                                margin-right: 8px;
                                margin-top: -0.25rem;
                                align-self: unset;
                                color: #8405FF;
                                transition: color 0.2s ease;
                            }

                            &:hover {
                                background: #F9F5FF;

                                .material-design-icon {
                                    color: #5A3ABC !important;
                                }

                                span {
                                    color: #5A3ABC !important;
                                }
                            }

                            p {
                                font-weight: 400;
                                font-size: $font-size-sm;
                                color: $black-6;
                                line-height: 1.4rem;
                                margin: 0;
                            }
                        }


                        .header-solution-column {
                            position: relative;

                            &:first-child {
                                padding-right: 2rem;
                            }

                            &:nth-child(2) {
                                padding: 0 2rem;
                            }

                            &:last-child {
                                padding-left: 2rem;
                            }

                            &:not(:last-child)::after {
                                content: '';
                                position: absolute;
                                right: 0;
                                top: -2.5rem;
                                bottom: -6rem;
                                width: .5px;
                                background-color: $white-1;
                            }

                            .menu-title {
                                margin-bottom: 1.5rem;

                                &:not(:first-child) {
                                    margin-top: 2rem;
                                }
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
        padding-left: 0;
        padding-right: 0;
        padding-top: calc($spacer / 2);

        .navbar-brand {
            margin: 0 0 calc($spacer * 0.75) $spacer;
        }

        .nav-items {
            margin: 0 $spacer calc($spacer * 0.75) 0;

            span.menu-text {
                margin-top: calc($spacer * 0.3);
                font-size: $font-size-md;
            }
        }
    }
}

.open {
    .container-xl {
        .nav-items {
            span.menu-text {
                color: $black-1;
            }

            .icon-button {
                color: $black-1 !important;
            }

            button.navbar-toggler {
                color: $black-1 !important;
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
    }

    &.scrolled,
    &.open {
        @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
            & {
                background-color: $menu-bg;
                transition: background-color 250ms ease-in-out;
            }
        }

        &.open {
            @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
                & {
                    background-color: $white;
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

    a.nav-link,
    button.navbar-toggler,
    &.btn.search,
    .nav-item a,
    div.nav-items a {
        color: var(--gray-white, #FFF);
        box-shadow: none !important;
    }

    a.talk-us {
        border: 1px solid $black-6;
        background-color: $white;
        color: $black-1 !important;

        &:hover {
            background-color: $white-4;
        }
    }

    div.nav-items {
        a {
            margin-top: calc($spacer * 0.4);
        }

        a,
        button {
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
            padding: 0 2rem;
        }

        ul.navbar-nav {
            li {
                a.dropdown-item {
                    white-space: unset;
                    text-transform: capitalize;
                    padding: 1rem 5px;
                }

                @include media-breakpoint-between(lg, xxl) {
                    font-size: 1rem;
                }

                a.nav-link {
                    border-radius: $border-radius;

                    span.material-design-icon {
                        transition: all .2s cubic-bezier(1, .25, .25, .8);
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
                        color: $black-1 !important;
                        font-size: $font-size-xl !important;
                        font-weight: 600;
                        border-bottom: 1px solid $white-1;
                        padding: 1.5rem 0;
                        line-height: 26px;
                    }

                    @include media-breakpoint-down(xl) {
                        padding-right: 5px;
                        padding-left: 5px;
                        font-size: 14px;
                    }

                    &:after {
                        display: none;
                    }

                    &.show,
                    &:hover {
                        @include media-breakpoint-up(lg) {
                            color: #CDD5EF !important;
                        }
                    }

                    &.show {
                        @include media-breakpoint-down(lg) {
                            background-color: $white;
                            padding-bottom: 0;
                            border: 0;
                        }
                        .dropdown-chevron {
                            transform: rotate(180deg);
                            transition: all 0.3s ease;
                        }
                    }
                }

                .dropdown-menu {
                    padding: 0 calc($spacer * 1.875) calc($spacer * 1.875);
                    margin-top: 10px;

                    &.show {
                        @include media-breakpoint-down(lg) {
                            background-color: $white;
                            border-radius: 0;
                            display: block;
                            border: none;
                            padding: 0 !important;
                        }
                    }

                    .dropdown-column {
                        margin-bottom: 1rem;
                        display: flex;
                        flex-direction: column;
                        list-style: none;
                        padding-left: 0;
                        min-width: 312px;

                        .column-caption {
                            color: #B9B9BA;
                            font-size: $font-size-xs;
                            font-weight: 600;
                            line-height: 24px;
                            margin: 0;
                            text-transform: uppercase;
                            padding-left: 5px;
                        }
                    }

                    li {
                        background-color: transparent;
                        color: $black-1;
                        border: 0 !important;

                        &:not(:last-of-type) {
                            border-bottom: 1px solid $white-1 !important;
                        }

                        .item-row {
                            display: flex;
                            align-items: center;
                            gap: .5rem;

                        }

                        .dropdown-item {
                            --bs-dropdown-link-hover-color: #5A3ABC;
                            --bs-dropdown-link-hover-bg: #F9F5FF;
                            --bs-dropdown-link-active-color: #5A3ABC;
                            --bs-dropdown-link-active-bg: #F9F5FF;

                            &:last-child {
                                margin-bottom: 0;
                            }

                            &:hover,
                            &.active {
                                span {
                                    color: #5A3ABC;
                                }
                            }

                            span {
                                color: $black;
                                display: inline-block;
                                font-size: 1rem;
                                font-weight: 700;
                                line-height: 1.37rem;
                                flex-shrink: 0;
                                margin-right: .5rem;
                            }

                            strong.tag {
                                background-color: #C7F0FF;
                                border: 1px solid #7FBBFF;
                                padding: 0px 6px;
                                border-radius: 4px;
                                font-size: $font-size-md;
                                font-weight: 700;
                                color: #134ECC;
                            }


                            :deep(.material-design-icon__svg) {
                                fill: #8405FF;
                                width: 24px;
                                height: 24px;
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
                    color: $black-1;

                    &:hover {
                        color: $purple-36 !important;
                    }
                }
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
                padding: calc($spacer * 0.65) $spacer !important;
            }

            .github {
                background: #F7F7F8;
                border: 1px solid $white-2 !important;
                padding: calc($spacer * 0.25) $spacer;
            }

            :deep(.github .btn-outline-dark) {
                background: transparent;
                color: $black-1;


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

            .github {
                width: 100%;
            }
        }
    }

    :deep(.github .btn) {
        font-weight: bold !important;
        font-size: 12px !important;
    }

    &:not(.transparent) {
        :deep(.github) {
            &:hover {
                .btn-dark {
                    background: transparent !important;
                }

                .btn-outline-dark {
                    background: transparent !important;
                }
            }
        }

        :deep(.github .btn-dark) {
            color: $white-6;
        }

        :deep(.github .btn-outline-dark) {
            background: transparent;
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
                background: $white;
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