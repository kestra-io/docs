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
                    aria-controls="main-header"
                    :aria-expanded="isOpen"
                    aria-label="Toggle navigation"
                >
                    <span class="menu-text">{{ isOpen ? 'Close' : 'Menu' }}</span>
                    <Segment v-if="!isOpen" />
                    <Close v-if="isOpen" />
                </button>
            </div>

            <div class="collapse navbar-collapse" id="main-header">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
                    <li
                        class="nav-item dropdown"
                        @mouseover="mouseOver('product', $event)"
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
                        <div class="dropdown-menu d-lg-none">
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
                        @mouseover="mouseOver('solutions', $event)"
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
                        <div class="dropdown-menu d-lg-none">
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
                                <li v-for="item in menuItems.solutions.user" :key="item.link">
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
                                <li v-for="item in menuItems.solutions.industry" :key="item.link">
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
                            href="/pricing"
                            @click="globalClick(true)"
                        >
                            <span>Pricing</span>
                        </a>
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
                        <div class="dropdown-menu d-lg-none">
                            <ul class="dropdown-column">
                                <li v-for="item in menuItems.resources.items" :key="item.link">
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
                </ul>

                <ul class="navbar-nav mb-2 mb-lg-0 nav-button nav-footer">
                    <li class="nav-item">
                        <GithubButton
                            :small="true"
                            class="d-block d-sm-inline-block mb-1"
                        />
                        <a
                            @click="globalClick(true)"
                            class="d-none mb-1 btn btn-sm btn-secondary me-0 me-sm-2 d-lg-inline-block"
                            href="/demo"
                        >
                            <span> Book a demo </span>
                        </a>
                        <a
                            @click="globalClick(true)"
                            class="d-block d-sm-inline-block mb-1 btn btn-primary btn-sm get-started"
                            href="/docs/quickstart#start-kestra"
                        >
                            <span> Get Started! </span>
                        </a>
                        <a
                            @click="globalClick(true)"
                            class="d-lg-none d-sm-inline-block mb-1 btn btn-secondary btn-md"
                            href="/demo"
                        >
                            <span> Book a demo </span>
                        </a>
                        <button
                            @click="globalClick(true)"
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
                                    <ul class="d-flex flex-column w-100">
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
                                <div class="row w-100 h-100 flex-nowrap" style="--bs-gutter-x: 10px;">
                                    <div class="col-lg-4">
                                        <p class="solutions-col-heading">Use-cases</p>
                                        <ul>
                                            <li
                                                v-for="item in menuItems.solutions.useCases"
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
                                    <div class="col-lg-4">
                                        <p class="solutions-col-heading">Users</p>
                                        <ul>
                                            <li
                                                v-for="item in menuItems.solutions.user"
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
                                    <div class="col-lg-4">
                                        <p class="solutions-col-heading">Industries</p>
                                        <ul class="d-flex flex-column w-100 list-unstyled">
                                            <li
                                                v-for="item in menuItems.solutions.industry"
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
                                <div class="header-menu-card-section-column">
                                    <ul class="d-flex flex-column w-100">
                                        <li
                                            v-for="item in menuItems.resources.items"
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
                    collapse = BootstrapCollapse.getOrCreateInstance(el, { toggle: false })
                }
            }
        }
        return collapse
    }

    onMounted(() => {
        nextTick(() => {
            getCollapseInstance()
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

    function mouseOver(id: string, event: MouseEvent) {
        if (window.innerWidth <= 991) return

        if (closeMenuTimeout.value) {
            clearTimeout(closeMenuTimeout.value)
            closeMenuTimeout.value = null
        }

        const menu = document.getElementById(id)
        if (!menu) return

        document.querySelectorAll(".header-menu-card-section").forEach((el) => {
            el.classList.remove("opacity-100", "z-1")
        })

        showMenu.value = true
        showMenuId.value = id
        mouseoverMenu.value = false
        headerMenuPointerEvents.value = "auto"
        headerMenuSize.value = menuSize(id)

        const { left, width } = (event.currentTarget as HTMLElement).getBoundingClientRect()
        const menuWidth = parseInt(headerMenuSize.value.width)
        const offset = id === "solutions" ? 0 : 45
        const maxLeft = window.innerWidth - menuWidth - 16
        headerMenuTranslateX.value = `${Math.max(16, Math.min(left - offset, maxLeft))}px`

        menu.classList.add("z-1", "opacity-100")
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

<style lang="scss" src="~/assets/styles/components/header.scss" scoped />

<style lang="scss" scoped>
    .navbar-brand {
        :deep(svg) {
            width: 180px;
            height: auto;
        }
    }
</style>