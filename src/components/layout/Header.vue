<template>
    <nav
        id="top-bar"
        ref="navbar"
        class="navbar navbar-expand-lg fixed-top"
        :class="{
            open: isOpen,
            scrolled: isScrolled || props.scrolled,
        }"
    >
        <div class="container-xl">
            <a
                class="navbar-brand"
                href="/"
                @click="logoClick"
                @contextmenu.prevent="showDownloadLogosModal"
            >
                <div class="logo-dark" v-html="LogoWhite" />
                <div class="logo-light" v-html="LogoBlack" />
            </a>

            <div
                class="download-logos-container"
                v-if="showDownloadLogos"
                @click="closeDownloadLogosModal"
            >
                <div class="download-logos" @click.stop>
                    <img
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
                    <img
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
                <a
                    @click="globalClick(true)"
                    href="#"
                    class="btn btn-sm icon-button p-0 d-lg-none"
                    data-bs-toggle="modal"
                    data-bs-target="#search-modal"
                    title="Search"
                >
                    <Magnify />
                </a>
                <button
                    class="navbar-toggler d-flex d-lg-none align-items-center gap-2"
                    @click="globalClick(isOpen)"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#main-header"
                    aria-controls="main-header"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span class="menu-text">Menu</span>
                    <Segment v-if="!isOpen" />
                    <Close v-if="isOpen" />
                </button>
            </div>

            <div class="collapse navbar-collapse" id="main-header">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-5">
                    <li
                        class="nav-item dropdown"
                        @mouseover="mouseOver('product')"
                        @mouseleave="mouseOut('product')"
                    >
                        <a
                            class="nav-link dropdown-toggle"
                            :class="{ show: showMenuId === 'product' && showMenu }"
                            href="#"
                            role="button"
                            :data-bs-toggle="isMobile ? 'dropdown' : undefined"
                            aria-expanded="false"
                        >
                            Product
                            <ChevronDown
                                class="d-inline-block dropdown-chevron"
                            />
                        </a>
                        <div class="dropdown-menu pb-1 d-lg-none">
                            <ul class="dropdown-column">
                                <li v-for="item in menuItems.product.items" :key="item.link">
                                    <a
                                        class="dropdown-item"
                                        :href="item.link"
                                        @click="globalClick(true)"
                                    >
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                            <strong v-if="item.tag" class="tag">{{
                                                item.tag
                                            }}</strong>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li
                        class="nav-item dropdown"
                        @mouseover="mouseOver('solutions')"
                        @mouseleave="mouseOut('solutions')"
                    >
                        <a
                            class="nav-link dropdown-toggle"
                            :class="{ show: showMenuId === 'solutions' && showMenu }"
                            href="#"
                            role="button"
                            :data-bs-toggle="isMobile ? 'dropdown' : undefined"
                            aria-expanded="false"
                        >
                            Solutions
                            <ChevronDown
                                class="d-inline-block dropdown-chevron"
                            />
                        </a>
                        <div class="dropdown-menu pb-1 d-lg-none">
                            <ul class="dropdown-column">
                                <p class="column-caption">Capabilities</p>
                                <li
                                    v-for="item in menuItems.solutions.capabilities"
                                    :key="item.link"
                                >
                                    <a
                                        class="dropdown-item"
                                        :href="item.link"
                                        @click="globalClick(true)"
                                    >
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <p class="column-caption">By Roles</p>
                                <li v-for="item in menuItems.solutions.roles" :key="item.link">
                                    <a
                                        class="dropdown-item"
                                        :href="item.link"
                                        @click="globalClick(true)"
                                    >
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <p class="column-caption">By Industries</p>
                                <li v-for="item in menuItems.solutions.industries" :key="item.link">
                                    <a
                                        class="dropdown-item"
                                        :href="item.link"
                                        @click="globalClick(true)"
                                    >
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <p class="column-caption">Resources</p>
                                <li v-for="item in menuItems.solutions.resources" :key="item.link">
                                    <a
                                        class="dropdown-item"
                                        :href="item.link"
                                        @click="globalClick(true)"
                                    >
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li
                        class="nav-item dropdown"
                        @mouseover="mouseOver('resources')"
                        @mouseleave="mouseOut('resources')"
                    >
                        <a
                            class="nav-link dropdown-toggle"
                            :class="{ show: showMenuId === 'resources' && showMenu }"
                            href="#"
                            role="button"
                            :data-bs-toggle="isMobile ? 'dropdown' : undefined"
                            aria-expanded="false"
                        >
                            Learn
                            <ChevronDown
                                class="d-inline-block dropdown-chevron"
                            />
                        </a>
                        <div class="dropdown-menu pb-1 d-lg-none">
                            <ul class="dropdown-column">
                                <li v-for="item in menuItems.resources.mainItems" :key="item.link">
                                    <a
                                        class="dropdown-item"
                                        :href="item.link"
                                        @click="globalClick(true)"
                                    >
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                            <ul class="dropdown-column">
                                <li
                                    v-for="item in menuItems.resources.additionalItems"
                                    :key="item.link"
                                >
                                    <a
                                        class="dropdown-item"
                                        :href="item.link"
                                        @click="globalClick(true)"
                                    >
                                        <div class="item-row">
                                            <component :is="item.icon" />
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            href="/plugins"
                            role="button"
                            @click="globalClick(true)"
                        >
                            <span>Plugins</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link dropdown-toggle"
                            href="/pricing"
                            role="button"
                            @click="globalClick(true)"
                        >
                            <span>Pricing</span>
                        </a>
                    </li>
                </ul>

                <ul class="navbar-nav mb-2 mb-lg-0 nav-button nav-footer">
                    <li class="nav-item">
                        <GithubButton
                            :small="true"
                            class="d-block d-sm-inline-block mb-1 mn-sm-0"
                        />
                        <a
                            @click="globalClick(true)"
                            class="d-none mb-1 mn-sm-0 btn btn-sm btn-secondary btn-sm me-0 me-sm-2 d-lg-inline-block"
                            href="/demo"
                        >
                            <span> Talk to us </span>
                        </a>
                        <a
                            @click="globalClick(true)"
                            class="d-block d-sm-inline-block mb-1 mn-sm-0 btn btn-primary btn-sm get-started"
                            href="/docs/quickstart#start-kestra"
                        >
                            <span> Get Started! </span>
                        </a>
                        <a
                            @click="globalClick(true)"
                            class="d-lg-none d-sm-inline-block d-xs-block mb-1 mn-sm-0 btn btn-secondary btn-md"
                            href="/demo"
                        >
                            <span> Talk to Us </span>
                        </a>
                        <button
                            @click="globalClick(true)"
                            href="#"
                            id="header-search-button"
                            class="btn btn-sm d-none d-lg-inline-block icon-button"
                            data-bs-toggle="modal"
                            data-bs-target="#search-modal"
                            title="Search"
                        >
                            <Magnify />
                        </button>
                    </li>
                </ul>
            </div>
        </div>

        <div
            class="d-lg-block d-none menu-container"
            :style="{ opacity: showMenu || mouseoverMenu ? 100 : 0 }"
        >
            <div
                class="header-arrow"
                :style="{
                    transform: `translateY(12px) translateX(${headerArrowTranslateX}px) rotate(45deg)`,
                }"
            ></div>
            <div class="menu-shadow-container">
                <div
                    :style="{
                        transform: `translateX(${headerMenuTranslateX}) rotateX(-15deg)`,
                        width: headerMenuSize.width,
                        height: headerMenuSize.height,
                        pointerEvents: headerMenuPointerEvents,
                    }"
                    class="header-menu"
                    @mouseover="mouseOverMenu"
                    @mouseleave="mouseLeaveMenu"
                >
                    <div class="header-menu-card">
                        <div
                            @mouseleave="mouseLeaveMenu()"
                            id="product"
                            class="header-menu-card-section"
                        >
                            <div class="header-menu-content">
                                <div class="header-menu-card-section-column">
                                    <ul class="d-flex flex-column w-100 gap-2 py-lg-0">
                                        <li
                                            v-for="item in menuItems.product.items"
                                            :key="item.link"
                                        >
                                            <a
                                                class="dropdown-item"
                                                :href="item.link"
                                                @click="globalClick(true)"
                                            >
                                                <div>
                                                    <div class="same-row">
                                                        <component :is="item.icon" />
                                                        <span>{{ item.title }}</span>
                                                        <strong v-if="item.tag" class="tag">{{
                                                            item.tag
                                                        }}</strong>
                                                    </div>
                                                    <p>
                                                        {{ item.description }}
                                                    </p>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div
                            @mouseleave="mouseLeaveMenu()"
                            id="solutions"
                            class="header-menu-card-section"
                        >
                            <div class="header-menu-content">
                                <div class="row m-0 w-100 pt-2 flex-nowrap">
                                    <div class="col-lg-4 header-solution-column">
                                        <div class="menu-title">
                                            <p>Capabilities</p>
                                        </div>
                                        <ul>
                                            <li
                                                v-for="item in menuItems.solutions.capabilities"
                                                :key="item.link"
                                            >
                                                <a
                                                    class="dropdown-item"
                                                    :href="item.link"
                                                    @click="globalClick(true)"
                                                >
                                                    <div>
                                                        <div class="same-row">
                                                            <component :is="item.icon" />
                                                            <span>{{ item.title }}</span>
                                                        </div>
                                                        <p>
                                                            {{ item.description }}
                                                        </p>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-4 header-solution-column">
                                        <div class="menu-title">
                                            <p>By Roles</p>
                                        </div>
                                        <ul>
                                            <li
                                                v-for="item in menuItems.solutions.roles"
                                                :key="item.link"
                                            >
                                                <a
                                                    class="dropdown-item"
                                                    :href="item.link"
                                                    @click="globalClick(true)"
                                                >
                                                    <div>
                                                        <div class="same-row">
                                                            <component :is="item.icon" />
                                                            <span>{{ item.title }}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                        <div class="menu-title">
                                            <p>By Industries</p>
                                        </div>
                                        <ul>
                                            <li
                                                v-for="item in menuItems.solutions.industries"
                                                :key="item.link"
                                            >
                                                <a
                                                    class="dropdown-item"
                                                    :href="item.link"
                                                    @click="globalClick(true)"
                                                >
                                                    <div>
                                                        <div class="same-row">
                                                            <component :is="item.icon" />
                                                            <span>{{ item.title }}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-4 header-solution-column">
                                        <div class="menu-title">
                                            <p>Resources</p>
                                        </div>
                                        <ul class="d-flex flex-column w-100 list-unstyled">
                                            <li
                                                v-for="item in menuItems.solutions.resources"
                                                :key="item.link"
                                            >
                                                <a
                                                    class="dropdown-item"
                                                    :href="item.link"
                                                    @click="globalClick(true)"
                                                >
                                                    <div>
                                                        <div class="same-row">
                                                            <component :is="item.icon" />
                                                            <span>{{ item.title }}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            @mouseleave="mouseLeaveMenu()"
                            id="resources"
                            class="header-menu-card-section"
                        >
                            <div class="header-menu-content">
                                <div class="row m-0 w-100">
                                    <div class="col-lg-6">
                                        <ul>
                                            <li
                                                v-for="item in menuItems.resources.mainItems"
                                                :key="item.link"
                                            >
                                                <a
                                                    class="dropdown-item"
                                                    :href="item.link"
                                                    @click="globalClick(true)"
                                                >
                                                    <div>
                                                        <div class="same-row">
                                                            <component :is="item.icon" />
                                                            <span>{{ item.title }}</span>
                                                        </div>
                                                        <p>
                                                            {{ item.description }}
                                                        </p>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-6">
                                        <ul>
                                            <li
                                                v-for="item in menuItems.resources.additionalItems"
                                                :key="item.link"
                                            >
                                                <a
                                                    class="dropdown-item"
                                                    :href="item.link"
                                                    @click="globalClick(true)"
                                                >
                                                    <div>
                                                        <div class="same-row">
                                                            <component :is="item.icon" />
                                                            <span>{{ item.title }}</span>
                                                        </div>
                                                        <p>
                                                            {{ item.description }}
                                                        </p>
                                                    </div>
                                                </a>
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

