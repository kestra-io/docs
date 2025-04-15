<template>
    <nav id="top-bar" ref="navbar" class="navbar navbar-expand-lg fixed-top" :class="{open: isOpen, scrolled: scrolled }">
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
                    <li class="nav-item dropdown" @mouseover="mouseOver('product')" @mouseleave="mouseOut('product')">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                           aria-expanded="false">
                            Product
                            <ChevronDown class="d-inline-block d-lg-none" />
                        </a>
                        <ul class="dropdown-menu d-lg-none">
                            <div class="d-flex flex-column w-100 gap-3 py-lg-0 py-1">
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
                                            <strong class="tag">Early Adopter</strong>
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
                                            Powerful capabilities from the UI
                                        </p>
                                    </NuxtLink>
                                </li>
                                <li class="w-100 bg-transparent">
                                    <NuxtLink
                                        class="header-menu-right-banner overview-banner-mobile"
                                        href="/docs/getting-started/quickstart"
                                        @click="globalClick(true)"
                                    >
                                        <p class="title"> Start orchestrating your first workflows. </p>
                                        <span class="link">
                                            Quickstart Guide
                                            <ChevronRight />
                                        </span>
                                    </NuxtLink>
                                    <ul class="header-menu-right-menu">
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/docs/workflow-components" @click="globalClick(true)">
                                                <TimelineTextOutline />
                                                <p>
                                                    <span>Workflow components</span><br />
                                                    Get to know the main orchestration components of a Kestra workflow
                                                </p>
                                            </NuxtLink>
                                        </li>
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/tutorial-videos" @click="globalClick(true)">
                                                <VideoOutline />
                                                <p>
                                                    <span>Videos tutorials</span><br />
                                                    Get started with our video tutorials
                                                </p>
                                            </NuxtLink>
                                        </li>
                                    </ul>
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
                            <ul class="dropdown-column">
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
                            <ul class="dropdown-column">
                                <p class="column-caption">Industries</p>
                                <li>
                                    <NuxtLink class="dropdown-item" href="/use-cases/retail"
                                              @click="globalClick(true)">
                                        <BasketOutline />
                                        <p>
                                            <span>For Retail</span><br />
                                            Empower retail businesses with an event-driven, language-agnostic orchestration platform that scales
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
                                <li class="w-100 bg-transparent">
                                    <NuxtLink class="d-flex d-xl-block header-menu-right-banner blueprints-banner-mobile" href="/blueprints" @click="globalClick(true)">
                                        <img src="/landing/header-menu/platform-blueprints-mobile.png" alt="Explore blueprints" />
                                        <div>
                                            <p class="title">Explore blueprints <br/> to kick-start <br/> your next flow. </p>
                                            <span class="link">
                                                Explore
                                                <ChevronRight/>
                                            </span>
                                        </div>
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
                                <li class="w-100 bg-transparent">
                                    <NuxtLink class="header-menu-right-banner gorgias-banner-mobile" href="/use-cases/stories/13-gorgias-using-declarative-data-engineering-orchestration-with-kestra" @click="globalClick(true)">
                                        <img src="/landing/header-menu/executions-mobile.png" alt="Platform Overview" />
                                        <div>
                                            <p class="title">
                                                Gorgias, Using Declarative<br>
                                                Data Engineering<br>
                                                Orchestration With Kestra
                                            </p>
                                            <span class="link">
                                                Explore
                                                <ChevronRight/>
                                            </span>
                                        </div>
                                    </NuxtLink>
                                    <ul class="header-menu-right-menu">
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/use-cases/stories" @click="globalClick(true)">
                                                <BookOpenVariantOutline />
                                                <p>
                                                    <span>Customer Stories</span><br />
                                                    Learn how Enterprises orchestrate their business-critical workflows
                                                </p>
                                            </NuxtLink>
                                        </li>
                                    </ul>
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
                                    <div class="menu-title">
                                        <p>Product</p>
                                    </div>
                                    <ul class="d-flex flex-column w-100 gap-3 py-lg-0 py-1">
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
                                                    <strong class="tag">Early Adopter</strong>
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
                                                    Powerful capabilities from the UI
                                                </p>
                                            </NuxtLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="header-menu-right">
                                <NuxtLink class="header-menu-right-banner" href="/docs/getting-started/quickstart" @click="globalClick(true)">
                                    <p class="title"> Start <br> orchestrating your <br> first workflows. </p>
                                    <span class="link">
                                        Quickstart Guide
                                        <ChevronRight class="d-none d-lg-inline-flex"/>
                                    </span>
                                </NuxtLink>
                                <ul class="header-menu-right-menu">
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/docs/workflow-components" @click="globalClick(true)">
                                            <TimelineTextOutline />
                                            <p>
                                                <span>Workflow components</span><br />
                                                Get to know the main orchestration components of a Kestra workflow
                                            </p>
                                        </NuxtLink>
                                    </li>
                                    <li>
                                        <NuxtLink class="dropdown-item" href="/tutorial-videos" @click="globalClick(true)">
                                            <VideoOutline />
                                            <p>
                                                <span>Videos tutorials</span><br />
                                                Get started with our video tutorials
                                            </p>
                                        </NuxtLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div @mouseleave="mouseLiveMenu()" id="solutions" class="header-menu-card-section">
                            <div class="row m-0 w-100 flex-nowrap">
                                <div class="header-menu-left col-12 col-xl">
                                    <div class="header-menu-card-section-column col-lg-6">
                                        <div class="menu-title">
                                            <p>Features</p>
                                        </div>
                                        <ul>
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
                                    </div>
                                    <div class="header-menu-card-section-column col-lg-6">
                                        <div class="menu-title">
                                            <p>Use Cases</p>
                                        </div>
                                        <ul>
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
                                    </div>
                                    <div class="header-menu-card-section-column col-lg-12">
                                        <div class="menu-title">
                                            <p>Industries</p>
                                        </div>
                                        <ul>
                                            <li>
                                                <NuxtLink class="dropdown-item" href="/use-cases/retail"
                                                            @click="globalClick(true)">
                                                    <BasketOutline />
                                                    <p>
                                                        <span>For Retail</span><br />
                                                        Empower retail businesses with an event-driven, language-agnostic orchestration platform that scales
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
                                    </div>
                                </div>
                                <div class="header-menu-right col-12 col-xl-auto">
                                    <NuxtLink class="d-flex d-xl-block header-menu-right-banner" href="/blueprints" @click="globalClick(true)">
                                        <img class="mb-4" src="/landing/header-menu/platform-blueprints.png" alt="Explore blueprints" />
                                        <p class="title">Explore blueprints to kick-start <br/> your next flow. </p>
                                        <span class="link">
                                        Explore
                                        <ChevronRight class="d-none d-lg-inline-flex"/>
                                    </span>
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                        <div @mouseleave="mouseLiveMenu()" id="resources" class="header-menu-card-section">
                            <div class="header-menu-left">
                                <div class="header-menu-card-section-column">
                                    <div class="menu-title">
                                        <p>RESOURCES</p>
                                    </div>
                                    <ul>
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
                                </div>
                                <div class="header-menu-card-section-column">
                                    <div class="menu-title">
                                        <p>DISCOVER</p>
                                    </div>
                                    <ul>
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
                                                    <span>Partner</span><br />
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
                            </div>
                            <div class="header-menu-right">
                                <div class="features">
                                    <NuxtLink class="header-menu-right-banner" href="/use-cases/stories/13-gorgias-using-declarative-data-engineering-orchestration-with-kestra" @click="globalClick(true)">
                                        <img src="/landing/header-menu/executions.png" alt="Platform Overview" />
                                        <p class="title">
                                            Gorgias, <br>
                                            Using Declarative
                                            Data Engineering
                                            Orchestration<br>
                                            With Kestra
                                        </p>
                                        <p class="count-text">20 000+</p>
                                        <span class="link">executions per month</span>
                                    </NuxtLink>
                                    <ul class="header-menu-right-menu">
                                        <li>
                                            <NuxtLink class="dropdown-item" href="/use-cases/stories" @click="globalClick(true)">
                                                <BookOpenVariantOutline />
                                                <p>
                                                    <span>Customer Stories</span><br />
                                                    Learn how Enterprises orchestrate their business-critical workflows
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
                    background: #1d1d1e;

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
                            justify-content: flex-start;
                            column-gap: 2rem;
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
                                    border-bottom: 1.11px solid $black-6;

                                    p {
                                        color: $white-3;
                                        font-size: $font-size-xs;
                                        font-weight: 400;
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
                            border-radius: 4px !important;
                            display: flex !important;
                            flex-direction: row;
                            margin-bottom: .5rem;
                            padding: .875rem .75rem !important;
                            white-space: unset;
                            &:hover {
                                background: $black-2;
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
                                color: #a396ff;
                            }
                            p {
                                font-weight: 400;
                                font-size: $font-size-sm;
                                color: $white-1;
                                line-height: 21px;
                                margin-bottom: 0;
                                span {
                                    color: $white;
                                    display: inline-block;
                                    font-size: $font-size-md;
                                    font-weight: 700;
                                    margin-bottom: 4px;
                                }
                                strong.tag {
                                    background-color: #5A3ABC;
                                    border: 1px solid $purple-35;
                                    padding: 4px 6px;
                                    border-radius: 4px;
                                    font-size: $font-size-sm;
                                    margin-left: 8px;
                                    font-weight: 400;
                                    color: $white;
                                }
                            }
                        }

                        &#solutions {
                            .header-menu-right {
                                a {
                                    @media only screen and (max-width: 1200px) {
                                        img {
                                            width: 257px;
                                        }
                                        p.title {
                                            max-width: 260px;
                                        }
                                        align-items: center;
                                        width: 100%;
                                        justify-content: space-around;
                                    }
                                }
                            }
                        }
                        .header-menu-right {
                            background: #252526f7;
                            padding: 32px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            flex-direction: column;

                            &-menu {
                                width: 100%;
                                margin: 28px 0 0;
                                padding: 0;
                                display: flex;
                                flex-direction: column;
                                gap: 28px;

                                li {
                                    a.dropdown-item {
                                        margin: 0;
                                        &:hover {
                                            background: $black-2;
                                            .material-design-icon {
                                                color: $purple-35 !important;
                                            }
                                            span {
                                                color: $purple-35 !important;
                                            }
                                        }
                                        p {
                                            margin: 0;
                                        }

                                    }
                                }
                            }
                            .features {
                                a.header-menu-right-banner {
                                    font-family: $font-family-sans-serif;
                                    padding: 15px 17px 18px 26px;
                                    span.link {
                                        color: #FFFFFF99;
                                        font-weight: 400;
                                        font-size: 15px;
                                    }
                                }
                            }
                            &-banner {
                                background-image: url(/landing/header-menu/menu-right.png);
                                background-repeat: no-repeat;
                                background-size: 100% 100%;
                                border: 1px solid rgba(255, 255, 255, 0.3);
                                border-radius: 4px;
                                display: inline-block;
                                padding: 47px 28px 42px 26px;
                                width: 312px;
                                max-height: 370px;
                                &:hover {
                                    background-image: url(/landing/header-menu/menu-right-hover.png);
                                }
                                .title {
                                    font-size: 26px;
                                    line-height: 27px;
                                    font-weight: 500;
                                    color: $white;
                                }
                                .count-text {
                                    font-weight: 800;
                                    color: $white;
                                    font-size: 47px;
                                    line-height: 37px;
                                    margin-bottom: 0;
                                    margin-top: 0;
                                }
                                img {
                                    width: 100%;
                                }
                                p {
                                    margin-bottom: 10px;
                                }
                                span.link {
                                    color: #CDD5EF;
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
                        background-color: $black-9;
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
                        background-color: $black-9;
                        border-top: 1px solid $black-6;
                    }
                    @include media-breakpoint-down(xl) {
                        padding-right: 5px;
                        padding-left: 5px;
                        font-size: 14px;
                    }

                    @include media-breakpoint-down(lg) {
                        background-color: #1d1d1e;
                        border-radius: 0;
                        border-top: 1px solid #3d3d3f;
                        display: flex;
                        justify-content: space-between;
                        padding: 1.6rem 2rem;
                        font-weight: 500;
                        line-height: 26px;
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
                            background-color: #161617;
                        }
                    }
                }

                .dropdown-menu {
                    padding: 0 calc($spacer * 1.875)  calc($spacer * 1.875) !important;
                    &.show {
                        @include media-breakpoint-down(lg) {
                            background-color: #161617;
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
                            border-bottom: 1.11px solid #3D3D3F;
                            padding-bottom: 9px;
                            margin: 0;
                        }
                    }

                    li {
                        background-color: #252526;
                        border: 0 !important;
                        border-radius: .25rem;

                        .header-menu-right-banner {
                            background-image: url(/landing/header-menu/menu-right.png);
                            background-repeat: no-repeat;
                            background-size: 100% 100%;
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            border-radius: 4px;
                            width: 100%;

                            &.overview-banner-mobile {
                                display: inline-block;
                                padding: 17px 32px 14px 21px;
                                min-height: 125px;

                                p.title {
                                    text-align: left;
                                    font-weight: 600;
                                    font-size: 27px;
                                    line-height: 30px;
                                    margin-bottom: 5px;
                                }

                                span {
                                    text-align: center;
                                    font-weight: 600;
                                    font-size: 16px;
                                }
                            }
                            &.blueprints-banner-mobile {
                                display: flex;
                                justify-content: space-around;
                                align-items: center;
                                padding: 16px 3px 16px 3px;
                                img {
                                    width: 144px;
                                    height: auto;
                                }
                                p.title {
                                    text-align: left;
                                    font-size: $h6-font-size;
                                    line-height: calc($font-size-base * 1.5);
                                    margin-bottom: 4px;
                                }
                                span {
                                    font-size: $font-size-sm;
                                }
                            }
                            &.gorgias-banner-mobile {
                                display: flex;
                                justify-content: space-around;
                                align-items: center;
                                padding: 16px 3px 16px 3px;
                                img {
                                    width: 144px;
                                    height: auto;
                                }
                                p.title {
                                    text-align: left;
                                    font-size: $font-size-sm;
                                    margin-bottom: 4px;
                                }
                                span {
                                    font-size: $font-size-sm;
                                }
                            }
                        }
                        .header-menu-right-menu {
                            background: transparent;
                            padding-left: 0;
                            list-style: none;
                            li {
                                margin-top: 1rem;
                            }
                        }
                        .dropdown-item {
                            align-items: flex-start;
                            border-radius: .5rem;
                            display: flex;
                            flex-direction: row;
                            margin-bottom: .5rem;
                            padding: .5rem 1rem;

                            p {
                                color: #e1e1e1 !important;
                                font-size: .813rem;
                                font-weight: 300;
                                line-height: 1rem;
                                margin-bottom: 0;

                                span {
                                    color: #fff !important;
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
