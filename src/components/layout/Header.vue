<template>
    <nav
        id="top-bar"
        ref="navbar"
        class="navbar navbar-expand-xl fixed-top"
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
                    class="btn btn-sm icon-button p-0 d-xl-none"
                    data-bs-toggle="modal"
                    data-bs-target="#search-modal"
                    title="Search"
                >
                    <Magnify />
                </a>
                <button
                    class="navbar-toggler d-flex d-xl-none align-items-center gap-2"
                    @click="globalClick(isOpen)"
                    type="button"
                    aria-controls="main-header"
                    :aria-expanded="isOpen"
                    aria-label="Toggle navigation"
                >
                    <span class="menu-text">{{
                        isOpen ? "Close" : "Menu"
                    }}</span>
                    <Segment v-if="!isOpen" />
                    <Close v-if="isOpen" />
                </button>
            </div>

            <div class="collapse navbar-collapse" id="main-header">
                <ul class="navbar-nav me-auto mb-2 mb-xl-0 ms-xl-3">
                    <li
                        class="nav-item dropdown"
                        @mouseover="mouseOver('product', $event)"
                        @mouseleave="mouseOut('product')"
                    >
                        <a
                            class="nav-link dropdown-toggle"
                            :class="{
                                show: showMenuId === 'product' && showMenu,
                            }"
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
                        <div class="dropdown-menu d-xl-none">
                            <ul class="dropdown-column">
                                <li
                                    v-for="item in menuItems.product.items"
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
                                            <strong
                                                v-if="item.tag"
                                                class="tag"
                                                :class="{
                                                    hiring:
                                                        item.tag === 'Hiring!',
                                                }"
                                                >{{ item.tag }}</strong
                                            >
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li
                        class="nav-item dropdown"
                        @mouseover="mouseOver('solutions', $event)"
                        @mouseleave="mouseOut('solutions')"
                    >
                        <a
                            class="nav-link dropdown-toggle"
                            :class="{
                                show: showMenuId === 'solutions' && showMenu,
                            }"
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
                        <div class="dropdown-menu d-xl-none">
                            <ul class="dropdown-column">
                                <p class="column-caption">Use-cases</p>
                                <li
                                    v-for="item in menuItems.solutions.useCases"
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
                                <p class="column-caption">Users</p>
                                <li
                                    v-for="item in menuItems.solutions.user"
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
                                <p class="column-caption">Industries</p>
                                <li
                                    v-for="item in menuItems.solutions.industry"
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
                    <li
                        class="nav-item dropdown"
                        @mouseover="mouseOver('resources', $event)"
                        @mouseleave="mouseOut('resources')"
                    >
                        <a
                            class="nav-link dropdown-toggle"
                            :class="{
                                show: showMenuId === 'resources' && showMenu,
                            }"
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
                        <div class="dropdown-menu d-xl-none">
                            <ul class="dropdown-column">
                                <li
                                    v-for="item in menuItems.resources.items"
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
                    <li
                        class="nav-item dropdown"
                        @mouseover="mouseOver('company', $event)"
                        @mouseleave="mouseOut('company')"
                    >
                        <a
                            class="nav-link dropdown-toggle"
                            :class="{
                                show: showMenuId === 'company' && showMenu,
                            }"
                            href="#"
                            role="button"
                            :data-bs-toggle="isMobile ? 'dropdown' : undefined"
                            aria-expanded="false"
                        >
                            Company
                            <ChevronDown
                                class="d-inline-block dropdown-chevron"
                            />
                        </a>
                        <div class="dropdown-menu d-xl-none">
                            <ul class="dropdown-column">
                                <li
                                    v-for="item in menuItems.company.items"
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
                                            <strong
                                                v-if="item.tag"
                                                class="tag"
                                                :class="{
                                                    hiring:
                                                        item.tag === 'Hiring!',
                                                }"
                                                >{{ item.tag }}</strong
                                            >
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a
                            class="nav-link"
                            href="/pricing"
                            @click="globalClick(true)"
                        >
                            <span>Pricing</span>
                        </a>
                    </li>
                </ul>

                <ul class="navbar-nav mb-2 mb-xl-0 nav-button nav-footer">
                    <li class="nav-item">
                        <a
                            @click="globalClick(true)"
                            href="https://kestra.io/slack"
                            target="_blank"
                            class="d-none d-xl-inline-flex mb-1 align-items-center me-3 slack-link"
                        >
                            <span
                                class="slack-icon"
                                :class="{
                                    'slack-icon--dark':
                                        isScrolled || props.scrolled || isOpen,
                                }"
                                v-html="SlackIcon"
                            />
                        </a>
                        <GithubButton
                            :small="true"
                            class="d-block d-sm-inline-block mb-1"
                        />
                        <a
                            @click="globalClick(true)"
                            class="d-none mb-1 btn btn-sm btn-secondary me-0 me-sm-2 d-xl-inline-block"
                            href="/demo"
                        >
                            <span> Contact Sales</span>
                        </a>
                        <a
                            @click="globalClick(true)"
                            href="https://kestra.io/slack"
                            target="_blank"
                            class="d-xl-none d-flex justify-content-center mb-1 btn btn-sm btn-outline-dark align-items-center gap-2"
                        >
                            <span
                                class="slack-icon slack-icon--dark slack-icon--hover"
                                v-html="SlackIcon"
                            />
                            <span>Join us on Slack</span>
                        </a>
                        <a
                            @click="globalClick(true)"
                            class="d-block d-sm-inline-block mb-1 btn btn-primary btn-sm get-started"
                            href="/docs/quickstart#start-kestra"
                        >
                            <span> Get Started </span>
                        </a>
                        <a
                            @click="globalClick(true)"
                            class="d-xl-none d-sm-inline-block mb-1 btn btn-secondary btn-md"
                            href="/demo"
                        >
                            <span> Book a Demo</span>
                        </a>
                        <button
                            @click="globalClick(true)"
                            id="header-search-button"
                            class="btn btn-sm d-none d-xl-inline-block icon-button"
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
            class="d-xl-block d-none menu-container"
            :style="{ opacity: showMenu || mouseoverMenu ? 100 : 0 }"
        >
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
                        <div id="product" class="header-menu-card-section">
                            <div class="header-menu-content">
                                <div class="header-menu-card-section-column">
                                    <ul class="d-flex flex-column w-100">
                                        <li
                                            v-for="item in menuItems.product
                                                .items"
                                            :key="item.link"
                                        >
                                            <a
                                                class="dropdown-item"
                                                :href="item.link"
                                                @click="globalClick(true)"
                                            >
                                                <div>
                                                    <div class="same-row">
                                                        <component
                                                            :is="item.icon"
                                                        />
                                                        <span>{{
                                                            item.title
                                                        }}</span>
                                                        <strong
                                                            v-if="item.tag"
                                                            class="tag"
                                                            :class="{
                                                                hiring:
                                                                    item.tag ===
                                                                    'Hiring!',
                                                            }"
                                                            >{{
                                                                item.tag
                                                            }}</strong
                                                        >
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div id="solutions" class="header-menu-card-section">
                            <div class="header-menu-content">
                                <div
                                    class="row w-100 h-100 flex-nowrap"
                                    style="--bs-gutter-x: 10px"
                                >
                                    <div class="col-xl-4">
                                        <p class="solutions-col-heading">
                                            Use-cases
                                        </p>
                                        <ul>
                                            <li
                                                v-for="item in menuItems
                                                    .solutions.useCases"
                                                :key="item.link"
                                            >
                                                <a
                                                    class="dropdown-item"
                                                    :href="item.link"
                                                    @click="globalClick(true)"
                                                >
                                                    <div>
                                                        <div class="same-row">
                                                            <component
                                                                :is="item.icon"
                                                            />
                                                            <span>{{
                                                                item.title
                                                            }}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-xl-4">
                                        <p class="solutions-col-heading">
                                            Users
                                        </p>
                                        <ul>
                                            <li
                                                v-for="item in menuItems
                                                    .solutions.user"
                                                :key="item.link"
                                            >
                                                <a
                                                    class="dropdown-item"
                                                    :href="item.link"
                                                    @click="globalClick(true)"
                                                >
                                                    <div>
                                                        <div class="same-row">
                                                            <component
                                                                :is="item.icon"
                                                            />
                                                            <span>{{
                                                                item.title
                                                            }}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-xl-4">
                                        <p class="solutions-col-heading">
                                            Industries
                                        </p>
                                        <ul
                                            class="d-flex flex-column w-100 list-unstyled"
                                        >
                                            <li
                                                v-for="item in menuItems
                                                    .solutions.industry"
                                                :key="item.link"
                                            >
                                                <a
                                                    class="dropdown-item"
                                                    :href="item.link"
                                                    @click="globalClick(true)"
                                                >
                                                    <div>
                                                        <div class="same-row">
                                                            <component
                                                                :is="item.icon"
                                                            />
                                                            <span>{{
                                                                item.title
                                                            }}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="resources" class="header-menu-card-section">
                            <div class="header-menu-content">
                                <div class="header-menu-card-section-column">
                                    <ul class="d-flex flex-column w-100">
                                        <li
                                            v-for="item in menuItems.resources
                                                .items"
                                            :key="item.link"
                                        >
                                            <a
                                                class="dropdown-item"
                                                :href="item.link"
                                                @click="globalClick(true)"
                                            >
                                                <div>
                                                    <div class="same-row">
                                                        <component
                                                            :is="item.icon"
                                                        />
                                                        <span>{{
                                                            item.title
                                                        }}</span>
                                                        <strong
                                                            v-if="item.tag"
                                                            class="tag"
                                                            :class="{
                                                                hiring:
                                                                    item.tag ===
                                                                    'Hiring!',
                                                            }"
                                                            >{{
                                                                item.tag
                                                            }}</strong
                                                        >
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div id="company" class="header-menu-card-section">
                            <div class="header-menu-content">
                                <div class="header-menu-card-section-column">
                                    <ul class="d-flex flex-column w-100">
                                        <li
                                            v-for="item in menuItems.company
                                                .items"
                                            :key="item.link"
                                        >
                                            <a
                                                class="dropdown-item"
                                                :href="item.link"
                                                @click="globalClick(true)"
                                            >
                                                <div>
                                                    <div class="same-row">
                                                        <component
                                                            :is="item.icon"
                                                        />
                                                        <span>{{
                                                            item.title
                                                        }}</span>
                                                        <strong
                                                            v-if="item.tag"
                                                            class="tag"
                                                            :class="{
                                                                hiring:
                                                                    item.tag ===
                                                                    'Hiring!',
                                                            }"
                                                            >{{
                                                                item.tag
                                                            }}</strong
                                                        >
                                                    </div>
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
    import SlackIcon from "~/assets/socials/slack.svg?raw"

    const props = defineProps<{
        scrolled?: boolean
        transparentHeader?: boolean
    }>()

    const isOpen = ref(false)
    const showDownloadLogos = ref(false)
    const showMenu = ref(false)
    const showMenuId = ref<string | null>(null)
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

    function getCollapseInstance(): Collapse | undefined {
        if (!collapse) {
            const BootstrapCollapse = window.$bootstrap?.Collapse
            if (BootstrapCollapse) {
                const el = document.getElementById("main-header")
                if (el) {
                    collapse = BootstrapCollapse.getOrCreateInstance(el, {
                        toggle: false,
                    })
                }
            }
        }
        return collapse
    }

    onMounted(() => {
        nextTick(() => {
            getCollapseInstance()
        })

        isMobile.value = window.innerWidth <= 1199
        window.addEventListener("resize", () => {
            isMobile.value = window.innerWidth <= 1199
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

    function mouseOver(id: string, event: MouseEvent) {
        if (window.innerWidth <= 1199) return

        if (closeMenuTimeout.value) {
            clearTimeout(closeMenuTimeout.value)
            closeMenuTimeout.value = null
        }

        const menu = document.getElementById(id)
        if (!menu) return

        if (showMenuId.value === id && showMenu.value) {
            headerMenuPointerEvents.value = "auto"
            return
        }

        document.querySelectorAll(".header-menu-card-section").forEach((el) => {
            el.classList.remove("opacity-100", "z-1")
        })

        showMenu.value = true
        showMenuId.value = id
        mouseoverMenu.value = false
        headerMenuPointerEvents.value = "auto"
        headerMenuSize.value = menuSize(id)

        const { left, width } = (
            event.currentTarget as HTMLElement
        ).getBoundingClientRect()
        const menuWidth = parseInt(headerMenuSize.value.width)
        const offset = id === "solutions" ? 0 : 45
        const maxLeft = window.innerWidth - menuWidth - 16
        headerMenuTranslateX.value = `${Math.max(16, Math.min(left - offset, maxLeft))}px`

        menu.classList.add("z-1", "opacity-100")
    }

    function mouseOut(id: string) {
        if (window.innerWidth > 1199) {
            let menu = document.getElementById(id)
            if (menu) {
                closeMenuTimeout.value = setTimeout(() => {
                    headerMenuPointerEvents.value = "none"
                    showMenu.value = false
                    showMenuId.value = null
                }, 150)
            }
        }
    }

    function globalClick(close?: boolean) {
        if (window.innerWidth < 1200) {
            const collapseInstance = getCollapseInstance()
            if (close === true) {
                collapseInstance?.hide()
                isOpen.value = false
            } else if (close === false) {
                collapseInstance?.show()
                isOpen.value = true
            } else {
                collapseInstance?.toggle()
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
                ;(element.nextElementSibling as HTMLElement)?.classList.remove(
                    "show",
                )
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
    @mixin dark-nav-content($color: $white) {
        a.nav-link:not(.btn),
        .nav-item a:not(.btn),
        div.nav-items a:not(.btn),
        .navbar-toggler {
            color: $color;

            &:hover,
            &.show {
                background-color: rgba($color, 0.08);
                color: $color;
                border-radius: $border-radius;
            }
        }

        .material-design-icon {
            color: $color;

            &:hover {
                color: rgba($color, 0.83);
            }
        }
    }

    @mixin tag-badge {
        background: var(--ks-background-tag-category);
        padding: 2px 8px;
        border-radius: 40px;
        font-size: $font-size-xs;
        font-weight: 600;
        margin-left: 0.25rem;
        color: var(--ks-content-tag-category);

        &.hiring {
            background-color: var(--ks-background-alert-danger);
            color: var(--ks-content-alert-danger);
        }
    }

    nav {
        transform: translateY(0);
        max-height: 67px;
        width: 100vw;
        max-width: 100%;
        background-color: transparent;
        color: var(--ks-content-primary);
        transition: background-color 250ms ease-in-out;
        z-index: 1030;
        @include media-breakpoint-down(xl) {
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

            @include media-breakpoint-down(xl) {
                @supports not (backdrop-filter: none) {
                    background-color: var(--ks-background-primary);
                }
            }
        }

        &.open {
            @include media-breakpoint-down(xl) {
                background-color: var(--ks-background-body);
            }
        }

        .container-xl {
            @include media-breakpoint-down(xxl) {
                .navbar-brand {
                    margin: 0 0.5rem 0 0;
                }
            }

            @include media-breakpoint-down(xl) {
                padding: 0;

                .navbar-brand {
                    margin: 0 0 calc($spacer * 0.75) $spacer;
                }

                .nav-items {
                    margin: 0 $spacer calc($spacer * 0.75) 0;

                    span.menu-text {
                        margin-top: calc($spacer * 0.3);
                        color: var(--ks-content-tertiary) !important;
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
                    background-color: var(--ks-background-primary);
                    transition-duration: 1s;
                    z-index: 5;

                    @include media-breakpoint-down(xl) {
                        left: 5%;
                        top: 110%;
                    }

                    p.title {
                        font-size: $font-size-md;
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

            @include media-breakpoint-between(xl, xxl) {
                padding-left: 8px !important;
                gap: 2px;
            }

            &:hover,
            &.show {
                @include media-breakpoint-up(xl) {
                    background-color: var(--ks-background-tertiary);
                    border-color: var(--ks-border-primary);
                }
            }

            .dropdown-chevron {
                font-size: 18px;
                display: flex;
                align-items: center;
                pointer-events: none;
                transition: transform 0.3s ease;

                :deep(.material-design-icon__svg) {
                    bottom: -1px !important;
                }
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
            font-family: $font-family-monospace;
            font-size: $font-size-sm;
            padding-right: 0;

            &:focus {
                box-shadow: none;
            }
        }

        .navbar-collapse {
            max-width: 100%;

            @include media-breakpoint-down(xl) {
                max-height: calc(100vh - 4rem);
                min-height: calc(100vh - 4rem);
                overflow-y: auto;
                overflow-x: hidden;
                height: auto;
                transition: all 0.25s ease-in-out;
                background: var(--ks-background-body);
                margin-top: -0.25rem;

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
                    padding: $rem-1 $rem-2;
                }

                @include media-breakpoint-between(xl, xxl) {
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

                    @include media-breakpoint-down(xl) {
                        display: flex;
                        justify-content: space-between;
                        border-radius: 0;
                        color: var(--ks-content-primary) !important;
                        font-size: $font-size-md !important;
                        font-weight: 600;
                        padding: 24px 32px !important;
                        background-color: transparent !important;
                        border-bottom: $block-border !important;
                    }

                    @include media-breakpoint-down(xl) {
                        font-size: 14px;
                    }

                    &::after {
                        display: none;
                    }

                    &.show {
                        .dropdown-chevron {
                            transform: rotate(180deg) translateY(-2px);
                        }
                    }
                }

                .dropdown-menu {
                    padding: 0 calc($spacer * 1.875) calc($spacer * 1.875);
                    margin-top: 10px;

                    &.show {
                        @include media-breakpoint-down(xl) {
                            border-radius: 0;
                            display: block;
                            border: none;
                            padding: 0 !important;
                            background: transparent;
                            margin-top: 0;
                        }
                    }

                    .dropdown-column {
                        padding-bottom: 0;
                        display: flex;
                        flex-direction: column;
                        list-style: none;
                        padding-left: 0;
                        min-width: 312px;
                        background-color: var(--ks-background-secondary);

                        .column-caption {
                            font-size: $font-size-xs;
                            font-weight: 600;
                            margin: 0;
                            padding: 1rem 32px;
                            text-transform: capitalize;
                            color: var(--ks-content-primary);
                        }
                    }

                    li {
                        color: var(--ks-content-primary);
                        border: 0 !important;

                        &:not(:last-of-type) {
                            border-bottom: none !important;
                        }

                        .item-row {
                            display: flex;
                            align-items: center;
                            gap: 1rem;
                        }

                        .dropdown-item {
                            --bs-dropdown-link-hover-color: var(--ks-icon-colr);
                            --bs-dropdown-link-hover-bg: var(
                                --ks-background-purple-light
                            );
                            --bs-dropdown-link-active-color: var(
                                --ks-content-color-highlight
                            );
                            --bs-dropdown-link-active-bg: var(
                                --ks-background-purple-light
                            );

                            &:last-child {
                                margin-bottom: 0;
                            }

                            span {
                                display: inline-block;
                                font-size: $font-size-sm;
                                font-weight: 700;
                                line-height: 1.37rem;
                                flex-shrink: 0;
                                color: var(--ks-content-primary);
                            }

                            strong.tag {
                                @include tag-badge;
                            }

                            :deep(.material-design-icon__svg) {
                                color: var(--ks-icon-color);
                                font-size: 1.25rem;
                            }
                        }
                    }
                }
            }

            .nav-button {
                white-space: nowrap;
                flex-shrink: 0;

                li {
                    vertical-align: center;
                }

                @include media-breakpoint-between(xl, xxl) {
                    .btn {
                        padding-inline: 0.5rem;
                        font-size: $font-size-sm;
                    }
                }

                .btn-md {
                    border-radius: 0.5rem !important;
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
            @include media-breakpoint-down(xl) {
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
            html.light
                body[data-header-theme="dark"]
                &:not(.scrolled):not(.open) {
                .navbar-brand {
                    .logo-dark {
                        display: block;
                    }

                    .logo-light {
                        display: none;
                    }
                }

                @include dark-nav-content;

                .slack-link .slack-icon :deep(svg) {
                    filter: brightness(0) invert(1);
                }
            }

            html.dark
                body[data-header-theme="light"]
                &:not(.scrolled):not(.open) {
                .navbar-brand {
                    .logo-dark {
                        display: none;
                    }

                    .logo-light {
                        display: block;
                    }
                }

                @include dark-nav-content($black);
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

                .slack-link .slack-icon :deep(svg) {
                    filter: brightness(0) invert(1);
                }
            }

            html.dark & {
                @include dark-nav-content;

                .slack-link .slack-icon :deep(svg) {
                    filter: brightness(0) invert(1);
                }
            }
        }

        .menu-container {
            position: absolute;
            top: calc(100% - 14px);
            left: 0;
            z-index: 1;
            perspective: 2000px;
            transition: opacity 450ms;
            pointer-events: none;

            .menu-shadow-container {
                position: absolute;
                inset: 0;

                .header-menu {
                    display: inline-block;
                    padding-top: 10px;
                    transform-origin: 50% -50px;
                    transition:
                        height 350ms,
                        width 250ms;
                    z-index: 2;
                    position: absolute;
                    top: -2px;
                    left: 0;
                    pointer-events: none;

                    .header-menu-card {
                        width: 100%;
                        height: 100%;
                        position: relative;
                        z-index: 1;
                        border-radius: $border-radius-lg;
                        border: 1px solid var(--ks-border-secondary);
                        overflow: hidden;
                        background: var(--ks-background-primary);
                        box-shadow: 2px 3px 16px 0px var(--ks-shadows-light);

                        &-section {
                            max-width: 100vw;
                            width: 100%;
                            height: 100%;
                            display: flex;
                            opacity: 0;
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            padding: $rem-1;

                            &.opacity-100 {
                                transition: opacity 700ms ease;
                            }

                            .header-menu-content {
                                width: 100%;
                                height: 100%;
                                position: relative;
                                display: flex;
                                align-items: center;

                                .header-menu-card-section-column {
                                    width: 100%;

                                    ul {
                                        display: flex;
                                        flex-direction: column;
                                        gap: 8px;
                                    }
                                }

                                .solutions-col-heading {
                                    font-size: $font-size-xs;
                                    color: var(--ks-content-secondary);
                                    text-transform: capitalize;
                                    margin: 0 0 10px $rem-1;
                                }

                                ul {
                                    list-style: none;
                                    padding: 0;
                                    margin: 0;
                                    display: flex;
                                    flex-direction: column;
                                    gap: 8px;

                                    li {
                                        width: 100%;
                                    }

                                    li:last-child {
                                        margin-bottom: 0;
                                    }
                                }

                                .dropdown-item {
                                    align-items: flex-start;
                                    border-radius: $border-radius-lg !important;
                                    display: flex !important;
                                    flex-direction: row;
                                    width: 100%;
                                    text-transform: capitalize;
                                    max-height: fit-content;
                                    .same-row {
                                        display: flex;
                                        align-items: center;
                                        gap: 8px !important;
                                        padding: 0.5rem 1rem;

                                        strong.tag {
                                            @include tag-badge;
                                        }
                                    }

                                    span {
                                        display: inline-flex;
                                        font-size: $font-size-sm;
                                        font-weight: 600;
                                        transition: color 0.2s ease;
                                    }

                                    .material-design-icon {
                                        flex-shrink: 0;
                                        font-size: $font-size-base;
                                        margin: -0.25rem 8px 0 0;
                                        align-self: unset;
                                        color: var(--ks-icon-color);
                                        transition: color 0.2s ease;
                                    }

                                    &:hover {
                                        background: var(
                                            --ks-background-purple-light
                                        );

                                        .material-design-icon {
                                            color: var(
                                                --ks-icon-color
                                            ) !important;
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

    .slack-icon {
        :deep(svg) {
            width: 16px;
            height: 16px;
            filter: brightness(0);
        }
    }
</style>