<script setup lang="ts">
    import { ref, onMounted, watch, nextTick } from "vue"
    import ChevronDown from "vue-material-design-icons/ChevronDown.vue"
    import GithubButton from "~/components/layout/GithubButton.vue"
    import Magnify from "vue-material-design-icons/Magnify.vue"
    import Close from "vue-material-design-icons/Close.vue"
    import Segment from "vue-material-design-icons/Segment.vue"
    import { menuSize } from "~/utils/menu-sizes"
    import { menuItems } from "~/utils/menu-items"
    import LogoBlack from "~/assets/logo-black.svg?raw"
    import LogoWhite from "~/assets/logo-white.svg?raw"

    const props = defineProps<{
        scrolled?: boolean
        transparentHeader?: boolean
    }>()

    const isOpen = ref(false)
    const showDownloadLogos = ref(false)
    const showMenu = ref(false)
    const showMenuId = ref<string | null>(null)
    const headerArrowTranslateX = ref(0)
    const headerMenuTranslateX = ref("50vw")
    const mouseoverMenu = ref(false)
    const headerMenuSize = ref({
        width: "0px",
        height: "0px",
    })
    const headerMenuPointerEvents = ref<"none" | "auto">("none")
    const navbar = ref<HTMLElement | null>(null)
    const isMobile = ref(false)
    const isScrolled = ref(false)
    const closeMenuTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

    interface Collapse {
        hide: () => void
        show: () => void
        toggle: () => void
    }

    let collapse: Collapse | undefined = undefined

    onMounted(() => {
        // Wait for bootstrap to be available
        nextTick(() => {
            collapse = window.$bootstrap.Collapse
                ? new window.$bootstrap.Collapse("#main-header", {
                      toggle: false,
                  })
                : undefined
        })

        isMobile.value = window.innerWidth <= 991
        window.addEventListener("resize", () => {
            isMobile.value = window.innerWidth <= 991
        })

        isScrolled.value = window.scrollY > 0
        window.addEventListener("scroll", () => {
            isScrolled.value = window.scrollY > 0
            const header = navbar.value
            if (header) {
                header.classList.toggle("scrolled", isScrolled.value)
            }
        })

        document.documentElement.style.setProperty(
            "--top-bar-height",
            navbar.value?.offsetHeight + "px",
        )
    })

    watch(
        () => props.transparentHeader,
        (to) => {
            globalClick(true)
        },
        { deep: true },
    )

    function mouseOverMenu() {
        if (closeMenuTimeout.value) {
            clearTimeout(closeMenuTimeout.value)
            closeMenuTimeout.value = null
        }
        mouseoverMenu.value = true
        headerMenuPointerEvents.value = "auto"
    }

    function mouseLeaveMenu() {
        closeMenuTimeout.value = setTimeout(() => {
            showMenu.value = false
            mouseoverMenu.value = false
            showMenuId.value = null
            headerMenuPointerEvents.value = "none"
        }, 100)
    }

    function mouseOver(id: string) {
        if (window.innerWidth > 991) {
            document.querySelectorAll(".header-menu-card-section").forEach((obj) => {
                obj.classList.remove("opacity-100")
                obj.classList.remove("z-1")
            })
            let menu = document.getElementById(id)
            if (menu) {
                if (closeMenuTimeout.value) {
                    clearTimeout(closeMenuTimeout.value)
                    closeMenuTimeout.value = null
                }
                mouseoverMenu.value = false
                showMenu.value = true
                showMenuId.value = id
                headerMenuSize.value = menuSize(id, window.innerWidth).size
                headerMenuTranslateX.value = menuSize(id, window.innerWidth).headerMenuTranslateX
                headerArrowTranslateX.value = menuSize(id, window.innerWidth).headerArrowTranslateX
                menu.classList.add("z-1")
                menu.classList.add("opacity-100")
                headerMenuPointerEvents.value = "auto"
            }
        }
    }

    function mouseOut(id: string) {
        if (window.innerWidth > 991) {
            let menu = document.getElementById(id)
            if (menu) {
                closeMenuTimeout.value = setTimeout(() => {
                    headerMenuPointerEvents.value = "none"
                    showMenu.value = false
                    showMenuId.value = null
                }, 100)
            }
        }
    }

    function globalClick(close?: boolean) {
        if (window.innerWidth < 992) {
            if (close === true) {
                collapse?.hide()
                isOpen.value = false
            } else if (close === false) {
                collapse?.show()
                isOpen.value = true
            } else {
                collapse?.toggle()
                isOpen.value = !isOpen.value
            }
            return
        }
        if (close) {
            showMenu.value = false
            mouseoverMenu.value = false
            showMenuId.value = null
            headerMenuPointerEvents.value = "none"
            if (navbar.value?.classList.contains("open")) {
                isOpen.value = false
                document.body.style.overflow = "unset"
                document.body.style.position = "unset"
                document.body.style.width = "unset"
            }
            const element = document.querySelector(".nav-link.show")
            if (element) {
                element.classList.remove("show")
                ;(element.nextElementSibling as HTMLElement)?.classList.remove("show")
            }
        } else {
            document.body.style.overflow = "hidden"
            document.body.style.position = "fixed"
            document.body.style.width = "100%"
            isOpen.value = !isOpen.value
        }
    }

    function logoClick() {
        globalClick(true)
    }

    function showDownloadLogosModal(event: Event) {
        event.preventDefault()
        showDownloadLogos.value = true
    }

    function closeDownloadLogosModal() {
        showDownloadLogos.value = false
    }
</script>

<style lang="scss" scoped>

@mixin dark-nav-content {
    a.nav-link:not(.btn),
    .nav-item a:not(.btn),
    div.nav-items a:not(.btn),
    .navbar-toggler {
        color: $white;

        &:hover,
        &.show {
            background-color: rgba(255, 255, 255, 0.1);
            color: $white;
            border-radius: $border-radius;
        }
    }

    .material-design-icon {
        color: $white;

        &:hover {
            color: rgba(255, 255, 255, 0.83);
        }
    }
}

nav {
    transform: translateY(0);
    max-height: 100%;
    width: 100vw;
    background-color: transparent;
    color: var(--ks-content-primary);
    transition: background-color 250ms ease-in-out;

    @include media-breakpoint-down(lg) {
        padding: 0;
    }

    &.scrolled,
    &.open {
        @supports (backdrop-filter: none) {
            background-color: var(--ks-background-header);
            backdrop-filter: $menu-backdrop-filter;
            -webkit-backdrop-filter: $menu-backdrop-filter;
            transition: background-color 250ms ease-in-out;
        }

        @include media-breakpoint-down(lg) {
            background-color: var(--ks-background-primary);
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

        @supports (backdrop-filter: none) {
            @include media-breakpoint-down(lg) {
                content: none;
            }
        }
    }

    .container-xl {
        @include media-breakpoint-down(xxl) {
            .navbar-brand {
                margin: 0 0.5rem 0 0;
            }
        }

        @include media-breakpoint-down(lg) {
            padding: 0;
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

        .download-logos-container {
            position: fixed;
            inset: 0;
            height: 100vh;
            z-index: 4;

            .download-logos {
                position: fixed;
                top: 100%;
                left: 14%;
                border-radius: calc($border-radius-lg * 2);
                border: $block-border;
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
                    font-size: $font-size-md;
                    font-weight: 400;
                    line-height: 24px;
                }

                .close-icon {
                    position: absolute;
                    top: $rem-1;
                    right: $rem-1;
                    cursor: pointer;
                }
            }
        }
    }

    &.open .container-xl .nav-items {

        .icon-button,
        button.navbar-toggler {
            color: var(--ks-content-primary) !important;
        }
    }

    a.nav-link {
        display: flex !important;
        align-items: center;
        gap: 4px;
        color: var(--ks-content-primary);
        font-size: $font-size-base;
        font-weight: 600;
        padding: 3px;
        padding-left: 12px !important;
        border-radius: $border-radius;
        transition: background-color 0.2s ease;

        &:hover,
        &.show {
            @include media-breakpoint-up(lg) {
                background-color: var(--ks-background-tertiary);
                border-color: var(--ks-border-primary);
            }
        }

        .dropdown-chevron {
            font-size: 18px;
            display: flex;
            align-items: center;
            transition: transform 0.3s ease;

            :deep(.material-design-icon__svg) {
                bottom: -1px !important;
            }
        }
    }

    a.talk-us {
        border: $block-border;
        color: var(--ks-content-secondary) !important;

        &:hover {
            background-color: var(--ks-background-tertiary);
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
            overflow: auto hidden;
            height: calc(100vh - 3.3rem);
            padding: 0 $rem-2;
            transition: all 0.25s ease-in-out;
            background: var(--ks-background-body);

            &.collapsing {
                height: 0;
                opacity: 0;
                transition: all 0.1s ease-in-out;
            }
        }

        ul.navbar-nav li {
            a.dropdown-item {
                white-space: unset;
                text-transform: capitalize;
                padding: $rem-1 5px;
            }

            @include media-breakpoint-between(lg, xxl) {
                font-size: $font-size-md;
            }

            a.nav-link {
                border-radius: $border-radius;

                span.material-design-icon {
                    transition: all 0.2s cubic-bezier(1, 0.25, 0.25, 0.8);
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
                    color: var(--ks-content-primary) !important;
                    font-size: $font-size-lg !important;
                    font-weight: 600;
                    border-bottom: $block-border;
                    padding: 1.5rem 0 !important;
                    line-height: 26px;
                }

                @include media-breakpoint-down(xl) {
                    font-size: 14px;
                }

                &::after {
                    display: none;
                }

                &.show {
                    @include media-breakpoint-down(lg) {
                        padding-bottom: 0 !important;
                        padding-left: 0 !important;
                        border: 0;
                        background-color: var(--ks-background-primary);
                    }

                    .dropdown-chevron {
                        transform: rotate(180deg);
                    }
                }
            }

            .dropdown-menu {
                padding: 0 calc($spacer * 1.875) calc($spacer * 1.875);
                margin-top: 10px;

                &.show {
                    @include media-breakpoint-down(lg) {
                        border-radius: 0;
                        display: block;
                        border: none;
                        padding: 0 !important;
                    }
                }

                .dropdown-column {
                    padding-bottom: 0;
                    display: flex;
                    flex-direction: column;
                    list-style: none;
                    padding-left: 0;
                    min-width: 312px;

                    .column-caption {
                        font-size: $font-size-xs;
                        font-weight: 600;
                        line-height: 24px;
                        margin: 0;
                        text-transform: uppercase;
                        background-color: var(--ks-background-primary);
                        color: var(--ks-content-primary);
                    }
                }

                li {
                    background-color: var(--ks-background-primary);
                    color: var(--ks-content-primary);
                    border: 0 !important;

                    &:not(:last-of-type) {
                        border-bottom: none !important;
                    }

                    .item-row {
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    .dropdown-item {
                        --bs-dropdown-link-hover-color: var(--ks-content-link);
                        --bs-dropdown-link-hover-bg: var(--ks-background-primary);
                        --bs-dropdown-link-active-color: var(--ks-content-color-highlight);
                        --bs-dropdown-link-active-bg: var(--ks-background-primary);

                        &:last-child {
                            margin-bottom: 0;
                        }

                        span {
                            display: inline-block;
                            font-size: $font-size-base;
                            font-weight: 700;
                            line-height: 1.37rem;
                            flex-shrink: 0;
                            margin-right: 0.5rem;
                            color: var(--ks-content-primary);
                        }

                        strong.tag {
                            background-color: var(--ks-background-alert-info);
                            border: 1px solid var(--ks-border-alert-info);
                            padding: 0 6px;
                            border-radius: 4px;
                            font-size: $font-size-md;
                            font-weight: 700;
                            color: var(--ks-content-alert-info);
                        }

                        :deep(.material-design-icon__svg) {
                            fill: var(--ks-content-link);
                            width: 24px;
                            height: 24px;
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

            .btn.icon-button {
                font-size: 1.5rem;
                color: var(--ks-content-primary);

                &:hover {
                    color: var(--ks-content-color-highlight);
                }
            }
        }
    }

    .nav-footer {
        @include media-breakpoint-down(lg) {
            display: flex;
            width: 100%;
            padding: $rem-2 $rem-2 30%;

            li {
                display: flex;
                justify-content: space-around;
                align-items: center;
                border: 0 !important;
            }

            .get-started {
                padding: calc($spacer * 0.65) $spacer !important;
            }
        }

        @include media-breakpoint-down(md) {
            li {
                flex-direction: column-reverse;
                align-items: center;
                gap: $spacer;

                a {
                    width: 100%;
                }
            }

            .github {
                width: 100%;
            }
        }
    }

    &.transparent {
        background: transparent;
        box-shadow: none;

        a,
        a.nav-link,
        &.btn.search {
            color: $white;
        }

        .navbar-collapse ul.navbar-nav li a.nav-link {

            &.show,
            &:hover {
                color: var(--ks-content-link);
                background: rgba(var(--ks-background-secondary), 0.05);
            }
        }

        @include media-breakpoint-down(lg) {
            &.open {
                background: var(--ks-background-body);
            }

            .navbar-collapse ul.navbar-nav li .dropdown-menu .dropdown-item {
                color: $white;
                --bs-dropdown-link-hover-bg: #{rgba(var(--ks-background-secondary), 0.05)};
                --bs-dropdown-link-active-bg: #{rgba(var(--ks-background-secondary), 0.05)};
            }

            .dropdown-menu {
                background: transparent;
            }
        }
    }

    @at-root html.light & .navbar-brand {
        .logo-dark {
            display: none;
        }

        .logo-light {
            display: block;
        }
    }

    @at-root html.dark & .navbar-brand {
        .logo-dark {
            display: block;
        }

        .logo-light {
            display: none;
        }
    }

    @at-root {
        html.light body[data-header-theme="dark"] &:not(.scrolled):not(.open) {
            .navbar-brand {
                .logo-dark {
                    display: block;
                }

                .logo-light {
                    display: none;
                }
            }

            @include dark-nav-content;
        }

        body[data-header-theme="darkBg"] &:not(.scrolled):not(.open) {
            background-color: var(--header-dark-bg, #0a0b0d);

            .navbar-brand {
                .logo-dark {
                    display: block !important;
                }

                .logo-light {
                    display: none !important;
                }
            }

            @include dark-nav-content;
        }

        html.dark & {
            @include dark-nav-content;
        }
    }

    .menu-container {
        position: absolute;
        top: calc(100% - 14px);
        left: 0;
        width: 100%;
        height: 1000px;
        z-index: 1;
        perspective: 2000px;
        transition: opacity 450ms;
        pointer-events: none;

        .header-arrow {
            position: absolute;
            top: -10px;
            left: 50%;
            margin-left: -6px;
            width: 20px;
            height: 20px;
            border-radius: 3px 0 0 0;
            transition: transform 450ms;
            z-index: 2;
            background: var(--ks-background-secondary);
            border: 0;
        }

        .menu-shadow-container {
            position: absolute;
            inset: 0;
            max-width: 100%;

            .header-menu {
                display: inline-block;
                padding-top: 10px;
                transform-origin: 50% -50px;
                transition: height 350ms, width 250ms;
                z-index: 2;
                position: absolute;
                top: -2px;
                left: 0;
                pointer-events: none;
                max-width: 100vw;

                .header-menu-card {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    z-index: 1;
                    border-radius: $border-radius-lg;
                    border: 1px solid var(--ks-border-secondary);
                    overflow: hidden;
                    background: var(--ks-background-body);

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
                            padding: $rem-2;
                            width: 100%;
                            height: 100%;
                            overflow: auto hidden;
                            position: relative;
                            display: flex;
                            align-items: center;
                            justify-content: center;

                            &::-webkit-scrollbar {
                                height: 4px;
                                width: 4px;
                            }

                            &::-webkit-scrollbar-track {
                                background: transparent;
                            }

                            &::-webkit-scrollbar-thumb {
                                background: transparent;
                                border-radius: 0;

                                &:hover {
                                    background: transparent;
                                }
                            }

                            .menu-title {
                                margin-bottom: 1.5rem;

                                p {
                                    font-size: $font-size-xs;
                                    font-weight: 400;
                                    text-transform: uppercase;
                                }
                            }

                            ul {
                                list-style: none;
                                padding: 0;
                                margin: 0;

                                li:last-child {
                                    margin-bottom: 0;
                                }
                            }

                            .dropdown-item {
                                align-items: flex-start;
                                border-radius: $border-radius-lg !important;
                                display: flex !important;
                                flex-direction: row;
                                padding: $rem-1;
                                min-width: 330px;
                                width: 100%;
                                text-transform: capitalize;

                                .same-row {
                                    display: flex;
                                    align-items: center;

                                    strong.tag {
                                        background-color: #c7f0ff;
                                        border: 1px solid #7fbbff;
                                        padding: 4px 6px;
                                        border-radius: 4px;
                                        font-size: $font-size-xs;
                                        margin-left: 8px;
                                        font-weight: 700;
                                        color: #134ecc;
                                    }
                                }

                                span {
                                    display: inline-flex;
                                    font-size: $font-size-md;
                                    font-weight: 600;
                                    margin-bottom: 0.25rem;
                                    transition: color 0.2s ease;
                                }

                                .material-design-icon {
                                    flex-shrink: 0;
                                    font-size: 24px;
                                    margin: -0.25rem 8px 0 0;
                                    align-self: unset;
                                    color: var(--ks-content-link);
                                    transition: color 0.2s ease;
                                }

                                &:hover {
                                    background: var(--ks-background-tertiary);

                                    .material-design-icon,
                                    span {
                                        color: var(--ks-content-link) !important;
                                    }
                                }

                                p {
                                    font-weight: 400;
                                    font-size: $font-size-sm;
                                    line-height: 1.4rem;
                                    margin: 0;
                                }
                            }

                            .header-solution-column {
                                position: relative;
                                width: 400px;

                                &:first-child {
                                    padding-right: $rem-2;
                                }

                                &:nth-child(2) {
                                    padding: 0 4rem 0 $rem-2;
                                }

                                &:last-child {
                                    padding: 0 $rem-2;
                                }

                                &:not(:last-child)::after {
                                    content: "";
                                    position: absolute;
                                    right: 0;
                                    top: -2.75rem;
                                    bottom: -2.75rem;
                                    width: 1px;
                                    background-color: var(--ks-border-primary);
                                }

                                .menu-title {
                                    margin-left: 1.25rem;
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
}
    .navbar-brand {
        :deep(svg) {
            width: 180px;
            height: auto;
        }
    }
</style>